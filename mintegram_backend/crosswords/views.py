from rest_framework import viewsets, permissions
from .models import Puzzle
from .serializers import PuzzleSerializer

class PuzzleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Puzzle.objects.all().order_by("-created_at")
    serializer_class = PuzzleSerializer
    permission_classes = [permissions.AllowAny]
