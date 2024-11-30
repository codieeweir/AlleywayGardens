from django.forms import ModelForm
from .models import Project, Post, Zone

class ProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
        exclude = ['host']

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = '__all__'
        exclude = ['user']
