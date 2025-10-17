"""
URL configuration for mintegram project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts.views import RegisterView, LoginView, MeView, UpdateProgressView
from accounts.views_badge_list import BadgeListView
from rest_framework.routers import DefaultRouter
from crosswords.views import PuzzleViewSet, ScoreViewSet, ChallengeViewSet, ChallengeUserViewSet, CategoryViewSet
from crosswords.views import PuzzleStatViewSet, ThemeSettingView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="signup"),
    path("api/auth/login/",    LoginView.as_view()),
    path("api/auth/me/",       MeView.as_view()),
    path("api/auth/token/refresh/", TokenRefreshView.as_view()),
    path("auth/update-progress/", UpdateProgressView.as_view(), name="update-progress"),
    path('api/', include('subscriptions.urls')),
    path('api/badges/', BadgeListView.as_view(), name='badge-list'),
    path('api/', include('accounts.urls')),
]

router = DefaultRouter()
router.register(r"puzzles", PuzzleViewSet, basename="puzzle")
router.register(r"leaderboard", ScoreViewSet, basename="leaderboard")
router.register(r"challenges", ChallengeViewSet, basename="challenges")
router.register(r"challenge-user", ChallengeUserViewSet, basename="challenge-user")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r'puzzlestats', PuzzleStatViewSet, basename="puzzlestats")
urlpatterns += [ path("api/", include(router.urls)), path("api/theme-setting/", ThemeSettingView.as_view()), ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)