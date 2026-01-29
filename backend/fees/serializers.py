from rest_framework import serializers
from .models import FeeTransaction  # ✅ Correct Model

class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeTransaction
        fields = "__all__"