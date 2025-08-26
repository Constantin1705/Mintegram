from django.urls import path
from .views import SubscriptionListView, CreateStripeSessionView

urlpatterns = [
    path('subscriptions/', SubscriptionListView.as_view(), name='subscription-list'),
    path('subscriptions/create-stripe-session/', CreateStripeSessionView.as_view(), name='create-stripe-session'),
]