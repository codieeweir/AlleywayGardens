# Generated by Django 4.2.16 on 2025-04-23 15:25

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0022_alter_project_location_alter_project_shape'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, default=django.contrib.gis.geos.point.Point(-5.93012, 54.5973), null=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='project',
            name='shape',
            field=django.contrib.gis.db.models.fields.GeometryField(blank=True, srid=4326),
        ),
    ]
