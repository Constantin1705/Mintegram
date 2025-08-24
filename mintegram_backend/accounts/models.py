from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    diamonds = models.IntegerField(default=0)

    def __str__(self):
        return self.username or self.email


class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to="badges/", blank=True, null=True)
    users = models.ManyToManyField(User, related_name="badges", blank=True)

    def __str__(self):
        return self.name
