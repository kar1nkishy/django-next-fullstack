from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User


class UserAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            name="user1",
            email="user1@test.com",
            password="123456",
            role="user"
        )

        self.admin = User.objects.create_user(
            name="admin",
            email="admin@test.com",
            password="123456",
            role="admin"
        )

        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")
        self.account_url = reverse("account")
        self.users_url = reverse("user-list")

    def test_register_user(self):
        data = {
            "name": "newuser",
            "email": "new@test.com",
            "password": "123456"
        }

        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@test.com").exists())


    def test_login_user(self):
        data = {
            "email": "user1@test.com",
            "password": "123456"
        }

        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_account_requires_auth(self):
        response = self.client.get(self.account_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        login = self.client.post(self.login_url, {
            "email": "user1@test.com",
            "password": "123456"
        })

        token = login.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get(self.account_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "user1@test.com")

    def test_admin_can_view_users(self):
        login = self.client.post(self.login_url, {
            "email": "admin@test.com",
            "password": "123456"
        })

        token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(self.users_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 2)

    def test_user_cannot_view_users(self):
        login = self.client.post(self.login_url, {
            "email": "user1@test.com",
            "password": "123456"
        })

        token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(self.users_url)

        self.assertIn(response.status_code, [
            status.HTTP_403_FORBIDDEN,
            status.HTTP_401_UNAUTHORIZED
        ])