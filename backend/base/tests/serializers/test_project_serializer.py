import factory
import pytest
from django.contrib.gis.geos import Point, Polygon
from base.models import Post, User, Post, ProjectPost, Project
from ..factories import ProjectPostFactory, UserFactory, ProjectFactory
from ...api.serializers import ProjectPostSerializer, ProjectSerializer
from django.contrib.gis.geos import GEOSGeometry

pytestmark = pytest.mark.django_db

class TestProjectSerializer:

    def test_project_serializer_basic_fields(self, project_factory):
        project = project_factory()

        serializer = ProjectSerializer(project)
        data = serializer.data

        assert data['id'] == project.id
        assert data['name'] == project.name
        assert data['description'] == project.description
        assert data['host'] == project.host.id
        assert data['project_type'] == project.project_type
        assert data['location'] is not None
        assert data['shape'] is not None
        assert 'created' in data
        assert 'updated' in data

    def test_project_user_serialization(self, project_factory):
        project = project_factory()
        serializer = ProjectSerializer(project)
        data = serializer.data

        assert 'user' in data
        assert isinstance(data['user'], dict)
        assert data['user']['id'] == project.host.id

    def test_project_participants_serializer(self, project_factory, user_factory):
        project = project_factory()
        user_1 = user_factory()
        user_2 = user_factory()
        project.participants.set([user_1, user_2])

        serializer = ProjectSerializer(project)
        data = serializer.data
        
        assert 'participants' in data
        assert isinstance(data['participants'], list)
        assert len(data['participants'])==2
        assert all('id' in u and 'username' in u for u in data['participants'])

    def test_project_messages_serializer(self, project_factory, message_factory):
        project = project_factory()
        message_factory(project=project)
        message_factory(project=project)

        serializer = ProjectSerializer(project)
        data = serializer.data

        assert 'message' in data
        assert isinstance(data['message'], list)
        assert len(data['message']) == 2

    def test_project_posts_serializer(self, project_factory, project_post_factory):
        project = project_factory()
        project_post_factory(project=project)
        project_post_factory(project=project)
        project_post_factory(project=project)

        serializer = ProjectSerializer(project)
        data = serializer.data

        assert 'post' in data
        assert isinstance(data['post'], list)
        assert len(data['post']) == 3

    def test_project_location_format(self, project_factory):
        project = project_factory(location = Point(-5.1234, 54.1234, srid = 4326))
        serializer = ProjectSerializer(project)

        data = serializer.data

        assert 'location' in data
        assert isinstance(data['location'], str)

    def test_project_shape_format(self, project_factory):
        project = project_factory(shape = Polygon(((0, 0), (1, 1), (1, 0), (0, 0))))
        serializer = ProjectSerializer(project)

        data = serializer.data

        assert 'shape' in data
        assert data['shape'] == GEOSGeometry(str(project.shape))


        
    