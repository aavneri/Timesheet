from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import TimeSheet, LineItem
from .serializers import (
    TimeSheetSerializer,
    UserSerializerWithToken,
    LineItemSerializer,
)


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
def register_user(request):
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
        message = {"detail": "User with this email already exists!"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data["name"]
    user.username = data["email"]
    user.email = data["email"]

    if data["password"] != "":
        user.password = make_password(data["password"])

    user.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def timesheets(request, userId):
    timesheets = TimeSheet.objects.filter(user=userId)
    serializer = TimeSheetSerializer(timesheets, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_timesheet(request, pk):
    try:
        timesheet = TimeSheet.objects.get(timesheetId=pk)
        serializer = TimeSheetSerializer(timesheet, many=False)
        return Response(serializer.data)
    except Exception:
        message = {"detail": f"Unable to find timesheet with id {pk}"}
        return Response(message, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_timesheet(request, pk):
    try:
        timesheet = TimeSheet.objects.get(timesheetId=pk)
        timesheet.description = request.data["description"]
        timesheet.rate = request.data["rate"]
        timesheet.save()
        serializer = TimeSheetSerializer(timesheet, many=False)
        return Response(serializer.data)
    except Exception as err:
        message = {"detail": f"Unable to find timesheet with id {pk}"}
        return Response(message, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_timesheet(request):
    try:
        user = request.user
        timesheet = TimeSheet.objects.create(
            user=user,
        )
        serializer = TimeSheetSerializer(timesheet, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as err:
        return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_timesheet(request, pk):
    try:
        timesheet = TimeSheet.objects.get(timesheetId=pk)
        timesheet.delete()
        return Response(pk, status=status.HTTP_200_OK)
    except Exception as err:
        return Response(err, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_line_item(request, pk):
    try:
        lineItem = LineItem.objects.get(lineItemId=pk)
        lineItem.minutes = request.data["minutes"]
        lineItem.date = request.data["date"]
        lineItem.save()
        return Response(LineItemSerializer(lineItem).data, status=status.HTTP_200_OK)
    except Exception as err:
        return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_line_item(request):
    try:
        lineItem = LineItem.objects.create(
            date=request.data["date"],
            minutes=request.data["minutes"],
            timesheet=TimeSheet.objects.get(timesheetId=request.data["timesheetId"]),
        )
        lineItem.save()
        return Response(
            LineItemSerializer(lineItem).data, status=status.HTTP_201_CREATED
        )
    except Exception as err:
        return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_line_item(request):
    try:
        for pk in request.data["lineItemIds"]:
            lineItem = LineItem.objects.get(lineItemId=pk)
            lineItem.delete()
        return Response(request.data["lineItemIds"], status=status.HTTP_200_OK)
    except Exception as err:
        return Response(err, status=status.HTTP_404_NOT_FOUND)
