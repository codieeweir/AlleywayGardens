from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ...models import Image
from ..serializers import ImageUploadSerializer


## Image APIS

class ImageUploadView(generics.CreateAPIView):
    serializer_class = ImageUploadSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ImageDeleteView(generics.DestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageUploadSerializer
    permission_classes = [permissions.AllowAny]

class ImageEnlargeList(generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageUploadSerializer

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
            
        return Response(serialized_data)

@api_view(["GET"])
def get_project_images(request, project_id):
    images = Image.objects.filter(object_id=project_id, content_type__model='project')
    serializer = ImageUploadSerializer(images, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_post_images(request, post_id):
    images = Image.objects.filter(object_id=post_id, content_type__model='post')
    serializer = ImageUploadSerializer(images, many=True)
    return Response(serializer.data)

@api_view(["GET", "PUT"])
def user_images_view(request, user_id):
    if request.method == "GET":
        images = Image.objects.filter(object_id=user_id, content_type__model='user')
        serializer = ImageUploadSerializer(images, many=True)
        return Response(serializer.data)
    elif request.method == "PUT":
        image_instance = get_object_or_404(Image, object_id=user_id, content_type__model='user')

    serializer = ImageUploadSerializer(image_instance, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_projectpost_images(request, post_id):
    images = Image.objects.filter(object_id=post_id, content_type__model='projectpost')
    serializer = ImageUploadSerializer(images, many=True)
    return Response(serializer.data)
