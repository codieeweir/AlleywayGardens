import pandas as pd
from numpy import convolve
import openmeteo_requests
from retry_requests import retry
import requests_cache
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.db.models.functions import Area
from django.contrib.gis.db.models import Sum
from base.models import Project
import json
from django.http import JsonResponse, HttpResponseRedirect

# Setup API client with caching and retry logic
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

def get_project_weather(request, project_id):
    try:
        # Retrieve project and extract first coordinate from shape field
        project = Project.objects.get(id=project_id)
        shape_geojson = json.loads(GEOSGeometry(project.shape).geojson)
        coordinates = shape_geojson["coordinates"][0][0]  # Extract first coordinate (Polygon assumption)
        latitude, longitude = coordinates[1], coordinates[0]  # GeoJSON format: [longitude, latitude]

        # Open-Meteo API request parameters
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "temperature_2m_max", "daylight_duration", "sunshine_duration", 
                "uv_index_max", "precipitation_sum", "rain_sum", "precipitation_hours"
            ],
            "timezone": "auto",
            "forecast_days": 7
        }

        # Fetch weather data
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        # Extract daily weather data
        daily = response.Daily()
        daily_data = {
            "date": pd.date_range(
                start=pd.to_datetime(daily.Time(), unit="s", utc=True),
                end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
                freq=pd.Timedelta(seconds=daily.Interval()),
                inclusive="left"
            ),
            "temperature_2m_max": daily.Variables(0).ValuesAsNumpy(),
            "daylight_duration": daily.Variables(1).ValuesAsNumpy(),
            "sunshine_duration": daily.Variables(2).ValuesAsNumpy(),
            "uv_index_max": daily.Variables(3).ValuesAsNumpy(),
            "precipitation_sum": daily.Variables(4).ValuesAsNumpy(),
            "rain_sum": daily.Variables(5).ValuesAsNumpy(),
            "precipitation_hours": daily.Variables(6).ValuesAsNumpy()
        }

        # Convert DataFrame to JSON response
        daily_dataframe = pd.DataFrame(daily_data)
        print(daily_dataframe)
        return JsonResponse(daily_dataframe.to_dict(orient="records"), safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def get_project_weather__monthly_averages(request, project_id):
    try:
        # Retrieve project and extract first coordinate from shape field
        project = Project.objects.get(id=project_id)
        shape_geojson = json.loads(GEOSGeometry(project.shape).geojson)
        coordinates = shape_geojson["coordinates"][0][0]  # Extract first coordinate (Polygon assumption)
        latitude, longitude = coordinates[1], coordinates[0]  # GeoJSON format: [longitude, latitude]

        # Open-Meteo API request parameters
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "temperature_2m_max", "daylight_duration", "sunshine_duration", 
                "uv_index_max", "precipitation_sum", "rain_sum", "precipitation_hours"
            ],
            "timezone": "auto",
            "past_days": 31
        }

        # Fetch weather data
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        # Extract daily weather data
        daily = response.Daily()
        daily_data = {
            "date": pd.date_range(
                start=pd.to_datetime(daily.Time(), unit="s", utc=True),
                end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
                freq=pd.Timedelta(seconds=daily.Interval()),
                inclusive="left"
            ),
            "temperature_2m_max": daily.Variables(0).ValuesAsNumpy(),
            "daylight_duration": daily.Variables(1).ValuesAsNumpy(),
            "sunshine_duration": daily.Variables(2).ValuesAsNumpy(),
            "uv_index_max": daily.Variables(3).ValuesAsNumpy(),
            "precipitation_sum": daily.Variables(4).ValuesAsNumpy(),
            "rain_sum": daily.Variables(5).ValuesAsNumpy(),
            "precipitation_hours": daily.Variables(6).ValuesAsNumpy()
        }

        # Convert DataFrame to JSON response
        daily_dataframe = pd.DataFrame(daily_data)

        monthly_averages = daily_dataframe.drop(columns=["date"]).mean().to_dict()
        print(monthly_averages)
        return JsonResponse({"monthly_averages" : monthly_averages}, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    