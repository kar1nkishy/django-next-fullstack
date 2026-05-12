from django.urls import path
from .views import AccountView, RegisterView, UsersListView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("account/", AccountView.as_view(), name="account"),
    path("users/", UsersListView.as_view(), name="user-list"),
]
