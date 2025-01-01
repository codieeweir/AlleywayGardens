from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [

    path('login/', views.loginPage, name = 'login'),
    path('logout/', views.logoutUser, name = 'logout'),
    path('register/', views.registerPage, name = 'register'),

    path('', views.home, name="home"),
    path('project/<str:pk>/', views.project, name="project"),
    path('profile/<str:pk>/', views.userProfile, name = 'user-profile'),
    path('forum/', views.forum, name = 'forum'),
    path('forum-post/<str:pk>/', views.forumPost, name = 'forum-post'),


    path('create-project/', views.createProject, name = "create-project"),
    path('create-post/', views.createPost, name = "create-post"),

    path('update-project/<str:pk>/', views.updateProject, name = 'update-project'),
    path('update-post/<str:pk>/', views.updatePost, name = 'update-post'),

    path('delete-project/<str:pk>/', views.deleteProject, name = 'delete-project'),
    path('delete-message/<str:pk>/', views.deleteMessage, name = 'delete-message'),
    path('delete-post/<str:pk>/', views.deletePost, name = 'delete-post'),
    path('delete-comment/<str:pk>/', views.deleteComment, name = 'delete-comment'),

    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="base/password_reset.html"), name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="base/password_sent.html"), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="base/password_reset_form.html"), name = 'password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="base/password_complete.html"), name='password_reset_complete'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
]