from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

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

        # încercăm să găsim întâi după username, apoi după email
        try:
            u = User.objects.get(username=identity)
        except User.DoesNotExist:
            try:
                u = User.objects.get(email=identity)
            except User.DoesNotExist:
                raise serializers.ValidationError("Utilizator inexistent.")

        # folosim authenticate cu username-ul real
        user = authenticate(username=u.username, password=password)
        if not user:
            raise serializers.ValidationError("Parolă incorectă.")
        attrs["user"] = user
        return attrs

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]




