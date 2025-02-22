from django.urls import path, include
from ..views import views
from rest_framework.routers import DefaultRouter
from ..views.views import  ZoneViewSet, UserViewSet, PostViewSet, MessageViewSet, CommentViewSet, ProjectListView,  ProjectCreateView, ProjectDetailView

## ViewSet routing

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'zones', ZoneViewSet)
router.register(r'posts', PostViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('projects/', ProjectListView.as_view(), name='project-list' ),
    path('projects/create/', ProjectCreateView.as_view(), name='project-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
]

# urlpatterns = [
#     path('projects/', project_list, name='project-list'),
#     path('projects/:id', project_detail, name='project-list')
# ]