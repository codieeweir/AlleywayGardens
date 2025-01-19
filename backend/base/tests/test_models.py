import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from .factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

#Base Django testing to start... incl factories

# Project Testing
class TestProjectModel(TestCase): 
    def test_str_return(self):
        project = ProjectFactory(name="testingProjectName")
        self.assertEqual(str(project), "testingProjectName")

    def test_default_location(self):
        project = ProjectFactory()
        self.assertEqual(project.location.coords,(-5.93012, 54.5973))

    def test_max_legth_name(self):
        project = ProjectFactory(name = "A" * 200)
        self.assertEqual(len(project.name), 200)
        with self.assertRaises(DataError):
            ProjectFactory(name = "A" * 201)

    def test_foreign_key_delete_set_null(self):
        host = UserFactory()
        project = ProjectFactory(host = host)
        host.delete()
        project.refresh_from_db()
        self.assertIsNone(project.host)

    def test_many_to_many_relationship(self):
        project = ProjectFactory()
        user = UserFactory()
        project.participants.add(user)
        self.assertIn(user, project.participants.all())

    def test_value_of_srid_for_location(self):
        project = ProjectFactory()
        self.assertEqual(project.location.srid, 4326)


# Zone Testing
class TestZoneModel(TestCase):
    def test_str_return(self):
        zone = ZoneFactory(name="testingZone")
        self.assertEqual(str(zone), "testingZone")

    def test_max_legth_name(self):
        zone = ZoneFactory(name = "A" * 200)
        self.assertEqual(len(zone.name), 200)
        with self.assertRaises(DataError):
            ZoneFactory(name = "A" * 201)

# Message Testing
class TestMessageModel(TestCase): 
    def test_str_return(self):
        message = MessageFactory(body="testingMessage")
        self.assertEqual(str(message), "testingMessage")

    def test_on_delete_cascade(self):
        user = UserFactory()
        project = ProjectFactory(host=user)
        
        message1 = MessageFactory(user=user, project=project)
        message2 = MessageFactory(user=user, project=project)

        self.assertIn(message1, Message.objects.all())
        self.assertIn(message2, Message.objects.all())

        user.delete()

        self.assertNotIn(message1, Message.objects.all())
        self.assertNotIn(message2, Message.objects.all())

# Trying out some pytest 


# Post Tetsing
class TestPostModel: 
    def test_str_return(self, post_factory):
        post = post_factory(body="testingPostBody")
        assert post.__str__() == "testingPostBody"


# Comment Testing
class TestCommentModel: 
    def test_str_return(self, comment_factory):
        comment = comment_factory(body="testingCommentBody")
        assert comment.__str__() == "testingCommentBody"