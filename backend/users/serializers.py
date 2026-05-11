from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "email", "password"]

    def create(self, validated_data):
        user = User(
            name=validated_data["name"],
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user