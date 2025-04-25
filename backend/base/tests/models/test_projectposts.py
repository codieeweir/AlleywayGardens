from django.db import IntegrityError
import pytest
from django.core.exceptions import ValidationError
from ..factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory, ProjectPostFactory
from base.models import  ProjectPost

pytestmark = pytest.mark.django_db

class TestProjectPostsModel: 

    def test_project_post_body(self, project_post_factory):
        post = project_post_factory(body="Sample text for body")
        assert str(post) == "Sample text for body"

    def test_project_post_doesnt_allow_null_project(self, project_post_factory):
        with pytest.raises(IntegrityError):
            project_post_factory(project=None)
 
    def test_project_post_user_delete_cascade(self, project_post_factory, user_factory):
        user = user_factory()
        post = project_post_factory(user=user)
        post_id = post.id

        user.delete()

        with pytest.raises(ProjectPost.DoesNotExist):
            ProjectPost.objects.get(id=post_id)
    
    def test_project_post_delete_on_project_deleteion(self, project_post_factory, project_factory):

        project = project_factory()
        post = project_post_factory(project=project)
        post_id = post.id

        project.delete()

        with pytest.raises(ProjectPost.DoesNotExist):
            ProjectPost.objects.get(id=post_id)

    def test_empty_post_body_raises_error(self, project_post_factory):
        post = project_post_factory(body = '')
        try:
            post.full_clean()
        except ValidationError as e:
            assert 'body' in e.message_dict

    



  