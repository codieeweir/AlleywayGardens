from django.db import IntegrityError
import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ProjectFactory, UserFactory
from base.models import User
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

# class TestUserModel:

#     def test_user_duplicate_email(self, user_factory):
#         user_data_1 = {
#             "first_name" : "Courtney",
#             "last_name" : "Weir",
#             "email" : "courtneyweir14@gmail.com",
#             "username" : "court",
#             "password" : "password123"

#         }

#         user_1 = User.objects.create_user(**user_data_1)

#         user_data_2 = {
#             "first_name" : "Courtney",
#             "last_name" : "Doe",
#             "email" : "courtneyweir14@gmail.com",
#             "username" : "courtney",
#             "password" : "password1234"

#         }

#         with pytest.raises(IntegrityError):
#             User.objects.create_user(**user_data_2)


