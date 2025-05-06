from rest_framework.decorators import api_view
from rest_framework.response import Response


## Some Routes for the API so endpoints can be easily seen
@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh',
        'api/users/',
        'api/users/{id}/',
        'api/users/{id}/projects/',
        'api/users/{id}/messages/',
        'api/users/{id}/posts/',
        'api/users/{id}/comments/',
        'api/register/',
        'api/activate/{uidb64}/{token}/',
        'api/password-reset/',
        'api/password-reset-confirm/{uidb64}/{token}/',
        'api/zones/',
        'api/zones/{id}/',
        'api/posts/',
        'api/posts/{id}/',
        'api/projectposts/',
        'api/projectposts/{id}/',
        'api/messages/',
        'api/messages/{id}/',
        'api/comments/',
        'api/comments/{id}/',
        'api/upload-image/',
        'api/project-images/{project_id}/',
        'api/post-images/{post_id}/',
        'api/user-images/{user_id}/',
        'api/project_weather/{project_id}/',
        'api/projects/',
        'api/projects/create/',
        'api/projects/update/{id}/',
        'api/projects/delete/{id}/',
        'api/projects/{id}/',
    ]
    return Response(routes)
