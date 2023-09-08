from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import TimeSheet, LineItem


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "isAdmin"]

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "isAdmin", "token"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = "__all__"


class TimeSheetSerializer(serializers.ModelSerializer):
    dateCreated = serializers.DateTimeField("%d/%m/%y %H:%M:%S")
    lineItems = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TimeSheet
        fields = "__all__"

    def get_lineItems(self, obj):
        items = obj.lineitem_set.all()
        serializer = LineItemSerializer(items, many=True)
        return serializer.data
