from django.db import IntegrityError
import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

class TestMessageModel: 

    def test_str_return(self, message_factory):
        message = message_factory(body = "Testing body")
        assert str(message) == "Testing body"

    def test_message_user_delete_cascade(self, message_factory, user_factory):
        user = user_factory()
        message = message_factory(user=user)
        message_id = message.id

        user.delete()

        with pytest.raises(Message.DoesNotExist):
            Message.objects.get(id=message_id)
        
    def test_message_project_delete_cascade(self, message_factory, project_factory):
        project = project_factory()
        message = message_factory(project= project)
        message_id = message.id

        project.delete()

        with pytest.raises(Message.DoesNotExist):
            Message.objects.get(id=message_id)
    
    def test_message_requires_user(self, message_factory):
        with pytest.raises(IntegrityError):
            message_factory(user=None)
    
    def test_message_requires_project(self, message_factory):
        with pytest.raises(IntegrityError):
            message_factory(project=None)

    
    def test_message_body_not_null(self, message_factory):
        with pytest.raises(IntegrityError):
            message_factory(body = None)