from pytest_factoryboy import register 
from .factories import ProjectFactory, ZoneFactory, MessageFactory

register(ProjectFactory)
register(ZoneFactory)
register(MessageFactory)