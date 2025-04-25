import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from ..factories import ProjectFactory, ZoneFactory, UserFactory, MessageFactory
from base.models import Message
from django.db.utils import DataError

pytestmark = pytest.mark.django_db

class TestZoneModel:


    def test_str_return(self, zone_factory):
        zone = zone_factory(name="testingzone")
        assert str(zone) == "testingzone"

    def test_max_legth_name(self, zone_factory):
        zone = zone_factory(name = "A" * 200)
        assert len(zone.name) == 200
        with pytest.raises(Exception):
            zone_factory(name = "A"* 201)        
