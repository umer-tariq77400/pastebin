from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from snippets.models import Snippet

class SnippetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        self.snippet = Snippet.objects.create(owner=self.user, title='Test Snippet', code='print("hello")', language='python')

    def test_create_snippet(self):
        url = reverse('snippet-list')
        data = {'title': 'New Snippet', 'code': 'print("new")', 'language': 'python'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Snippet.objects.count(), 2)
        self.assertIsNotNone(Snippet.objects.last().shared_password) # Check password generated

    def test_retrieve_snippet(self):
        url = reverse('snippet-detail', args=[self.snippet.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Snippet')

    def test_update_snippet(self):
        url = reverse('snippet-detail', args=[self.snippet.id])
        data = {'title': 'Updated Snippet', 'code': 'print("updated")'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Snippet.objects.get(id=self.snippet.id).title, 'Updated Snippet')

    def test_delete_snippet(self):
        url = reverse('snippet-detail', args=[self.snippet.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Snippet.objects.count(), 0)

    def test_retrieve_shared_snippet(self):
        uuid = self.snippet.uuid
        # Ensure password is not None
        if not self.snippet.shared_password:
             self.snippet.shared_password = "testpassword"
             self.snippet.save()
        password = self.snippet.shared_password

        # Logout owner
        self.client.logout()

        # Login other user
        User.objects.create_user(username='other', password='password')
        self.client.login(username='other', password='password')

        url = f'/snippets/shared/{uuid}/'

        # Try without password
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Try with wrong password
        response = self.client.post(url, {'password': 'wrong'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Try with correct password
        response = self.client.post(url, {'password': password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Snippet')

    def test_other_user_cannot_see_snippet(self):
        # Create another user
        User.objects.create_user(username='other', password='password')
        self.client.logout()
        self.client.login(username='other', password='password')

        # List snippets
        url = reverse('snippet-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Pagination is enabled, so check 'count' or 'results'
        if 'results' in response.data:
             self.assertEqual(len(response.data['results']), 0)
             self.assertEqual(response.data['count'], 0)
        else:
             self.assertEqual(len(response.data), 0)

        # Retrieve snippet by ID
        url = reverse('snippet-detail', args=[self.snippet.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
