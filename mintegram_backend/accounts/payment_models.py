from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PaymentTransaction(models.Model):
    """Model pentru tracking tranzacțiilor de plată"""
    STATUS_CHOICES = [
        ('success', 'Reușit'),
        ('failed', 'Eșuat'),
        ('pending', 'În așteptare'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payment_transactions')
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='EUR')
    product_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.amount} {self.currency}"
