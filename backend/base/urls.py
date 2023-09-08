from django.urls import path
from . import views

urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),
    path('users/profile/update/', views.updateUserProfile, name='users_profile_update'),
    path("users/<str:userId>/timesheets/", views.timesheets, name="table_data"),
    path("timesheets/<str:pk>/", views.getTimesheet, name="timesheet_data"),
    path("getLineItem/<str:pk>/", views.getLineItem, name="get_line_item"),
]
