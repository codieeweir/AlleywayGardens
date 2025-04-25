import factory
import pytest
from base.models import Image
from ..factories import ImageFactory, PostFactory, ProjectFactory
from ...api.serializers import ImageUploadSerializer
from django.core.files.uploadedfile import SimpleUploadedFile

pytestmark = pytest.mark.django_db

class TestImageSerializer:

    def test_image_upload_serializer(self, image_factory, project_factory, user_factory):
        
        project = project_factory()
        user = user_factory()

        image = image_factory(content_object=project)

        data = {
            'image' : image.image,
            'content_type': image.content_type.model,
            'object_id': image.object_id,
        }

        # I have used code from 'django-rest-framework.org/api-guide/testing/' here solve this problem 
        serializer = ImageUploadSerializer(data=data, context={'request': type('Request', (), {'user': user})()})

        assert serializer.is_valid()
        
        saved_image = serializer.save()
        

        assert saved_image.image.name.endswith('.jpg')
        assert saved_image.content_object == project
        assert saved_image.object_id == project.id

    def test_image_invalid_format(self, image_factory, project_factory, user_factory):
        user = user_factory()
        project = project_factory()

        image = image_factory(content_object=project)
        invalid_file = SimpleUploadedFile("test_image.txt", b"invalid_image", content_type="text/plain")

        data = {
            'image' : invalid_file,
            'content_type': image.content_type.model,
            'object_id': image.object_id,
        }

        serializer = ImageUploadSerializer(data=data, context={'request': type('Request', (), {'user': user})()})

        
        assert not serializer.is_valid()
        assert 'image' in serializer.errors


    def test_image_missing_fields(self, user_factory):
        user = user_factory()
        serializer = ImageUploadSerializer(data={}, context={'request': type('Request', (), {'user': user})()})

        assert not serializer.is_valid()
        assert 'image' in serializer.errors
        assert 'content_type' in serializer.errors
        assert 'object_id' in serializer.errors


    def test_image_with_invalid_model_type(self, image_factory, user_factory, project_factory):
        user = user_factory()
        project = project_factory()

        image = image_factory(content_object=project)

        data = {
            'image' : image.image,
            'content_type': 'invalidModel',
            'object_id': image.object_id,
        }

        serializer = ImageUploadSerializer(data=data, context={'request': type('Request', (), {'user': user})()})

        assert not serializer.is_valid()
        assert 'content_type' in serializer.errors











