# Generated by Django 4.2.5 on 2023-09-06 23:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lineitem',
            old_name='LineItemtId',
            new_name='LineItemId',
        ),
    ]
