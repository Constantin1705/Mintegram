from django.db import models

# Create your models here.

class Subscription(models.Model):
    TYPE_CHOICES = [
        ('hearts', 'Hearts'),
        ('diamonds', 'Diamonds'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.type})"
