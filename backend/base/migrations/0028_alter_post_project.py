# Generated by Django 4.2.16 on 2025-05-02 09:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0027_alter_projectpost_project'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.project'),
        ),
    ]
