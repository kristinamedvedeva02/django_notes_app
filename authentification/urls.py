from django.urls import path
from .views import RegisterView, HomeView
from django.contrib.auth.views import LoginView, LogoutView


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
        LoginView.as_view(
            template_name="auth/login.html"
        ),
        name="login",
    ),

    path(
        "auth/logout/",
        LogoutView.as_view(),
        name="logout",
    )
]