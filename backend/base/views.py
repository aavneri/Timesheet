from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .defaultData import defaultData
from .models import TimeSheet
from .serializers import TimeSheetSerializer, LineItemSerializer
from django.contrib.auth.models import User


@api_view(["GET"])
def timesheets(request, userId):
    timesheets = TimeSheet.objects.filter(userId = userId)
    serializer = TimeSheetSerializer(timesheets, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getLineItem(request, pk):
    lineItem = next((li for li in defaultData if li['_id'] == int(pk)), None)
    return Response(lineItem)

