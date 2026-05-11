from django.urls import path
from .views import AccountView, RegisterView
from .views import UsersListView


urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("account/", AccountView.as_view()),
    path("users/", UsersListView.as_view()),
]