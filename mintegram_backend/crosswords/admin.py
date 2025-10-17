# Înregistrare model AppSetting pentru tema globală
from .models import AppSetting

from .models import PuzzleStat

from .models import Category
from django.contrib import admin
from .models import Score, Challenge, Puzzle, Cell, Clue, Language, Difficulty
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin
from django.db.models import Count

admin.site.register(AppSetting)
@admin.register(PuzzleStat)
class PuzzleStatAdmin(admin.ModelAdmin):
    list_display = ("user", "puzzle", "time_spent", "mistakes", "wrong_letters", "completed", "completed_at")
    search_fields = ("user__username", "puzzle__title", "wrong_letters")
    list_filter = ("completed", "puzzle")

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ("user", "points", "date")
    search_fields = ("user__username",)
    list_filter = ("date",)

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = (
        "title", "recurrence", "points", "reward_coins", "reward_xp", "reward_badge", "reward_item",
        "progress_max", "deadline", "difficulty", "active", "start_date", "end_date"
    )
    list_filter = ("recurrence", "active", "difficulty", "deadline")
    search_fields = ("title", "description", "reward_badge", "reward_item")
    filter_horizontal = ("collaborators",)
    fieldsets = (
        (None, {
            "fields": ("title", "description", "points", "recurrence", "active", "start_date", "end_date")
        }),
        ("Rewards", {
            "fields": ("reward_coins", "reward_xp", "reward_badge", "reward_item")
        }),
        ("Progress & Difficulty", {
            "fields": ("progress_max", "deadline", "difficulty", "collaborators")
        }),
    )


# =========================
# Import/Export Resources
# =========================

class LanguageResource(resources.ModelResource):
    class Meta:
        model = Language
        fields = ("id", "code", "name")
        export_order = ("id", "code", "name")
        import_id_fields = ("id",)  # optional


class DifficultyResource(resources.ModelResource):
    class Meta:
        model = Difficulty
        fields = ("id", "code", "name")
        export_order = ("id", "code", "name")
        import_id_fields = ("id",)  # optional


class PuzzleResource(resources.ModelResource):
    # Import/export language & difficulty by code (not by numeric id)
    language = fields.Field(
        column_name="language",
        attribute="language",
        widget=ForeignKeyWidget(Language, "code")
    )
    difficulty = fields.Field(
        column_name="difficulty",
        attribute="difficulty",
        widget=ForeignKeyWidget(Difficulty, "code")
    )

    class Meta:
        model = Puzzle
        fields = (
            "id",
            "title",
            "language",
            "level",
            "difficulty",
            "rows",
            "cols",
            "notes",
            "photo",
            "created_at",
        )
        export_order = (
            "id",
            "title",
            "language",
            "level",
            "difficulty",
            "rows",
            "cols",
            "notes",
            "photo",
            "created_at",
        )
        import_id_fields = ("id",)  # optional


class CellResource(resources.ModelResource):
    puzzle = fields.Field(
        column_name="puzzle",
        attribute="puzzle",
        widget=ForeignKeyWidget(Puzzle, "id")  # keep by ID for speed
    )

    class Meta:
        model = Cell
        fields = ("id", "puzzle", "row", "col", "is_block", "solution", "number")
        export_order = ("id", "puzzle", "row", "col", "is_block", "solution", "number")
        import_id_fields = ("id",)  # optional


class ClueResource(resources.ModelResource):
    puzzle = fields.Field(
        column_name="puzzle",
        attribute="puzzle",
        widget=ForeignKeyWidget(Puzzle, "id")  # keep by ID for speed
    )

    class Meta:
        model = Clue
        # NOTE: `direction` uses the stored code ("lr"/"ud") on import/export
        fields = ("id", "puzzle", "number", "direction", "text", "answer", "start_row", "start_col")
        export_order = ("id", "puzzle", "number", "direction", "text", "answer", "start_row", "start_col")
        import_id_fields = ("id",)  # optional


# =========================
# Inlines
# =========================

class CellInline(admin.TabularInline):
    model = Cell
    extra = 0
    fields = ("row", "col", "is_block", "solution", "number")
    ordering = ("row", "col")


