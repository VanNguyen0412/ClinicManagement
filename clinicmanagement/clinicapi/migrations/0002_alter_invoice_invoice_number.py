# Generated by Django 5.0.7 on 2024-09-18 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinicapi', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='invoice_number',
            field=models.CharField(default='F40FCD6E2F70', max_length=12),
        ),
    ]