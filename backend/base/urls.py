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
    path('create-post/', views.createPost, name = "create-post"),
    path('update-project/<str:pk>/', views.updateProject, name = 'update-project'),
    path('delete-project/<str:pk>/', views.deleteProject, name = 'delete-project'),
    path('delete-message/<str:pk>/', views.deleteMessage, name = 'delete-message'),
    path('delete-post/<str:pk>/', views.deletePost, name = 'delete-post'),
    path('forum/', views.forum, name = 'forum'),
    path('forum-post/<str:pk>/', views.forumPost, name = 'forum-post')
]
