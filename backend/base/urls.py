from django.urls import path
from . import views

urlpatterns = [

    path('login/', views.loginPage, name = 'login'),
    path('logout/', views.logoutUser, name = 'logout'),
    path('register/', views.registerPage, name = 'register'),

    path('', views.home, name="home"),
    path('project/<str:pk>/', views.project, name="project"),
    path('profile/<str:pk>/', views.userProfile, name = 'user-profile'),
    path('create-project/', views.createProject, name = "create-project"),
    path('update-project/<str:pk>/', views.updateProject, name = 'update-Project'),
    path('delete-project/<str:pk>/', views.deleteProject, name = 'delete-project'),
    path('delete-message/<str:pk>/', views.deleteMessage, name = 'delete-message')
]
