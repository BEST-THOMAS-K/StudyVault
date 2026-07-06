from django.urls import path
from .views import register, login, logout, get_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("logout/", logout, name="logout"),
    path("user/", get_user, name="get_user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]