from django.contrib import admin
from .models import TimeSheet, LineItem

# Register your models here.
admin.site.register(TimeSheet)
admin.site.register(LineItem)