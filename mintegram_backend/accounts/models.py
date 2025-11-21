from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    diamonds = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)  # Monede pentru shop
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)

    def __str__(self):
        return self.username or self.email

    def check_and_assign_badges(self):
        """
        Verifică și acordă badge-uri pe baza condițiilor definite în admin pentru fiecare badge.
        """
        from accounts.models import Badge
        for badge in Badge.objects.exclude(condition_type__isnull=True).exclude(condition_value__isnull=True):
            user_value = None
            if badge.condition_type == "login_days":
                user_value = getattr(self, "login_days", 0)
            elif badge.condition_type == "integrame_rezolvate":
                user_value = getattr(self, "integrame_rezolvate", 0)
            elif badge.condition_type == "level":
                user_value = getattr(self, "level", 0)
            # Poți adăuga alte tipuri de condiții aici
            if user_value is not None and user_value >= badge.condition_value and badge not in self.badges.all():
                self.badges.add(badge)


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("hint", "Indiciu"),
        ("theme", "Temă"),
        ("skin", "Skin"),
        ("grid", "Model de grilă"),
    ]

    type = models.CharField(max_length=16, choices=PRODUCT_TYPE_CHOICES)
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="shop/", blank=True, null=True)

    def __str__(self):
        return f"{self.get_type_display()}: {self.name} ({self.price} monede)"

class Badge(models.Model):

    CONDITION_TYPE_CHOICES = [
        ("login_days", "Zile de logare"),
        ("integrame_rezolvate", "Integrame rezolvate"),
        ("level", "Nivel atins"),
        # Poți adăuga alte tipuri aici
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to="badges/", blank=True, null=True)
    users = models.ManyToManyField('User', related_name="badges", blank=True)
    condition_type = models.CharField(max_length=32, choices=CONDITION_TYPE_CHOICES, blank=True, null=True, help_text="Tipul condiției pentru acordarea badge-ului")
    condition_value = models.IntegerField(blank=True, null=True, help_text="Valoarea minimă pentru acordarea badge-ului")

    def __str__(self):
        return self.name


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("hint", "Indiciu"),
        ("theme", "Temă"),
        ("skin", "Skin"),
        ("grid", "Model de grilă"),
    ]

    type = models.CharField(max_length=16, choices=PRODUCT_TYPE_CHOICES)
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="shop/", blank=True, null=True)

    def __str__(self):
        return f"{self.get_type_display()}: {self.name} ({self.price} monede)"
