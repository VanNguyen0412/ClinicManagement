# Generated by Django 5.0.7 on 2024-08-20 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinicapi', '0007_rename_patient_prescription_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='healthrecord',
            name='allergy_medicines',
            field=models.TextField(),
        ),
    ]
