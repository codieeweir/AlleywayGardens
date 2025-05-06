# Django REST Framework
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Local App Imports
from base.models import User, Zone, Post, Message, Comment, ProjectPost
from ..serializers import (
    UserSerializer,
    ZoneSerializer,
    PostSerializer,
    MessageSerializer,
    CommentSerializer,
    ProjectPostSerializer
)

#  Viewset logic was gained from 'https://www.django-rest-framework.org/api-guide/viewsets/' and applied to the desired fucntionality
#  for this project

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProjectPostViewSet(viewsets.ModelViewSet):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
