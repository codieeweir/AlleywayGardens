from django.db import IntegrityError
import pytest
from django.urls import reverse
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


pytestmark = pytest.mark.django_db

class TestProjectViews:

    def test_standard_project_creation(self, api_client, user_factory, project_factory):

        user = user_factory()

        data = {
        "name": "Test Project",
        "description": "Test description",
        "shape": 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))',  
        "location": '{"type": "Point", "coordinates": [0.5, 0.5]}',  
        "participants": [user.id],
        "host": user.id,
        "project_type": "Alleyway Garden"
        }

        url = reverse('project-create')

        response = api_client.post(url, data)


        assert response.status_code == 200
        assert response.data["name"] == "Test Project"

    def test__project_creation_missing_shape(self, api_client, user_factory, project_factory):
            user = user_factory()

            data = {
            "name": "Test Project",
            "description": "Test description",
            "shape": '',  
            "location": '{"type": "Point", "coordinates": [0.5, 0.5]}',  
            "participants": [user.id],
            "host": user.id,
            "project_type": "Alleyway Garden"
            }

            url = reverse('project-create')
            with pytest.raises(IntegrityError):
                api_client.post(url, data)

            

    def test_project_update_participants(self, api_client, project_factory, user_factory):
        project = project_factory()
        new_participant = user_factory()

        url = reverse('project-update', args=[project.id])

        update_data = {"participants" : [new_participant.id]}

        response = api_client.patch(url, update_data, format='json')

        assert response.status_code == 200
        assert any(participant["id"] ==  new_participant.id for participant in response.data["participants"])

    def test_project_update_name(self, api_client, project_factory):
        project = project_factory()
        

        url = reverse('project-update', args=[project.id])

        update_data = {"name" : 'New Project name' }

        response = api_client.patch(url, update_data, format='json')

        assert response.status_code == 200
        assert response.data["name"] == 'New Project name'

    def test_project_delete_view(self, api_client, project_factory):
        project = project_factory()

        url = reverse('project-delete', args=[project.id])
        response = api_client.delete(url)

        assert response.status_code == 200
        assert response.data["message"] == 'Project Deleted Successfully'

    def test_project_list_view(self, api_client, project_factory):
        project_factory.create_batch(2)

        url = reverse('project-list')
        repsonse = api_client.get(url)

        assert repsonse.status_code == 200
        assert len(repsonse.data) == 2

    def test_project_detail_view(self, api_client, project_factory):
        project = project_factory()

        url = reverse('project-detail', args=[project.id])

        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data['id'] == project.id
        assert "shape" in response.data
        assert "description" in response.data