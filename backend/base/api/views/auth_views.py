from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

## JWT token logic was learnt from https://www.youtube.com/watch?v=c0x_AaPjNCY and applied t project

## Token serializer 
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adding custom fields to my tokens
        token['username'] = user.username
        token['firstname'] = user.first_name
        token['surname'] = user.last_name

        return token
    
#Token View triggered with API endpoint 
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
