from django.urls import path
from . import routes 
from ..views import views

urlpatterns = [
    path('', routes.getRoutes),
    path('projects/', views.getProjects),
    path('projects/<str:pk>', views.getProject),
    path('user/<str:pk>', views.getUser),
    path('users/', views.getUsers),
    path('zones/', views.getZones),
    path('posts/', views.getPosts),
    path('messages/', views.getMessages),
    path('comments/', views.getComments),
]