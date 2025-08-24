from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # username rămâne câmpul principal (default la AbstractUser)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username or self.email

