import factory
import pytest
from base.models import Post, User, Post, ProjectPost
from ..factories import ProjectPostFactory, UserFactory
from ...api.serializers import ProjectPostSerializer

pytestmark = pytest.mark.django_db

class TestProjectPostSerializer:

    def test_project_post_serializer_serializing_data(self, project_post_factory):
        post = project_post_factory()

        serializer = ProjectPostSerializer(post)
        data = serializer.data

        assert data["id"] == post.id
        assert data["body"] == post.body
        assert data["user"] == post.user.id
        assert data["users"]["id"] == post.user.id
        assert data["project"] == post.project.id

    def test_comment_serializer_returns_data(self, project_post_factory):
        user = project_post_factory().user
        project = project_post_factory().project

        data = {
            "user": user.id,
            "body": "Test comment",
            "project": project.id
        }

        serializer = ProjectPostSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        post = serializer.save()

        assert ProjectPost.objects.filter(id=post.id).exists()
        assert post.body == "Test comment"
        assert post.user == user
        assert post.project == project

    def test_missing_user_error(self, project_post_factory):
        project = project_post_factory().project

        data = {
            "user": None,
            "body": "Test post description",
            "project": project.id

        }

        serializer = ProjectPostSerializer(data=data)
        assert not serializer.is_valid()
        assert "user" in serializer.errors

    def test_missing_project_error(self, project_post_factory):
        user = project_post_factory().user

        data = {
            "user": user.id,
            "body": "Test post description",
            "project": None

        }

        serializer = ProjectPostSerializer(data=data)
        assert not serializer.is_valid()
        assert "project" in serializer.errors