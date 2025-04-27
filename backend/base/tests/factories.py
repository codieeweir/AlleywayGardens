import datetime
import factory
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point, Polygon
from base.models import Post, Project, Zone, Message, Comment, ProjectPost, Image
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.files.base import ContentFile
from PIL import Image as PILImage
from io import BytesIO


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save=True

    username = factory.Sequence(lambda n: f"user_{n}")
    first_name = 'Testing'
    last_name = 'Testing2'
    password = factory.PostGenerationMethodCall("set_password", "test")
    email = factory.Sequence(lambda n: f"user_{n}@example.com")
    is_superuser = True
    is_staff = False
    is_active = True

    @factory.post_generation
    def save_user(self, create, extracted, **kwargs):
        if create:
            self.save()


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
    project_type = "Alleyway Garden"
    shape = Polygon(((0, 0), (1, 1), (1, 0), (0, 0)))
    location = Point(-5.93012, 54.5973, srid=4326)



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

class ProjectPostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProjectPost
        skip_postgeneration_save=True

    user = factory.SubFactory(UserFactory)
    project = factory.SubFactory(ProjectFactory)
    body = 'xxx'

class ImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Image
    
    user = factory.SubFactory(UserFactory)

# I was able to find a method to create this fake image file here at 'github.com/FactoryBoy/factory_boy'
    @factory.lazy_attribute
    def image(self):
            image = PILImage.new('RGB', (100, 100), color='red')
            image_file = BytesIO()
            image.save(image_file, format='JPEG')  
            image_file.seek(0)  
            return ContentFile(image_file.read(), 'test.jpg')
    
    @factory.lazy_attribute
    def content_object(self):
        return PostFactory()
    
    @factory.lazy_attribute
    def content_type(self):
        return ContentType.objects.get_for_model(self.content_object)
    
    @factory.lazy_attribute
    def object_id(self):
        return self.content_object.id
    