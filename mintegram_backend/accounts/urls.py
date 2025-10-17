from django.urls import path
from .views import ShopListView, ShopBuyView

urlpatterns = [
    path('shop/', ShopListView.as_view(), name='shop-list'),
    path('shop/buy/', ShopBuyView.as_view(), name='shop-buy'),
]
