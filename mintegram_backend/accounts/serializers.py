from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import Badge, Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "type", "name", "price", "description", "image"]

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    user = serializers.CharField()      # username OR email
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identity = attrs.get("user")
        password = attrs.get("password")

        try:
            u = User.objects.get(username=identity)
        except User.DoesNotExist:
            try:
                u = User.objects.get(email=identity)
            except User.DoesNotExist:
                raise serializers.ValidationError("Utilizator inexistent.")

        user = authenticate(username=u.username, password=password)
        if not user:
            raise serializers.ValidationError("Parolă incorectă.")
        attrs["user"] = user
        return attrs


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["id", "name", "description", "icon"]


class MeSerializer(serializers.ModelSerializer):
    badges = BadgeSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "xp", "level", "diamonds", "coins", "profile_picture", "badges"]
        read_only_fields = ["xp", "level", "diamonds", "coins", "badges"]