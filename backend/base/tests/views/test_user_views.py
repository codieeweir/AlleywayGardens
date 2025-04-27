import pytest
from django.urls import reverse
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


pytestmark = pytest.mark.django_db

class TestRegisterUserViews:

    def test_user_registration_send_email(self, api_client):
        url = reverse('register')
        user_data = {
            'email': 'testinguser@test.com',
            'username': 'testing',
            'password': 'testing123'
        }

        response = api_client.post(url, user_data, format='json')

        assert response.status_code == 201
        assert 'message' in response.data

        assert len(mail.outbox) == 1
        assert mail.outbox[0].subject == 'Activate your Account'

    def test_duplicate_email_registration(self, api_client, user_factory):
        user_factory(email = 'emaildup@test.com')
        url = reverse('register')
        user_data = {
            'email': 'emaildup@test.com',
            'username': 'testing',
            'password': 'testing123'
        }

        response = api_client.post(url, user_data, format='json')

        assert response.status_code == 400
        assert 'error' in response.data
        assert response.data['error'] == 'Email is already in use'

    def test_duplicate_username_registration(self, api_client, user_factory):
        user_factory(username = 'testing')
        url = reverse('register')
        user_data = {
            'email': 'emaildup@test.com',
            'username': 'testing',
            'password': 'testing123'
        }

        response = api_client.post(url, user_data, format='json')

        assert response.status_code == 400
        assert 'error' in response.data
        assert response.data['error'] == 'Username is already in use'

    def test_user_activation_success(self, api_client, user_factory):
        user = user_factory(is_active = False)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        url = reverse('activate', kwargs={'uidb64' : uid , 'token' : token})

        response = api_client.get(url)

        user.refresh_from_db()

        assert user.is_active is True
        assert response.status_code == 302
        assert 'activated=true' in response.url

    def test_user_activation_invalid_token(self, api_client, user_factory):
        user = user_factory(is_active = False)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = 'InvalidToken'

        url = reverse('activate', kwargs={'uidb64' : uid , 'token' : token})

        response = api_client.get(url)

        user.refresh_from_db()

        assert user.is_active is False
        assert response.status_code == 302
        assert 'error=invalid-activation' in response.url

class TestPasswordResetViews:

    def test_password_reset_request_success(self, api_client, user_factory):
        user = user_factory()
        url = reverse('password_reset')

        response = api_client.post(url, {'email' : user.email})

        assert response.status_code == 200
        assert response.data["message"] == "If this email exists, a link while arrive shortly"

    def test_password_reset_request_no_email_found(self, api_client):
        url = reverse('password_reset')
        response = api_client.post(url, {'email' : 'tester@gmail.com'})

        assert response.status_code == 200
        assert response.data["message"] == "If this email exists, a link while arrive shortly"

    def test_password_reset_no_email_entered(self, api_client):
        url = reverse('password_reset')
        response = api_client.post(url, {})

        assert response.status_code == 400
        assert response.data["error"] == "Email required"

    def test_password_reset_confirm_success(self, api_client, user_factory):
        user = user_factory()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        url = reverse('password_reset_confirm', kwargs={'uidb64' : uid , 'token' : token})
        response = api_client.post(url, {'password': 'newpassword123'})

        assert response.status_code == 200
        assert response.data['message'] == 'Password has been changed'
        user.refresh_from_db()
        assert user.check_password('newpassword123')

    def test_password_reset_confirm_invalid_link(self, api_client, user_factory):
        user = user_factory()

        uid = 'invalidID'
        token = default_token_generator.make_token(user)

        url = reverse('password_reset_confirm', kwargs={'uidb64' : uid , 'token' : token})

        response = api_client.post(url, {'password': 'invalidlinkcheck'})

        assert response.status_code == 400
        assert response.data['error'] == 'Invalid Reset Link'

    def test_password_reset_confirm_invalid_token(self, api_client, user_factory):
        user = user_factory()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = 'invalidToken'

        url = reverse('password_reset_confirm', kwargs={'uidb64' : uid , 'token' : token})

        response = api_client.post(url, {'password': 'invalidtokencheck'})

        assert response.status_code == 400
        assert response.data['error'] == 'Invalid or Expired token'

    def test_password_reset_confirm_empty_password(self, api_client, user_factory):
        user = user_factory()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        url = reverse('password_reset_confirm', kwargs={'uidb64' : uid , 'token' : token})

        response = api_client.post(url, {})

        assert response.status_code == 400
        assert response.data['error'] == 'Password is required'

    

