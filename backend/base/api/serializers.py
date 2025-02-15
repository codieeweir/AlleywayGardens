from rest_framework.serializers import ModelSerializer
from base.models import Project, User, Zone, Post, Message, Comment

class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ZoneSerializer(ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'

class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
