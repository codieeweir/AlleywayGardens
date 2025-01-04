import factory
from django.contrib.auth.models import User
from base.models import Post, Project, Zone, Message


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = 'test'
    password = 'testing1234'
    email = 'test@gmail.com'
    is_superuser = True
    is_staff = True
    is_active = True

class ZoneFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Zone
    
    name = 'testx'

class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    host = factory.SubFactory(UserFactory)
    zone = factory.SubFactory(ZoneFactory)
    name = 'x'
    description = 'xxxx'
    participants = factory.RelatedFactoryList(UserFactory)

class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    user = factory.SubFactory(UserFactory)
    project = factory.SubFactory(ProjectFactory)
    body = 'testtest'

class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    user = factory.SubFactory(UserFactory)
