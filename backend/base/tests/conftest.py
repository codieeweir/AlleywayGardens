from pytest_factoryboy import register 
from .factories import ProjectFactory, ZoneFactory, MessageFactory, PostFactory, CommentFactory

register(ProjectFactory)
register(ZoneFactory)
register(MessageFactory)
register(PostFactory)
register(CommentFactory)