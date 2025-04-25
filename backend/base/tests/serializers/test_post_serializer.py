import factory
import pytest
from base.models import Post, User, Project
from ..factories import PostFactory, UserFactory
from ...api.serializers import PostSerializer

pytestmark = pytest.mark.django_db

class TestPostSerializer:

    def test_post_serializer_serializing_data(self, post_factory):
        post = post_factory()

        serializer = PostSerializer(post)
        data = serializer.data

        assert data['id'] == post.id
        assert data['title'] == post.title
        assert data['body'] == post.body
        assert data['user'] == post.user.id
        assert 'created' in data
        assert 'updated' in data
        assert 'comments' in data

    def test_post_serializer_returns_data(self, post_factory):
        user = post_factory().user

        data = {
            "user": user.id,
            "title": "New Post",
            "body": "Test post description",
        }

        serializer = PostSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        post = serializer.save()

        assert Post.objects.filter(id=post.id).exists()
        assert post.title == "New Post"
        assert post.body == "Test post description"
        assert post.user == user

    def test_missing_user_error(self, user_factory):
        data = {
            "user": None,
            "title": "New Post",
            "body": "Test post description",
        }

        serializer = PostSerializer(data=data)
        assert not serializer.is_valid()
        assert "user" in serializer.errors




