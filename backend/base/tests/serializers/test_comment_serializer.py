import factory
import pytest
from base.models import Post, User, Post, Comment
from ..factories import CommentFactory, UserFactory
from ...api.serializers import CommentSerializer

pytestmark = pytest.mark.django_db

class TestCommentSerializer:

    def test_comment_serializer_serializing_data(self, comment_factory):
        comment = comment_factory()

        serializer = CommentSerializer(comment)
        data = serializer.data

        assert data["id"] == comment.id
        assert data["body"] == comment.body
        assert data["user"] == comment.user.id
        assert data["users"]["id"] == comment.user.id
        assert data["post"] == comment.post.id

    def test_comment_serializer_returns_data(self, comment_factory):
        user = comment_factory().user
        post = comment_factory().post

        data = {
            "user": user.id,
            "body": "Test comment",
            "post": post.id
        }

        serializer = CommentSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        comment = serializer.save()

        assert Comment.objects.filter(id=comment.id).exists()
        assert comment.body == "Test comment"
        assert comment.user == user
        assert comment.post == post

    def test_missing_user_error(self, comment_factory):
        post = comment_factory().post

        data = {
            "user": None,
            "body": "Test post description",
            "post": post.id

        }

        serializer = CommentSerializer(data=data)
        assert not serializer.is_valid()
        assert "user" in serializer.errors

    def test_missing_post_error(self, comment_factory):
        user = comment_factory().user

        data = {
            "user": user.id,
            "body": "Test post description",
            "post": None

        }

        serializer = CommentSerializer(data=data)
        assert not serializer.is_valid()
        assert "post" in serializer.errors