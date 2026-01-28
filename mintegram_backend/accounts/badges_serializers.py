from rest_framework import serializers
from .models import Badge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = [
            'id',
            'name',
            'description',
            'icon',
            'condition_type',
            'condition_value',
            'color',
            'created_at'
        ]
