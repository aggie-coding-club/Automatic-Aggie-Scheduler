from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User

class UsersFullNameAPITests(APITestCase):
    """ Tests the functionality of the get_full_name API """
    def setUp(self):
        """ Delete sessions table before each test to ensure new session """
        Session.objects.all().delete()

    def test_get_full_name_returns_correct_value_bob(self):
        """ Tests that /sessions/get_full_name response is equal to the user's name """
        # Arrange
        username = 'user_bob'
        password = 'password_bob'
        user = User.objects.create(username=username, first_name='Bob',
                                   last_name='Bobbins')
        user.set_password(password)
        user.save()

        expected_name = 'Bob Bobbins'
        expected = {'fullName': expected_name}

        # Act
        self.client.login(username=username, password=password)
        response = self.client.get('/sessions/get_full_name')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_get_full_name_returns_correct_value_joe(self):
        """ Tests that /sessions/get_full_name response is equal to the user's name """
        # Arrange
        username = 'user_joe'
        password = 'password_joe'
        user = User.objects.create(username=username, first_name='Joe',
                                   last_name='Mama')
        user.set_password(password)
        user.save()

        expected_name = 'Joe Mama'
        expected = {'fullName': expected_name}

        # Act
        self.client.login(username=username, password=password)
        response = self.client.get('/sessions/get_full_name')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_get_full_name_returns_200_if_not_logged_in(self):
        """ Tests that /sessions/get_last_term response returns error code 400
            when user is not logged in
        """
        # Arrange
        # Nothing because there is no user to log in

        # Act
        response = self.client.get('/sessions/get_full_name')

        # Assert
        self.assertEqual(response.status_code, 200)
