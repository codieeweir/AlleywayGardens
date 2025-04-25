from pytest_factoryboy import register 
from .factories import ProjectFactory, ImageFactory, ProjectPostFactory, ZoneFactory, MessageFactory, PostFactory, CommentFactory, UserFactory

register(ProjectFactory)
register(ZoneFactory)
register(MessageFactory)
register(PostFactory)
register(CommentFactory)
register(UserFactory)
register(ProjectPostFactory)
register(ImageFactory)