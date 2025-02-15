from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET /api',
        'GET /api/projects',
        'GET /api/projects/:id',
        'GET /api/users',
        'GET /api/user/:id',
        'GET /api/zones',
        'GET /api/posts',
        'GET /api/posts/:id',
        'GET /api/comments',
        'GET /api/messages',
        'GET /api/project/:id/location',
        'GET /api/project/:id/shape',

        'POST /api/projects',
        'POST /api/projects/:id',
        'POST /api/users',
        'POST /api/users/:id',
        'POST /api/posts',
        'POST /api/comments',
        'POST /api/messages',

        'PUT /api/project/:id',

        'DELETE /api/project/:id',
        'DELETE /api/users/:id',
        'DELETE /api/posts/:id',
        'DELETE /api/comments/:id',
        'DELETE /api/messages/:id',

    ]
    return Response(routes)

