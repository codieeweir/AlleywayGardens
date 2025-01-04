from django.test import TestCase
import pytest

pytestmark = pytest.mark.django_db


class TestZoneModel: 
    def test_str_return(self, zone_factory):
        zone = zone_factory(name="testingZone")
        assert zone.__str__() == "testingZone"

class TestMessageModel: 
    def test_str_return(self, message_factory):
        message = message_factory(body="testingmessage")
        assert message.__str__() == "testingmessage"
