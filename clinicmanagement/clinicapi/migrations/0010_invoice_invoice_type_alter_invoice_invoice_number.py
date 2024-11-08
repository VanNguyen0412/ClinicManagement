# Generated by Django 5.0.7 on 2024-10-11 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinicapi', '0009_alter_invoice_invoice_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='invoice_type',
            field=models.CharField(blank=True, choices=[('prescription', 'Prescription'), ('medicine', 'Medicine')], default='prescription', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='invoice_number',
            field=models.CharField(default='7D8E1E778B49', max_length=12),
        ),
    ]
