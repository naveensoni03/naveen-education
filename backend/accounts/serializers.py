from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agent

User = get_user_model()

# 🔹 LIST / GET
class AgentSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Agent
        fields = ["id", "name", "email", "phone", "department", "is_active"]


# 🔹 CREATE
class AgentCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField()
    department = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["name"],   # ✅ FIXED
            role="AGENT"
        )

        agent = Agent.objects.create(
            user=user,
            phone=validated_data["phone"],
            department=validated_data["department"]
        )
        return agent
