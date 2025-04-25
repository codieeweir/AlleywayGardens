import factory
import pytest
from base.models import Post, User, Project, Message
from ..factories import MessageFactory, UserFactory
from ...api.serializers import MessageSerializer

pytestmark = pytest.mark.django_db

class TestMessageSerializer:

    def test_message_serializer_serializing_data(self, message_factory):
        message = message_factory()

        serializer = MessageSerializer(message)
        data = serializer.data

        assert data["id"] == message.id
        assert data["body"] == message.body
        assert data["user"] == message.user.id
        assert data["users"]["id"] == message.user.id
        assert data["project"] == message.project.id

    def test_message_serializer_returns_data(self, message_factory):
        user = message_factory().user
        project = message_factory().project

        data = {
            "user": user.id,
            "body": "Test message",
            "project": project.id
        }

        serializer = MessageSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        message = serializer.save()

        assert Message.objects.filter(id=message.id).exists()
        assert message.body == "Test message"
        assert message.user == user
        assert message.project == project

    def test_missing_user_error(self, message_factory):
        project = message_factory().project

        data = {
            "user": None,
            "body": "Test post description",
            "project": project.id

        }

        serializer = MessageSerializer(data=data)
        assert not serializer.is_valid()
        assert "user" in serializer.errors

    def test_missing_project_error(self, message_factory):
        user = message_factory().user

        data = {
            "user": user.id,
            "body": "Test post description",
            "project": None

        }

        serializer = MessageSerializer(data=data)
        assert not serializer.is_valid()
        assert "project" in serializer.errors