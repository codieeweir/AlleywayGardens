from django.urls import path, include
from ..views import views
from rest_framework.routers import DefaultRouter
from ..views.views import  ZoneViewSet, UserViewSet, PostViewSet, MessageViewSet, CommentViewSet, ProjectListView,  ProjectCreateView, ProjectDetailView, MyTokenObtainPairView
from ..urls.routes import getRoutes
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
## ViewSet routing
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'zones', ZoneViewSet)
router.register(r'posts', PostViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('', getRoutes, name='api-routes'),

    path('users/', UserViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
    path('users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-detail'),

    path('zones/', ZoneViewSet.as_view({'get': 'list', 'post': 'create'}), name='zone-list'),
    path('zones/<int:pk>/', ZoneViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='zone-detail'),

    path('posts/', PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-list'),
    path('posts/<int:pk>/', PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='post-detail'),

    path('messages/', MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='message-list'),
    path('messages/<int:pk>/', MessageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='message-detail'),

    path('comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='comment-list'),
    path('comments/<int:pk>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='comment-detail'),


    path('projects/', ProjectListView.as_view(), name='project-list' ),
    path('projects/create/', ProjectCreateView.as_view(), name='project-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('token', MyTokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name = 'token_refresh'),
]

