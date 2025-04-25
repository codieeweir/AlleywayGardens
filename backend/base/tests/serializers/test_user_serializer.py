import factory
import pytest
from base.models import Post, User, Project
from ..factories import PostFactory, UserFactory
from ...api.serializers import UserSerializer

pytestmark = pytest.mark.django_db

class TestUserSerializer:

    def test_user_serializer_create_valid_data(self):
        user_data = {
            "first_name" : "Courtney",
            "last_name" : "Weir",
            "email" : "courtneyweir14@gmail.com",
            "username" : "court",
            "password" : "password123"
        }

        serializer = UserSerializer(data=user_data)

        assert serializer.is_valid(), serializer.errors

        user = serializer.save()

        assert user.first_name == "Courtney"
        assert user.last_name == "Weir"
        assert user.email == "courtneyweir14@gmail.com"
        assert user.username == "court"

        assert user.password != "password123"
        assert user.check_password("password123")

        assert user.is_active is False

    def test_missing_fields_on_create_user_error(self, user_factory):

        user_data = {
            "first_name" : "Courtney",
            "last_name" : "Weir",
            "email" : "courtneyweir14@gmail.com",
        }

        serializer = UserSerializer(data=user_data)

        assert not serializer.is_valid()
        assert "username" in serializer.errors
        assert "password" in serializer.errors


    def test_invalid_email_address_format(self, user_factory):
        user_data = {
            "first_name" : "Courtney",
            "last_name" : "Weir",
            "email" : "courtneyweir14-gmail.com",
            "username" : "court",
            "password" : "password123"

        }

        serializer = UserSerializer(data=user_data)

        assert not serializer.is_valid()
        assert "email" in serializer.errors

    

    
