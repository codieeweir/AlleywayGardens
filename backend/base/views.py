from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from .models import Project, Zone, Message
from .forms import ProjectForm

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
    form = UserCreationForm()

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('home')

        else:
            print(form)
            messages.error(request, "An Error has occurred")
        
    return render(request, 'base/login_register.html', {'form' : form})




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

    context = {'user': user, 'projects': projects, 'project_messages' : project_messages, 'zones' :zones }
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
        message.delete()
        return redirect('home')
    return render(request, 'base/delete.html', {'obj' : message})