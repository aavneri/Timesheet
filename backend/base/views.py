from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .defaultData import defaultData
from .models import TimeSheet
from .serializers import TimeSheetSerializer, UserSerializerWithToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=make_password(data["password"]),
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail':'User with this email already exists!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def timesheets(request, userId):
    timesheets = TimeSheet.objects.filter(userId = userId)
    serializer = TimeSheetSerializer(timesheets, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getTimesheet(request, pk):
    timesheets = TimeSheet.objects.get(timesheetId = pk)
    serializer = TimeSheetSerializer(timesheets, many=False)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getLineItem(request, pk):
    lineItem = next((li for li in defaultData if li['_id'] == int(pk)), None)
    return Response(lineItem)

