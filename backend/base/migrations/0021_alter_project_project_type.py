# Generated by Django 4.2.16 on 2025-04-23 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0020_projectpost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_type',
            field=models.CharField(max_length=50),
        ),
    ]
