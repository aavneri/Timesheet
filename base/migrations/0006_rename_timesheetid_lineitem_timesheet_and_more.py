# Generated by Django 4.2.5 on 2023-09-08 17:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_timesheet_rate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lineitem',
            old_name='timesheetId',
            new_name='timesheet',
        ),
        migrations.RenameField(
            model_name='timesheet',
            old_name='userId',
            new_name='user',
        ),
    ]
