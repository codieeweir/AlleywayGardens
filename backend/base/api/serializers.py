from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from base.models import Project, User, Zone, Post, Message, Comment, Image, ProjectPost
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType

class UserSerializer(ModelSerializer):
    # project = ProjectSerializer(many=True, read_only=True, source="project_set") 
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["is_active"] = False  
        user = User.objects.create_user(**validated_data)
        return user
    

class MessageSerializer(ModelSerializer):
    users = UserSerializer(many=False, read_only=True, source="user") 
    class Meta:
        model = Message
        fields = ["id", "body", "updated", "created", "users", "user", "project"]

class ProjectPostSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=False, read_only=True, source="user") 
    class Meta:
        model = ProjectPost
        fields = ["id", "body", "updated", "created", "user", "users", "project"]

class ProjectSerializer(ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )  
    message = MessageSerializer(many=True, read_only=True, source="message_set") 
    post = ProjectPostSerializer(many=True, read_only=True, source="projectpost_set") 
    user = UserSerializer(many=False, read_only=True, source="host") 
    class Meta:
        model = Project
        fields =[
            "id",
            "name",
            "description",
            "location",
            "project_type",
            "participants",
            "shape",
            "created",
            "updated",
            "message",
            "post",
            "host",
            "user"

        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["participants"] = [{"id": user.id, "username": user.username} for user in instance.participants.all()]
        return data
    
    def get_participants(self, obj):
        return [{"id": user.id, "username": user.username} for user in obj.participants.all()]





class ZoneSerializer(ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


class CommentSerializer(ModelSerializer):
    users = UserSerializer(many=False, read_only=True, source="user") 
    class Meta:
        model = Comment
        fields = ["id", "body", "updated", "created", "users", "user", "post"]

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source="comment")

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'project', 'zone', 'body', 'updated', 'created', 'comments' ]


class ImageUploadSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(),
        slug_field='model'
    )

    class Meta:
        model = Image
        fields = ['image', 'content_type', 'object_id', "id", "user"]
        read_only_fields = ['id', 'user', 'uploaded_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)