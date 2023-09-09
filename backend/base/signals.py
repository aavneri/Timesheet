from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.auth.models import User
from . import models


def update_user(sender, instance, **kwargs):
    user = instance
    if user.email != "":
        user.username = user.email


def update_timesheet(sender, instance, **kwargs):
    timesheet = instance.timesheet
    lineItems = timesheet.lineitem_set
    totalMinutes = 0
    for item in timesheet.lineitem_set.all():
        totalMinutes += item.minutes
    timesheet.totalTime = totalMinutes
    timesheet.save()


pre_save.connect(update_user, sender=User)
post_save.connect(update_timesheet, sender=models.LineItem)
post_delete.connect(update_timesheet, sender=models.LineItem)
