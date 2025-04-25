from django.db import IntegrityError
import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ProjectFactory, ZoneFactory, UserFactory, CommentFactory, PostFactory
from base.models import Comment
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

class TestCommentModel: 

    def test_str_return(self, comment_factory):
        comment = comment_factory(body = "Testing body")
        assert str(comment) == "Testing body"

    def test_comment_user_delete_cascade(self, comment_factory, user_factory):
        user = user_factory()
        comment = comment_factory(user=user)
        comment_id = comment.id

        user.delete()

        with pytest.raises(Comment.DoesNotExist):
            Comment.objects.get(id=comment_id)
        
    def test_comment_post_delete_cascade(self, comment_factory, post_factory):
        post = post_factory()
        comment = comment_factory(post= post)
        comment_id = comment.id

        post.delete()

        with pytest.raises(Comment.DoesNotExist):
            Comment.objects.get(id=comment_id)
    
    def test_comment_requires_user(self, comment_factory):
        with pytest.raises(IntegrityError):
            comment_factory(user=None)
    
    def test_comment_requires_post(self, comment_factory):
        with pytest.raises(IntegrityError):
            comment_factory(post=None)

    
    def test_comment_body_not_null(self, comment_factory):
        with pytest.raises(IntegrityError):
            comment_factory(body = None)