from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, viewsets, status
from django.utils.encoding import force_bytes, force_str
from base.models import Project, User, Zone, Post, Message, Comment
from ..serializers import ProjectSerializer, UserSerializer, ZoneSerializer, PostSerializer, MessageSerializer, CommentSerializer
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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
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
    
# class RegisterView(generics.CreateAPIView):
#     serializer_class = UserSerializer
    
#     def create(self, request, *args, **kwargs):
#         data = request.data.copy()
#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create    
#         return Response(serialized_data)

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