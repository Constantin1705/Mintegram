from .models import PuzzleStat

from .models import Category
from rest_framework import serializers
from .models import Puzzle, Cell, Clue, Score, Challenge, ChallengeUser

class PuzzleStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleStat
        fields = ("id", "user", "puzzle", "time_spent", "mistakes", "wrong_letters", "completed", "completed_at")

class ChallengeUserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    challenge = serializers.StringRelatedField()
    class Meta:
        model = ChallengeUser
        fields = ["id", "user", "challenge", "accepted", "completed", "completed_at", "points_awarded"]

class ScoreSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Score
        fields = ["id", "user", "points", "date"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "code", "name")
class ChallengeSerializer(serializers.ModelSerializer):
    collaborators = serializers.StringRelatedField(many=True)
    class Meta:
        model = Challenge
        fields = [
            "id", "title", "description", "points", "reward_coins", "reward_xp", "reward_badge", "reward_item",
            "progress_max", "deadline", "difficulty", "collaborators", "recurrence", "active", "start_date", "end_date"
        ]

class CellSerializer(serializers.ModelSerializer):
    class Meta: model = Cell; fields = ("row","col","is_block","solution","number")

class ClueSerializer(serializers.ModelSerializer):
    direction = serializers.SerializerMethodField()

    class Meta:
        model = Clue
        fields = ("number","direction","text","answer","start_row","start_col")

    def get_direction(self, obj):
        val = obj.direction.lower()
        if val in ("lr", "left", "left-right"):
            return "across"
        if val in ("ud", "up", "up-down"):
            return "down"
        return val

class PuzzleSerializer(serializers.ModelSerializer):
    cells = CellSerializer(many=True, read_only=True)
    clues = ClueSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Puzzle
        fields = ("id", "title", "language", "rows", "cols", "notes", "photo", "cells", "clues", "categories")

