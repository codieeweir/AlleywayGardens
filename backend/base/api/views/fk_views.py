## Foreign Key Type Endpoints
from ..serializers import (
    ProjectSerializer,
    PostSerializer,
    MessageSerializer,
    CommentSerializer,
)
from base.models import Project, Post, Message, Comment

from rest_framework import generics


class UserProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Project.objects.filter(host_id=user_id)
    
class UserMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Message.objects.filter(user_id=user_id)
    
class UserCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Comment.objects.filter(user_id=user_id)
    
class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Post.objects.filter(user_id=user_id)