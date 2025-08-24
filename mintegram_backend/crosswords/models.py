from django.db import models, transaction


class Language(models.Model):
    code = models.CharField(max_length=5, unique=True)    # e.g. "ro", "fr", "en"
    name = models.CharField(max_length=50)                # e.g. "Română", "Français"

    def __str__(self):
        return self.name


class Difficulty(models.Model):
    code = models.CharField(max_length=100, unique=True)  # e.g. "easy", "hard", "god"
    name = models.CharField(max_length=200)              # e.g. "Easy", "Hard", "God"

    def __str__(self):
        return self.name

class EntitlementTier(models.TextChoices):
    FREE = "free", "Free"
    PLUS = "plus", "Plus"
    PRO  = "pro",  "Pro"


class Puzzle(models.Model):
    title = models.CharField(max_length=200)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.PositiveIntegerField(default=1)  # numeric level (1, 2, 3…)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.SET_NULL, null=True, blank=True)

    rows = models.PositiveIntegerField(default=10)
    cols = models.PositiveIntegerField(default=10)
    notes = models.TextField(blank=True)
    photo = models.ImageField(upload_to="puzzles/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # required_tier = models.CharField(
    #     max_length=16,
    #     choices=EntitlementTier.choices,
    #     default=EntitlementTier.FREE,
    #     help_text="Minimum tier needed to see full content (cells & clues)."
    # )

    def __str__(self):
        lang = self.language.name if self.language else "NoLang"
        diff = self.difficulty.name if self.difficulty else "NoDiff"
        return f"{self.title} [{lang}] (Lvl {self.level}, {diff})"

    @transaction.atomic
    def generate_clues(self, renumber: bool = True, overwrite_text: bool = False):
        """
        Create or refresh clues by scanning the grid.
        - renumber=True   : wipe existing clues & cell numbers and renumber from 1
        - overwrite_text  : if True, overwrite clue text when empty
        Fills 'answer' when every solution letter exists; otherwise leaves it empty.
        """
        grid = {(c.row, c.col): c for c in self.cells.all()}
        max_r, max_c = self.rows, self.cols

        if renumber:
            self.clues.all().delete()
            self.cells.update(number=None)

        number = 1

        def is_open(r, c):
            cell = grid.get((r, c))
            return cell is not None and not cell.is_block

        def collect_answer(r, c, direction):
            letters = []
            rr, cc = r, c
            while rr <= max_r and cc <= max_c and is_open(rr, cc):
                ch = grid[(rr, cc)].solution or ""
                letters.append(ch)
                if direction == "lr":
                    cc += 1
                else:
                    rr += 1
            if all(letters) and len(letters) > 0:
                return "".join(letters).upper()
            return ""

        for r in range(1, max_r + 1):
            for c in range(1, max_c + 1):
                if not is_open(r, c):
                    continue

                starts_lr = (c == 1 or not is_open(r, c - 1)) and is_open(r, c)
                starts_ud = (r == 1 or not is_open(r - 1, c)) and is_open(r, c)

                if not (starts_lr or starts_ud):
                    continue

                start_cell = grid[(r, c)]
                if start_cell.number != number:
                    start_cell.number = number
                    start_cell.save(update_fields=["number"])

                if starts_lr:
                    ans = collect_answer(r, c, "lr")
                    clue, created = Clue.objects.get_or_create(
                        puzzle=self,
                        number=number,
                        direction=Clue.Direction.LR,
                        defaults={
                            "text": "",
                            "answer": ans,
                            "start_row": r,
                            "start_col": c,
                        },
                    )
                    if not created:
                        clue.start_row = r
                        clue.start_col = c
                        if ans:
                            clue.answer = ans
                        if overwrite_text and not clue.text:
                            clue.text = ""
                        clue.save()

                if starts_ud:
                    ans = collect_answer(r, c, "ud")
                    clue, created = Clue.objects.get_or_create(
                        puzzle=self,
                        number=number,
                        direction=Clue.Direction.UD,
                        defaults={
                            "text": "",
                            "answer": ans,
                            "start_row": r,
                            "start_col": c,
                        },
                    )
                    if not created:
                        clue.start_row = r
                        clue.start_col = c
                        if ans:
                            clue.answer = ans
                        if overwrite_text and not clue.text:
                            clue.text = ""
                        clue.save()

                number += 1


class Cell(models.Model):
    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE, related_name="cells")
    row = models.PositiveIntegerField()   # 1-based
    col = models.PositiveIntegerField()   # 1-based
    is_block = models.BooleanField(default=False)  # black square
    solution = models.CharField(max_length=1, blank=True)  # letter (optional)
    number = models.PositiveIntegerField(blank=True, null=True)  # small corner number

    class Meta:
        unique_together = ("puzzle", "row", "col")

    def __str__(self):
        return f"Cell({self.row},{self.col}) of {self.puzzle.title}"


class Clue(models.Model):
    class Direction(models.TextChoices):
        LR = "lr", "Left→Right"
        UD = "ud", "Up→Down"

    puzzle = models.ForeignKey(Puzzle, on_delete=models.CASCADE, related_name="clues")
    number = models.PositiveIntegerField()
    direction = models.CharField(max_length=2, choices=Direction.choices)
    text = models.TextField()
    answer = models.CharField(max_length=100)
    start_row = models.PositiveIntegerField()
    start_col = models.PositiveIntegerField()

    class Meta:
        unique_together = ("puzzle", "number", "direction")

    def __str__(self):
        return f"{self.puzzle.title} {self.number}-{self.get_direction_display()}"
