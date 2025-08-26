from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'price')
    list_filter = ('type',)
    search_fields = ('name',)
