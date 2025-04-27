from pytest_factoryboy import register 
import pytest
from rest_framework.test import APIClient
from .factories import ProjectFactory, ImageFactory, ProjectPostFactory, ZoneFactory, MessageFactory, PostFactory, CommentFactory, UserFactory

register(ProjectFactory)
register(ZoneFactory)
register(MessageFactory)
register(PostFactory)
register(CommentFactory)
register(UserFactory)
register(ProjectPostFactory)
register(ImageFactory)

@pytest.fixture
def api_client():
    return APIClient()