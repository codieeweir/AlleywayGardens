from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from base.models import Project, User, Zone, Post, Message, Comment
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.auth.hashers import make_password

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["is_active"] = False  # Set user as inactive
        user = User.objects.create_user(**validated_data)
        return user


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ProjectSerializer(ModelSerializer):
    message = MessageSerializer(many=True, read_only=True, source="message_set") 
    class Meta:
        model = Project
        fields =[
            "id",
            "name",
            "description",
            "shape",
            "created",
            "updated",
            "message",
        ]


class ZoneSerializer(ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source="comment")

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'project', 'zone', 'body', 'updated', 'created', 'comments' ]

