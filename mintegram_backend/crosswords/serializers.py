from rest_framework import serializers
from .models import Puzzle, Cell, Clue

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

    class Meta:
        model = Puzzle
        fields = ("id", "title", "language", "rows", "cols", "notes", "photo", "cells", "clues")

