from django.urls import path, include
from ..views import views
from rest_framework.routers import DefaultRouter
from ..views.views import  register_user, ImageUploadView, ImageDeleteView, ProjectPostViewSet, get_project_images, get_projectpost_images,ProjectDeleteView, get_post_images, user_images_view, get_project_weather, UserCommentsView, UserMessagesView, UserPostsView, UserProjectsView,activate_user, password_reset_request, password_reset_confirm, get_project_weather__monthly_averages,ZoneViewSet, UserViewSet, PostViewSet, MessageViewSet, CommentViewSet, ProjectListView,  ProjectCreateView, ProjectDetailView, ProjectUpdateView, MyTokenObtainPairView
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
router.register(r'projectposts', ProjectPostViewSet)



urlpatterns = [
    path('', getRoutes, name='api-routes'),

    path('users/', UserViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update'}), name='user-list'),
    path('users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy', 'patch': 'partial_update'}), name='user-detail'),
    path("users/<int:user_id>/projects/", UserProjectsView.as_view(), name="user-projects"),
    path("users/<int:user_id>/messages/", UserMessagesView.as_view(), name="user-messages"),
    path("users/<int:user_id>/posts/", UserPostsView.as_view(), name="user-posts"),
    path("users/<int:user_id>/comments/", UserCommentsView.as_view(), name="user-comments"),

    path('zones/', ZoneViewSet.as_view({'get': 'list', 'post': 'create'}), name='zone-list'),
    path('zones/<int:pk>/', ZoneViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='zone-detail'),

    path('posts/', PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-list'),
    path('posts/<int:pk>/', PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='post-detail'),

    
    path('projectposts/', ProjectPostViewSet.as_view({'get': 'list', 'post': 'create'}), name='projectpost-list'),
    path('projectposts/<int:pk>/', ProjectPostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='projectpost-detail'),

    path('messages/', MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='message-list'),
    path('messages/<int:pk>/', MessageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='message-detail'),

    path('comments/', CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='comment-list'),
    path('comments/<int:pk>/', CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='comment-detail'),


    path('register/', register_user, name="register"),
    path("activate/<str:uidb64>/<str:token>/", activate_user, name="activate"),

    path("password-reset/", password_reset_request, name="password_reset"),
    path("password-reset-confirm/<uidb64>/<token>/", password_reset_confirm, name="password_reset_confirm"),

    path('upload-image/', ImageUploadView.as_view(), name='upload-image' ),
    path('delete-image/<int:pk>/', ImageDeleteView.as_view(), name='delete-image' ),
    path("project-images/<int:project_id>/", get_project_images, name="project-images"),
    path("post-images/<int:post_id>/", get_post_images, name="post-images"),
    path("user-images/<int:user_id>/", user_images_view, name="user-images"),
    path("projectpost-images/<int:post_id>/", get_projectpost_images, name="projectpost-images"),
    path("project_weather/<int:project_id>/", get_project_weather, name="project-weather"),
    path("project_weather_averages/<int:project_id>/", get_project_weather__monthly_averages, name="project-weather_averages"),

    path('projects/', ProjectListView.as_view(), name='project-list' ),
    path('projects/create/', ProjectCreateView.as_view(), name='project-create'),
    path('projects/update/<int:pk>/', ProjectUpdateView.as_view(), name='project-update'),
    path('projects/delete/<int:pk>/', ProjectDeleteView.as_view(), name='project-delete'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    
    path('token', MyTokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name = 'token_refresh'),
]

