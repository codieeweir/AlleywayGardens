import pytest

pytestmark = pytest.mark.django_db

# Zone Testing
class TestZoneModel: 
    def test_str_return(self, zone_factory):
        zone = zone_factory(name="testingZone")
        assert zone.__str__() == "testingZone"

# Project Testing
class TestProjectModel: 
    def test_str_return(self, project_factory):
        project = project_factory(name="testingProjectName")
        assert project.__str__() == "testingProjectName"


# Message Testing
class TestMessageModel: 
    def test_str_return(self, message_factory):
        message = message_factory(body="testingMessage")
        assert message.__str__() == "testingMessage"


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