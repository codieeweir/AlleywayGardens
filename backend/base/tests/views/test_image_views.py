import pytest
from django.urls import reverse
from rest_framework import status
from ..factories import MessageFactory, UserFactory, ProjectFactory, CommentFactory, PostFactory
from PIL import Image as PILImage
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile

pytestmark = pytest.mark.django_db

class TestImageViews:

    def test_image_upload_view(self, api_client, user_factory, image_factory, project_factory):
        user = user_factory()
        project = project_factory()
        api_client.force_authenticate(user=user)

        image = image_factory(content_object=project)

        data = {
            'image' : image.image,
            'content_type': image.content_type.model,
            'object_id': image.object_id,
        }

        url = reverse("upload-image")

        response = api_client.post(url, data, format='multipart')

        assert response.status_code == 201
        assert "id" in response.data
        assert response.data["object_id"] == project.id

    def test_image_delete_view(self, api_client, user_factory, image_factory):
        user = user_factory()
        api_client.force_authenticate(user=user)

        image = image_factory(user=user)

        url = reverse("delete-image", kwargs={"pk": image.id})

        response = api_client.delete(url)

        assert response.status_code == 204

    def test_image_enlarge_returns_correct_image(self, api_client, image_factory):
        image = image_factory()
        url = reverse("images", kwargs={"pk": image.id})

        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["id"] == image.id


class TestGetImagesViews:

    def test_get_project_images_returns_correct_image(self, api_client, image_factory, user_factory, project_factory):
        project = project_factory()
        image  = image_factory(content_object=project)

        url = reverse("project-images", kwargs={"project_id": project.id})
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data[0]['id'] == image.id

    def test_get_post_images_returns_correct_image(self, api_client, image_factory, post_factory):
        post = post_factory()
        image  = image_factory(content_object=post)

        url = reverse("post-images", kwargs={"post_id": post.id})
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data[0]['id'] == image.id

    def test_get_projectpost_images_returns_correct_image(self, api_client, image_factory, project_post_factory):
        post = project_post_factory()
        image  = image_factory(content_object=post)

        url = reverse("projectpost-images", kwargs={"post_id": post.id})
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data[0]['id'] == image.id

    def test_get_user_images_returns_correct_image(self, api_client, image_factory, user_factory):
        user = user_factory()
        image  = image_factory(content_object=user)

        url = reverse("user-images", kwargs={"user_id": user.id})
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data[0]['id'] == image.id

    def test_get_user_images_updates_image_file(self, api_client, image_factory, user_factory):
        user = user_factory()
        user_2 = user_factory()
        api_client.force_authenticate(user=user)

        image = image_factory(content_object=user)
        TesterImage = image_factory(content_object=user_2)

        data = {
            'image' : TesterImage.image,
            'content_type': image.content_type.model,
            'object_id': image.object_id,
        }

        url = reverse("user-images", kwargs={"user_id": user.id})

        response = api_client.put(url, data, format='multipart')

        assert response.status_code == 200
        assert "image" in response.data




