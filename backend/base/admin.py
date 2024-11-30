from django.contrib import admin

# Register your models here.

from .models import Project, Zone, Message


admin.site.register(Project)
admin.site.register(Zone)
admin.site.register(Message)
