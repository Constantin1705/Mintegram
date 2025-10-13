from rest_framework import generics, permissions
from .models import Badge
from .serializers import BadgeSerializer

class BadgeListView(generics.ListAPIView):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.AllowAny]
