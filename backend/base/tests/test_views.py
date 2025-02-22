import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from .factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message
from django.db.utils import DataError

##Test For Views 