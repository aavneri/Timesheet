from django.urls import path
from . import views

urlpatterns = [
    path("users/login", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("users/register/", views.register_user, name="register"),
    path("users/profile/update/", views.update_user_profile, name="users_profile_update"),
    path("users/<str:userId>/timesheets/", views.timesheets, name="table_data"),
    path("timesheets/<str:pk>/", views.get_timesheet, name="timesheet_data"),
    path("timesheets/update/<str:pk>/", views.update_timesheet, name="update_timesheet"),
    path("lineitems/update/<str:pk>/", views.update_line_item, name="update_line_item"),
]
