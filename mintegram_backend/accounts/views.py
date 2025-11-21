from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, MeSerializer, ProductSerializer
from .models import Product
from django.contrib.auth import get_user_model

# Listare produse shop
class ShopListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

# Cumpărare produs shop
class ShopBuyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Produs inexistent."}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if user.coins < product.price:
            return Response({"detail": "Fonduri insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
        user.coins -= product.price
        user.save()
        # TODO: Acordă efectul produsului (ex: adaugă temă, indiciu etc.)
        return Response({"detail": f"Ai cumpărat {product.name}.", "coins": user.coins}, status=status.HTTP_200_OK)

 


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

class MeView(generics.RetrieveUpdateAPIView):
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
        coins = request.data.get("coins")

        if xp is not None:
            user.xp = xp
        if level is not None:
            user.level = level
        if diamonds is not None:
            user.diamonds = diamonds
        if coins is not None:
            user.coins = coins

        user.save()
        # Verifică și acordă badge-uri după update
        user.check_and_assign_badges()

        # Serializare badge-uri actualizate
        from .serializers import BadgeSerializer
        badges = BadgeSerializer(user.badges.all(), many=True).data

        return Response({
            "xp": user.xp,
            "level": user.level,
            "diamonds": user.diamonds,
            "coins": user.coins,
            "badges": badges,
        }, status=status.HTTP_200_OK)




