from django.urls import path
from . import views

urlpatterns = [
    path("tabledata/", views.getTableData, name="table_data"),
    path("getLineItem/<str:pk>", views.getLineItem, name="get_line_item"),
]
