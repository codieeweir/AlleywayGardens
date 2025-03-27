import json
from numpy import convolve
import openmeteo_requests
import requests_cache
import pandas as pd
import logging
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from retry_requests import retry
from rest_framework.decorators import api_view
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.core.cache import cache
from django.conf import settings
from datetime import datetime
from django.views import View
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework import generics, viewsets, status, permissions
from django.utils.encoding import force_bytes, force_str
from base.models import Project, User, Zone, Post, Message, Comment, Image, ProjectPost
from ..serializers import ProjectSerializer, UserSerializer, ZoneSerializer, PostSerializer, MessageSerializer, CommentSerializer, ImageUploadSerializer, ProjectPostSerializer
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.auth.tokens import default_token_generator as token_generator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.decorators import login_required

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['firstname'] = user.first_name
        token['surname'] = user.last_name
    # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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

class ProjectPostViewSet(viewsets.ModelViewSet):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

## Custom Views for React

## Custom User Views 

# class updateUserProfileView(generics.UpdateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserUpdateSerializer

#     def get_object(self):
#         return self.request.user

##Project Views 

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

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data)
    

class ProjectUpdateView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def update(self, request, *args, **kwargs):
        project = self.get_object()

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
    


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)


    if serializer.is_valid():
        user = serializer.save()

        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        current_site = get_current_site(request)
        mail_subject = 'Activate your Account'
        message = render_to_string('base/email_verification.html', {
                'user' : user,
                'domain': current_site.domain,
                'uid' : uid,
                'token': token
        })
        email = EmailMessage(mail_subject, message, to=[user.email])
        email.send()

        return Response({'message': 'An email has been sent for verification.'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])  
def activate_user(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Your account has been activated!'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid activation link'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")
    if not email:
        return Response({ "message" : "Email required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response ({ "message" : "If this email exists, a link while arrive shortly"}, status=status.HTTP_200_OK)
    
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)

    current_site = get_current_site(request).domain
    reset_url = f"http://localhost:3000/password-reset-confirm/{uid}/{token}"
    mail_subject = "Password Reset Request"
    message = f"Click the link below to reset your password:\n{reset_url}"

    email_message = EmailMessage(mail_subject, message, to=[user.email])
    email_message.send()

    return Response ({ "message" : "If this email exists, a link while arrive shortly"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def password_reset_confirm(request, uidb64, token):
    try:
        uid = force_bytes(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, TypeError, ValueError, OverflowError):
        return Response ({ "error" : "Invalid Rest Link"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not token_generator.check_token(user, token):
        return Response ({ "error" : "Invalid or Expired token"}, status=status.HTTP_400_BAD_REQUEST)
    
    new_password = request.data.get("password")
    if not new_password:
        return Response ({ "error" : "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()

    return Response ({ "message" : "Password has been changed"}, status=status.HTTP_200_OK)


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


# Setup API client with caching and retry logic
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

def get_project_weather(request, project_id):
    try:
        # Retrieve project and extract first coordinate from shape field
        project = Project.objects.get(id=project_id)
        shape_geojson = json.loads(GEOSGeometry(project.shape).geojson)
        coordinates = shape_geojson["coordinates"][0][0]  # Extract first coordinate (Polygon assumption)
        latitude, longitude = coordinates[1], coordinates[0]  # GeoJSON format: [longitude, latitude]

        # Open-Meteo API request parameters
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "temperature_2m_max", "daylight_duration", "sunshine_duration", 
                "uv_index_max", "precipitation_sum", "rain_sum", "precipitation_hours"
            ],
            "timezone": "auto",
            "forecast_days": 1
        }

        # Fetch weather data
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        # Extract daily weather data
        daily = response.Daily()
        daily_data = {
            "date": pd.date_range(
                start=pd.to_datetime(daily.Time(), unit="s", utc=True),
                end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
                freq=pd.Timedelta(seconds=daily.Interval()),
                inclusive="left"
            ),
            "temperature_2m_max": daily.Variables(0).ValuesAsNumpy(),
            "daylight_duration": daily.Variables(1).ValuesAsNumpy(),
            "sunshine_duration": daily.Variables(2).ValuesAsNumpy(),
            "uv_index_max": daily.Variables(3).ValuesAsNumpy(),
            "precipitation_sum": daily.Variables(4).ValuesAsNumpy(),
            "rain_sum": daily.Variables(5).ValuesAsNumpy(),
            "precipitation_hours": daily.Variables(6).ValuesAsNumpy()
        }

        # Convert DataFrame to JSON response
        daily_dataframe = pd.DataFrame(daily_data)
        return JsonResponse(daily_dataframe.to_dict(orient="records"), safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

## Foreign Key Type Endpoints

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