from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, viewsets
from base.models import Project, User, Zone, Post, Message, Comment
from ..serializers import ProjectSerializer, UserSerializer, ZoneSerializer, PostSerializer, MessageSerializer, CommentSerializer
from django.contrib.gis.geos import GEOSGeometry
## GET VIEWS With Django ViewSets

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

## Custom Views for React


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        if data.get("shape"):
            data["shape"] = GEOSGeometry(data["shape"]).geojson

        return Response(data)


class ProjectCreateView(generics.CreateAPIView):
    serializer_class = ProjectSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        shape_data = data.get("shape")
        if shape_data:
            data["shape"] = GEOSGeometry(str(shape_data))

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data)
    
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        serialized_data = serializer.data

        for project in serialized_data:
            if project["shape"]:
                project["shape"] = GEOSGeometry(project["shape"]).geojson
            
        return Response(serialized_data)