# resources.py
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import Puzzle, Cell, Clue

class CellResource(resources.ModelResource):
    puzzle = fields.Field(
        column_name="puzzle",        # exact numele din CSV
        attribute="puzzle",
        widget=ForeignKeyWidget(Puzzle, "id")
    )
    class Meta:
        model = Cell
        fields = ("id","puzzle","row","col","is_block","solution","number")

class ClueResource(resources.ModelResource):
    puzzle = fields.Field(
        column_name="puzzle",
        attribute="puzzle",
        widget=ForeignKeyWidget(Puzzle, "id")
    )
    class Meta:
        model = Clue
        fields = ("id","puzzle","number","direction","text","answer","start_row","start_col")
