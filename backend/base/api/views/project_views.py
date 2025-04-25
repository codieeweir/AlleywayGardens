import json
from django.contrib.gis.geos import GEOSGeometry
from rest_framework import generics, status
from rest_framework.response import Response

from base.models import Project
from ..serializers import ProjectSerializer


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

        location_data = data.get("location")
        if location_data:
            if isinstance(location_data, str):
                location_data = json.loads(location_data)

                data["location"] = GEOSGeometry(json.dumps(location_data))

        participants_data = data.pop("participants", [])
        if isinstance(participants_data, int):
            participants_data = [participants_data]
        

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        project.participants.set(participants_data)

        return Response(serializer.data)
    

class ProjectUpdateView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def update(self, request, *args, **kwargs):
        project = self.get_object()
        existing_participants = list(project.participants.values_list("id", flat=True))
        new_participants = request.data.get("participants", [])

        if not isinstance(new_participants, list):
            return Response({"error" : "participants must be a list"}, status=400)
        
        request.data["participants"] = list(set(existing_participants + new_participants))
        


        serializer = self.get_serializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProjectDeleteView(generics.DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def delete(self, request, *args, **kwargs):
        project = self.get_object()
        self.perform_destroy(project)

        return Response(
            {'message': 'Project Deleted Successfully'}, status=status.HTTP_200_OK
        )
    
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

        for project in serialized_data:
            if project["location"]:
                project["location"] = GEOSGeometry(project["location"]).geojson
            
        return Response(serialized_data)