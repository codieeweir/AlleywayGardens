import factory
from django.contrib.auth.models import User
from base.models import Post, Project, Zone, Message, Comment


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save=True

    username = factory.Sequence(lambda n: f"user_{n}")
    password = factory.PostGenerationMethodCall("set_password", "test")
    email = factory.Sequence(lambda n: f"user_{n}@example.com")
    is_superuser = True
    is_staff = False
    is_active = True

class ZoneFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Zone
    
    name = 'testx'

class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project
        skip_postgeneration_save=True

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


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    user = factory.SubFactory(UserFactory)
    post = factory.SubFactory(PostFactory)
    body = 'testtest'
