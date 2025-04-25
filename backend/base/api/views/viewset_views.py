# Django REST Framework
from rest_framework import viewsets

# Local App Imports
from base.models import Project, User, Zone, Post, Message, Comment, Image, ProjectPost
from ..serializers import (
    ProjectSerializer,
    UserSerializer,
    ZoneSerializer,
    PostSerializer,
    MessageSerializer,
    CommentSerializer,
    ImageUploadSerializer,
    ProjectPostSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class ProjectPostViewSet(viewsets.ModelViewSet):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
