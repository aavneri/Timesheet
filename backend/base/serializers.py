from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TimeSheet, LineItem

class TimeSheetSerializer(serializers.ModelSerializer):
    dateCreated = serializers.DateTimeField('%d/%m/%y %H:%M:%S')
    class Meta:
        model = TimeSheet
        fields = '__all__'

class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = '__all__'