# Generated by Django 5.0.7 on 2024-08-20 11:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clinicapi', '0006_alter_prescription_patient'),
    ]

    operations = [
        migrations.RenameField(
            model_name='prescription',
            old_name='patient',
            new_name='appointment',
        ),
    ]