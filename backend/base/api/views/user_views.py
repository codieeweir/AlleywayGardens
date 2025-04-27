from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator 
from django.http import HttpResponseRedirect

from base.models import User
from ..serializers import UserSerializer

@api_view(['POST'])
def contact_form(request):

    email = request.data.get('email')
    name = request.data.get('name')
    message_content = request.data.get('message')


    current_site = get_current_site(request)
    mail_subject = 'New Contact Form Submission'
    message = render_to_string('base/contact_form.html', {
            'name' : name,
            'email': email,
            'message' : message_content,
            'domain': current_site.domain,

    })
    email = EmailMessage(mail_subject, message, to=['alleywaygardens@gmail.com'])
    email.content_subtype ='html'
    email.send()

    return Response({'message': 'Your Email has been sent and we hope to respond within 48 hours'}, status=status.HTTP_201_CREATED)



@api_view(['POST'])
def register_user(request):

    email = request.data.get('email')
    username = request.data.get('username')

    if User.objects.filter(email=email).exists():
        return Response ({'error': 'Email is already in use'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response ({'error': 'Username is already in use'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)


    if serializer.is_valid():
        user = serializer.save()

        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        current_site = get_current_site(request)
        mail_subject = 'Activate your Account'
        message = render_to_string('base/email_verification.html', {
                'user' : user,
                'domain': current_site.domain,
                'uid' : uid,
                'token': token
        })
        email = EmailMessage(mail_subject, message, to=[user.email])
        email.content_subtype ='html'
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


    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponseRedirect('http://localhost:3000/login?activated=true')
    else:
        return HttpResponseRedirect('http://localhost:3000/login?error=invalid-activation')

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")
    if not email:
        return Response({ "error" : "Email required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response ({ "message" : "If this email exists, a link while arrive shortly"}, status=status.HTTP_200_OK)
    
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

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
        return Response ({ "error" : "Invalid Reset Link"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not default_token_generator.check_token(user, token):
        return Response ({ "error" : "Invalid or Expired token"}, status=status.HTTP_400_BAD_REQUEST)
    
    new_password = request.data.get("password")
    if not new_password:
        return Response ({ "error" : "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()

    return Response ({ "message" : "Password has been changed"}, status=status.HTTP_200_OK)

