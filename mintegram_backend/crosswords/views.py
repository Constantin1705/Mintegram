from .models import AppSetting
from rest_framework.views import APIView
from rest_framework.response import Response
# Endpoint pentru tema globală
from .models import PuzzleStat
from .serializers import PuzzleStatSerializer
from .models import Category
from .serializers import CategorySerializer
from rest_framework import filters
from rest_framework import viewsets, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from .models import Puzzle, Score, Challenge, ChallengeUser
from .serializers import PuzzleSerializer, ScoreSerializer, ChallengeSerializer, ChallengeUserSerializer

class ThemeSettingView(APIView):
    permission_classes = []
    def get(self, request):
        setting = AppSetting.objects.first()
        theme = setting.theme if setting else "light"
        return Response({"theme": theme})

    def patch(self, request):
        theme = request.data.get("theme")
        if theme not in ["light", "dark"]:
            return Response({"error": "Invalid theme"}, status=400)
        setting, _ = AppSetting.objects.get_or_create(id=1)
        setting.theme = theme
        setting.save()
        return Response({"theme": setting.theme})
class PuzzleStatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PuzzleStat.objects.all().order_by("-completed_at")
    serializer_class = PuzzleStatSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        puzzle_id = self.request.query_params.get("puzzle")
        if puzzle_id:
            qs = qs.filter(puzzle_id=puzzle_id)
        return qs.filter(user=user)
class ChallengeUserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin):
    queryset = ChallengeUser.objects.all()
    serializer_class = ChallengeUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Doar provocările utilizatorului curent
        return ChallengeUser.objects.filter(user=self.request.user)

class ScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Score.objects.all().order_by('-points')
    serializer_class = ScoreSerializer
    permission_classes = [permissions.AllowAny]

class ChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Challenge.objects.filter(active=True).order_by('start_date')
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.AllowAny]

    # ...existing code...

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        user = request.user
        challenge = self.get_object()
        cu, created = ChallengeUser.objects.get_or_create(user=user, challenge=challenge)
        cu.accepted = True
        cu.save()
        return Response({"accepted": True, "challenge": challenge.id})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def finalize(self, request, pk=None):
        user = request.user
        challenge = self.get_object()
        cu = ChallengeUser.objects.filter(user=user, challenge=challenge).first()
        if cu and cu.accepted and not cu.completed:
            cu.completed = True
            cu.completed_at = timezone.now()
            cu.points_awarded = challenge.points
            cu.save()
            # Recompense: monede/xp/badge/item
            user.coins += challenge.reward_coins
            user.save()
            return Response({"completed": True, "coins": user.coins, "xp": challenge.reward_xp, "badge": challenge.reward_badge, "item": challenge.reward_item})
        return Response({"completed": False, "error": "Provocarea nu a fost acceptată sau deja finalizată."}, status=400)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def progress(self, request, pk=None):
        user = request.user
        challenge = self.get_object()
        cu = ChallengeUser.objects.filter(user=user, challenge=challenge).first()
        progress = 0
        if cu:
            progress = 100 if cu.completed else (50 if cu.accepted else 0)
        return Response({"progress": progress, "accepted": cu.accepted if cu else False, "completed": cu.completed if cu else False})

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def leaderboard(self, request):
        # Top utilizatori după puncte din provocări
        qs = ChallengeUser.objects.values("user__username").annotate(total_points=Sum("points_awarded")).order_by("-total_points")[:10]
        return Response(list(qs))

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def history(self, request):
        user = request.user
        qs = ChallengeUser.objects.filter(user=user).order_by("-completed_at")
        data = ChallengeUserSerializer(qs, many=True).data
        return Response(data)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def refresh_progress(self, request, pk=None):
        # Returnează progresul actualizat instant
        return self.progress(request, pk)


## importuri eliminate, deja prezente la începutul fișierului

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class PuzzleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Puzzle.objects.all().order_by("-created_at")
    serializer_class = PuzzleSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "notes", "categories__name", "categories__code"]
    ordering_fields = ["created_at", "title", "level"]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        user = request.user
        puzzle = self.get_object()
        # Exemplu: 10 monede per integrame rezolvată
        reward = 10
        user.coins += reward
        user.save()
        return Response({"detail": f"Felicitări! Ai primit {reward} monede.", "coins": user.coins})
