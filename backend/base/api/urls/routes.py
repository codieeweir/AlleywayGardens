from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import URLPattern, URLResolver
from django.http import JsonResponse
from django.urls import get_resolver
import json

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh',
        'api/users/',
        'api/users/{id}/',
        'api/register',
        'api/zones/',
        'api/zones/{id}/',
        'api/posts/',
        'api/posts/{id}/',
        'api/messages/',
        'api/messages/{id}/',
        'api/comments/',
        'api/comments/{id}/',
    ]
    return Response(routes)
