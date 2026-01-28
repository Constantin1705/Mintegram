# Adaugă la mintegram/urls.py

from django.urls import path, include
from accounts.payment_views import CreatePaymentIntentView, WebhookView, PaymentTransactionView

urlpatterns = [
    # ... rute existente ...
    
    # Rute de plată
    path('payments/create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payments/webhook/', WebhookView.as_view(), name='stripe-webhook'),
    path('payments/transactions/', PaymentTransactionView.as_view(), name='payment-transactions'),
]
