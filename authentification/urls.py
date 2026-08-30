from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import HomeView, RegisterView, UserInfoView

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),
    path(
        "home/",
        HomeView.as_view(),
        name="home"
    ),
    path(
        "",
        HomeView.as_view(),
        name="base"
    ),
    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),
    path(
        "auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
    path(
        "auth/logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    path("me/", UserInfoView.as_view(), name="user_info"),
]