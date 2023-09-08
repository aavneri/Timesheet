from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TimeSheet(models.Model):
    timesheetId = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    description = models.TextField(max_length=1000, null=True, blank=True)
    rate = models.IntegerField(null=True, blank=True, default=0)
    totalTime = models.IntegerField(null=True, blank=True, default=0)
    dateCreated = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField()

    def __str__(self) :
        return str(self.timesheetId)

class LineItem(models.Model):
    lineItemId = models.AutoField(primary_key=True, editable=False)
    timesheet = models.ForeignKey(TimeSheet, on_delete=models.CASCADE, null=False)
    minutes = models.IntegerField(null=True, blank=True, default=0)
    date = models.DateField(auto_now=False, auto_now_add=False)
    def __str__(self) :
        return f'{self.timesheet} - {self.lineItemId}'