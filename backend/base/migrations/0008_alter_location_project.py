# Generated by Django 4.2.16 on 2025-01-08 21:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='locations', to='base.project'),
        ),
    ]
