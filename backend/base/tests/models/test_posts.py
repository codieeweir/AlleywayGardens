import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ProjectFactory, ZoneFactory, UserFactory, CommentFactory, PostFactory
from base.models import Post
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

class TestPostModel:
    
    def test_str_return(self, post_factory):
        post = post_factory(body = "Test Post")
        assert str(post) == "Test Post"

    def test_title_max_length(self, post_factory):
        post = post_factory(title = "A" * 200)
        assert len(post.title) == 200
        with pytest.raises(Exception):
            post_factory(title = "A"* 201)


    def test_post_user_delete_cascade(self, post_factory, user_factory):
        user = user_factory()
        post = post_factory(user=user)
        post_id = post.id

        user.delete()

        with pytest.raises(Post.DoesNotExist):
            Post.objects.get(id=post_id)

    def test_updated_and_created_auto_fill(self, post_factory):
        post = post_factory()
        assert post.created is not None
        assert post.updated is not None