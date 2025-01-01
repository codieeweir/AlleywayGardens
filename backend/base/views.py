from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from .models import Project, Zone, Message, Post, Comment
from .forms import ProjectForm, PostForm, CustomUserCreationForm

def loginPage(request):
    page = 'login'
    if request.method == 'POST':
        username = request.POST.get('username').lower()
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=username)
        except:
            messages.error(request, "User does not exist")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            messages.error(request, "Username or password does not exist")

    context = {'page' : page}
    return render(request, 'base/login_register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('home')

def registerPage(request):
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.is_active = False
            user.save()

            #send email verification functionality
            current_site = get_current_site(request)
            mail_subject = 'Activate your Account'
            message = render_to_string('base/email_verification.html', {
                'user' : user,
                'domain': current_site.domain,
                'uid' : urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user)
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.send()

            messages.success(request, 'An email has been sent for verification to your email address')
            return redirect('login')
        else:
            messages.error(request, 'An Error has occurred')

           # login(request, user)
           # return redirect('home')

    else:
        print(form)
        messages.error(request, "An Error has occurred")
        
    return render(request, 'base/login_register.html', {'form' : form})

def activate(request, uidb4, token):
    try:
        uid= force_str(urlsafe_base64_decode(uidb4))
        user= User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save

        login(request, user)

        message.success(request, 'Your account has been successfully activated!')
        return redirect('profile')
    else:
        return HttpResponse('Activation link is invalid!')


# Create your views here.
def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    projects = Project.objects.filter(
                                      Q(zone__name__icontains=q) |
                                      Q(name__icontains=q)
                                      )

    zones = Zone.objects.all()

    context = {'projects' : projects, 'zones': zones}
    return  render(request, 'base/home.html' , context)

def project(request, pk):
    project = Project.objects.get(id=pk)

    project_messages = project.message_set.all().order_by('-created')
    participants = project.participants.all()

    if request.method =='POST':
        message = Message.objects.create(
            user=request.user,
            project=project,
            body=request.POST.get('body')
        )
        project.participants.add(request.user)
        return redirect('project', pk=project.id)
    
    context = {'project':project, 'project_messages':project_messages, 'participants':participants}
    return render(request, 'base/projects.html', context)


def userProfile(request, pk):
    user = User.objects.get(id=pk)
    projects = user.project_set.all()
    project_messages = user.message_set.all()
    zones = Zone.objects.all()
    posts = user.post_set.all()
    comments = user.comment.all()
    

    context = {'user': user, 'projects': projects, 'project_messages' : project_messages, 'zones' :zones , 'posts' : posts, 'comments' : comments}
    return render(request, 'base/profile.html', context)



@login_required(login_url='/login')
def createProject(request):
    form = ProjectForm()
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.host = request.user
            project.save()
            return redirect('home')

    context= {'form' : form}
    return render(request, 'base/project_form.html', context)

@login_required(login_url='/login')
def updateProject(request, pk):
    project = Project.objects.get(id = pk)
    form = ProjectForm(instance=project)

    if request.user != project.host:
        return HttpResponse("You are not the project host")

    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            return redirect('home')

    context = {'form' : form}
    return render(request, 'base/project_form.html', context)

@login_required(login_url='/login')
def deleteProject(request, pk):
    project = Project.objects.get(id = pk)

    if request.user != project.host:
     return HttpResponse("You are not the project host")

    if request.method == 'POST':
        project.delete()
        return redirect('home')
    return render(request, 'base/delete.html', {'obj' : project})

@login_required(login_url='/login')
def deleteMessage(request, pk):
    message = Message.objects.get(id = pk)

    if request.user != message.user:
     return HttpResponse("You are not allowed to do this")

    if request.method == 'POST':
        project_id = message.project.id
        message.delete()
        return redirect('project', pk = project_id)
    return render(request, 'base/delete.html', {'obj' : message})

@login_required(login_url='/login')
def deletePost(request, pk):
    post = Post.objects.get(id = pk)

    if request.user != post.user:
     return HttpResponse("You are not allowed to do this")

    if request.method == 'POST':
        post.delete()
        return redirect('forum')
    return render(request, 'base/delete.html', {'obj' : post})


def forum(request):
    posts = Post.objects.all().order_by('-created')

    context = {'posts':posts}
    return render(request, 'base/forum.html', context)

def forumPost(request, pk):
    post = Post.objects.get(id=pk)
    post_comments = post.comment.all().order_by('-created')

    if request.method =='POST':
        comment = Comment.objects.create(
            user=request.user,
            post=post,
            body=request.POST.get('body')
        )
        return redirect('forum-post', pk=post.id)

    
    context = {'post':post, 'post_comments' : post_comments }
    return render(request, 'base/forum_post.html', context)


@login_required(login_url='/login')
def createPost(request):
    form = PostForm()
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect('forum')

    context= {'form' : form}
    return render(request, 'base/post_form.html', context)

@login_required(login_url='/login')
def updatePost(request, pk):
    post = Post.objects.get(id = pk)
    form = PostForm(instance=post)

    if request.user != post.user:
        return HttpResponse("You are not the project host")

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect('forum')

    context = {'form' : form}
    return render(request, 'base/post_form.html', context)

@login_required(login_url='/login')
def deleteComment(request, pk):
    comment = Comment.objects.get(id = pk)

    if request.user != comment.user:
     return HttpResponse("You are not allowed to do this")

    if request.method == 'POST':
        post_id = comment.post.id
        comment.delete()
        return redirect('forum-post', pk = post_id)
    return render(request, 'base/delete.html', {'obj' : comment})

