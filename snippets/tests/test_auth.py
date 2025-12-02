from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class AuthTests(APITestCase):
    def test_register_success(self):
        url = reverse('register-list')
        data = {'username': 'newuser', 'password': 'password123', 'email': 'new@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_no_email(self):
        url = reverse('register-list')
        data = {'username': 'noemailuser', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='noemailuser').exists())

    def test_register_blank_email(self):
        url = reverse('register-list')
        data = {'username': 'blankemail', 'password': 'password123', 'email': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='blankemail').exists())

    def test_register_invalid_email(self):
        url = reverse('register-list')
        data = {'username': 'invalidemail', 'password': 'password123', 'email': 'not-an-email'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_login_success(self):
        User.objects.create_user(username='loginuser', password='password123')
        # Login is usually handled by SessionAuth or TokenAuth.
        # Since we use SessionAuth primarily in this app (cookie based),
        # but for API testing we can use client.login or the auth endpoint.
        # The app uses /api-auth/login/ for CSRF/Session.
        # But we also have /api-token-auth/ if we enabled it.
        # The user's code uses /api-auth/login/.

        # Testing via client.login is standard for session auth integration tests
        success = self.client.login(username='loginuser', password='password123')
        self.assertTrue(success)

    def test_login_endpoint(self):
        # If we want to test the actual endpoint used by frontend
        # /api-auth/login/ is DRF's built-in view.
        # We can test if we can access protected resource after login
        User.objects.create_user(username='loginuser', password='password123')
        self.client.login(username='loginuser', password='password123')

        url = '/current_user/' # Defined in snippets/urls.py
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'loginuser')
