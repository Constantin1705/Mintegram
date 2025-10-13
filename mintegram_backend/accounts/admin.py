from django.contrib import admin
from .models import User, Badge

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ("username", "email", "xp", "level", "diamonds", "is_staff", "is_active")
	search_fields = ("username", "email")
	list_filter = ("is_staff", "is_active", "level")

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
	list_display = ("name", "description")
	search_fields = ("name",)
