# Generated by Django 4.2.5 on 2023-09-08 00:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_rename_lineitemtid_lineitem_lineitemid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lineitem',
            old_name='LineItemId',
            new_name='lineItemId',
        ),
        migrations.RenameField(
            model_name='lineitem',
            old_name='TimeSheetId',
            new_name='timeSheetId',
        ),
        migrations.RenameField(
            model_name='timesheet',
            old_name='TimeSheetId',
            new_name='timeSheetId',
        ),
    ]