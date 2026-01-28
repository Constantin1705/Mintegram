from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Badge, User
from .serializers import BadgeSerializer

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pentru gestionarea insignelor.
    GET /api/badges/ - Lista tuturor insignelor
    GET /api/badges/{id}/ - Detaliile unei insigne
    GET /api/badges/user/{user_id}/ - Insignele unui utilizator
    """
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['GET'], permission_classes=[permissions.IsAuthenticated])
    def my_badges(self, request):
        """Returnează insignele utilizatorului curent"""
        user = request.user
        badges = user.badges.all()
        serializer = self.get_serializer(badges, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def user_badges(self, request):
        """Returnează insignele unui utilizator specific"""
        user_id = request.query_params.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            badges = user.badges.all()
            serializer = self.get_serializer(badges, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"detail": "Utilizator nu găsit."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['GET'])
    def leaderboard(self, request):
        """Clasament pe baza numărului de insigne câștigate"""
        users = User.objects.annotate(
            badge_count=Count('badges')
        ).order_by('-badge_count')[:10]
        
        data = [{
            'user_id': u.id,
            'username': u.username,
            'badge_count': u.badge_count,
            'profile_picture': u.profile_picture.url if u.profile_picture else None
        } for u in users]
        
        return Response(data)
