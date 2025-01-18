from django.contrib import admin

# Register your models here.

from .models import Project, Zone, Message, Post, Comment


admin.site.register(Project)
admin.site.register(Zone)
admin.site.register(Message)
admin.site.register(Post)
admin.site.register(Comment)
