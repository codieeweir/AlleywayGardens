from django.db import IntegrityError
import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point, Polygon
from ..factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message
from django.db.utils import DataError

pytestmark = pytest.mark.django_db



class TestProjectModel: 


    def test_str_return(self, project_factory):
        project = project_factory(name="testingProjectName")
        assert str(project) == "testingProjectName"

    def test_default_location(self, project_factory):
        project = project_factory()
        assert isinstance(project.location, Point)
        assert project.location.coords == (-5.93012, 54.5973)
        assert project.location.srid == 4326

    def test_max_length_name(self, project_factory):
        project = project_factory(name = "A" * 200)
        assert len(project.name) == 200

    def test_name_too_long_for_max_length(self, project_factory):
        with pytest.raises(Exception):
            project_factory(name = "A" * 201)

    def test_project_type_doesnt_allow_null(self, project_factory):
        with pytest.raises(IntegrityError):
            project_factory(project_type=None)

    def test_host_set_null_on_delete(self, project_factory, user_factory):
        user = user_factory()
        project = project_factory(host=user)   
        user.delete()
        project.refresh_from_db()
        assert project.host is None 

    def test_participants_many_to_many_relationship(self, project_factory, user_factory):
        project = project_factory()
        user = user_factory()
        project.participants.add(user)
        assert user in project.participants.all()

    def test_shape_required(self, project_factory):
        polygon = Polygon(((0, 0), (1, 1), (1, 0), (0, 0)))
        project = project_factory(shape=polygon)
        assert isinstance(project.shape, Polygon)

    def test_shape_missing_raises_error(self, project_factory):
        with pytest.raises(IntegrityError):
            project_factory(shape=None)

    def test_updated_changes_on_save(self, project_factory):
        project = project_factory()
        old_updated = project.updated
        project.description = "updated desc"
        project.save()
        project.refresh_from_db()
        assert project.updated > old_updated

