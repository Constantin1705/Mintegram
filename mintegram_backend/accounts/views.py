from rest_framework import generics, permissions,status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, MeSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
 


User = get_user_model()
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})

class MeView(generics.RetrieveAPIView):
    serializer_class = MeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UpdateProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        xp = request.data.get("xp")
        level = request.data.get("level")
        diamonds = request.data.get("diamonds")

        if xp is not None:
            user.xp = xp
        if level is not None:
            user.level = level
        if diamonds is not None:
            user.diamonds = diamonds

        user.save()

        return Response({
            "xp": user.xp,
            "level": user.level,
            "diamonds": user.diamonds,
        }, status=status.HTTP_200_OK)




