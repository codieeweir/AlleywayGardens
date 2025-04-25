import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ImageFactory, ProjectFactory, PostFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message , Image
from django.db.utils import DataError
from django.contrib.contenttypes.models import ContentType

pytestmark = pytest.mark.django_db

class TestImageModel:

    def test_image_creation_with_post(self, post_factory):
        post = post_factory()
        image = ImageFactory(content_object=post)

        assert image.content_object == post
        assert image.object_id == post.id
        assert image.content_type == ContentType.objects.get_for_model(post)
        assert image.image.name.endswith(".jpg")

    def test_image_creation_with_project(self, project_factory, image_factory):
        project = project_factory()
        image = image_factory(content_object=project)

        assert image.content_object == project
        assert image.object_id == project.id
        assert image.content_type == ContentType.objects.get_for_model(project)
        assert image.image.name.endswith(".jpg")

    def test_reverse_query_on_image_for_post(self, post_factory, image_factory):
        post = post_factory()
        image = image_factory(content_object=post)

        related_images = Image.objects.filter(
            content_type=ContentType.objects.get_for_model(post),
            object_id=post.id
        )
        assert image in related_images