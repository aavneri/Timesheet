from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .defaultData import defaultData


@api_view(["GET"])
def getTableData(request):
    return Response(defaultData)


@api_view(["GET"])
def getLineItem(request, pk):
    lineItem = next((li for li in defaultData if li['_id'] == int(pk)), None)
    return Response(lineItem)
