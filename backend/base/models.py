from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TimeSheet(models.Model):
    TimeSheetId = models.AutoField(primary_key=True, editable=False)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    description = models.TextField(max_length=1000, null=True, blank=True)
    rate = models.DecimalField(max_digits=8, decimal_places=2, default=0, null=True, blank=True)
    totalTime = models.IntegerField(null=True, blank=True, default=0)
    dateCreated = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField()

    def __str__(self) :
        return str(self.TimeSheetId)

class LineItem(models.Model):
    LineItemId = models.AutoField(primary_key=True, editable=False)
    TimeSheetId = models.ForeignKey(TimeSheet, on_delete=models.CASCADE, null=False)
    minutes = models.IntegerField(null=True, blank=True, default=0)
    date = models.DateField(auto_now=False, auto_now_add=False)
    def __str__(self) :
        return f'{self.TimeSheetId} - {self.LineItemId}'