class ClueInline(admin.TabularInline):
    model = Clue
    extra = 0
    fields = ("number", "direction", "text", "answer", "start_row", "start_col")
    ordering = ("number", "direction")


# =========================
# Admin Actions
# =========================

@admin.action(description="Generate clues (renumber & set cell numbers)")
def action_generate_clues(modeladmin, request, queryset):
    done = 0
    for p in queryset:
        p.generate_clues(renumber=True, overwrite_text=False)
        done += 1
    modeladmin.message_user(request, f"Generated clues for {done} puzzle(s).")


@admin.action(description="Refresh answers (keep numbers, recompute answers/positions)")
def action_refresh_answers(modeladmin, request, queryset):
    done = 0
    for p in queryset:
        p.generate_clues(renumber=False, overwrite_text=False)
        done += 1
    modeladmin.message_user(request, f"Refreshed answers for {done} puzzle(s).")


@admin.action(description="Clear clues and cell numbers")
def action_clear_clues_and_numbers(modeladmin, request, queryset):
    done = 0
    for p in queryset:
        p.clues.all().delete()
        p.cells.update(number=None)
        done += 1
    modeladmin.message_user(request, f"Cleared clues & numbers for {done} puzzle(s).")


# =========================
# Admin Registrations
# =========================

@admin.register(Language)
class LanguageAdmin(ImportExportModelAdmin):
    resource_class = LanguageResource
    list_display = ("name", "code",)
    search_fields = ("name", "code",)
    ordering = ("name",)


@admin.register(Difficulty)
class DifficultyAdmin(ImportExportModelAdmin):
    resource_class = DifficultyResource
    list_display = ("name", "code",)
    search_fields = ("name", "code",)
    ordering = ("name",)


@admin.register(Puzzle)
class PuzzleAdmin(ImportExportModelAdmin):
    resource_class = PuzzleResource
    inlines = [CellInline, ClueInline]

    list_display = (
        "title",
        "language",
        "difficulty",
        "level",
        "rows",
        "cols",
        "clues_count",
        "cells_count",
        "created_at",
    )
    list_filter = ("language", "difficulty", "level", "rows", "cols", "created_at")
    search_fields = ("title", "notes")
    date_hierarchy = "created_at"
    readonly_fields = ("created_at",)
    autocomplete_fields = ("language", "difficulty")
    actions = [action_generate_clues, action_refresh_answers, action_clear_clues_and_numbers]
    ordering = ("-created_at",)

    fieldsets = (
        ("Basics", {
            "fields": ("title", "language", "difficulty", "level"),
        }),
        ("Grid", {
            "fields": ("rows", "cols"),
        }),
        ("Extras", {
            "fields": ("notes", "photo", "created_at"),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Annotate counts to avoid N+1 queries in list display
        return qs.annotate(
            _clues_count=Count("clues", distinct=True),
            _cells_count=Count("cells", distinct=True),
        )

    @admin.display(description="Clues", ordering="_clues_count")
    def clues_count(self, obj):
        return getattr(obj, "_clues_count", obj.clues.count())

    @admin.display(description="Cells", ordering="_cells_count")
    def cells_count(self, obj):
        return getattr(obj, "_cells_count", obj.cells.count())


@admin.register(Cell)
class CellAdmin(ImportExportModelAdmin):
    resource_class = CellResource
    list_display = ("puzzle", "row", "col", "is_block", "solution", "number")
    list_filter = ("puzzle", "is_block")
    search_fields = ("puzzle__title",)
    ordering = ("puzzle", "row", "col")
    raw_id_fields = ("puzzle",)  # faster with many puzzles


@admin.register(Clue)
class ClueAdmin(ImportExportModelAdmin):
    resource_class = ClueResource
    list_display = ("puzzle", "number", "get_direction_display", "text", "answer", "start_row", "start_col")
    list_filter = ("puzzle", "direction")
    search_fields = ("puzzle__title", "text", "answer")
    ordering = ("puzzle", "number", "direction")

    @admin.display(description="Direction")
    def get_direction_display(self, obj):
        return obj.get_direction_display()

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")
    ordering = ("name",)