from django.contrib import admin
from django.contrib import admin
from clinicapi.models import *
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
import cloudinary
from django.urls import reverse
from django.utils.html import format_html


class ClinicAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ PHÒNG KHÁM TƯ"


admin_site = ClinicAppAdminSite('myclinic')


class NewsForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = News
        fields = '__all__'


class NewsAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'created_date', 'is_active', 'edit']
    search_fields = ['title']
    form = NewsForm

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'fullname', 'display_gender', 'address', 'phone', 'code', 'edit']
    search_fields = ['code']

    def fullname(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def display_gender(self, obj):
        return "Nữ" if not obj.gender else "Nam"

    display_gender.short_description = 'gender'

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class DoctorForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Doctor
        fields = '__all__'


class DoctorAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'birthdate', 'expertise', 'qualifications', 'experience_years',
                    'position', 'edit']
    search_fields = ['last_name']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class NurseAdmin(admin.ModelAdmin):
    list_display = ['id', 'fullname', 'birthdate', 'position', 'doctor', 'edit']
    search_fields = ['fullname']

    def fullname(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class MedicineAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'exp_date', 'mfg_date', 'type', 'unit', 'edit']
    search_fields = ['name']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'is_active', 'date_joined', 'email', 'role']
    search_fields = ['username']


class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment_date', 'appointment_time', 'status', 'patient', 'doctor']
    search_fields = ['appointment_date']


class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment', 'doctor', 'symptom', 'diagnosis']
    search_fields = ['appointment']

    def save_model(self, request, obj, form, change):
        # Lưu đối tượng Prescription trước
        super().save_model(request, obj, form, change)

        # Tạo HealthRecord sau khi Prescription đã được lưu
        HealthRecord.objects.create(
            patient=obj.appointment.patient,  # Lấy thông tin bệnh nhân từ cuộc hẹn
            appointment_date=obj.appointment.appointment_date,
            symptom=obj.symptom,
            diagnosis=obj.diagnosis,
            allergy_medicines="None",  # Đặt mặc định allergy_medicines là None
            doctor=obj.doctor
        )


class PreMeAdmin(admin.ModelAdmin):
    list_display = ['id', 'prescription', 'medicine', 'dosage', 'count', 'price']


class HealthRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment_date', 'symptom', 'diagnosis', 'patient', 'doctor', 'allergy_medicines']


class HealthMonitoringAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'height', 'weight', 'heart_rate', 'blood_pressure_systolic',
                    'blood_pressure_diastolic', 'measurement_time']

    def doctor_list(self, obj):
        return ", ".join([f"{doctor.first_name} {doctor.last_name}" for doctor in obj.doctor.all()])

    doctor_list.short_description = 'Doctor'

    list_display.append('doctor_list')


class ForumQuestionAdmin(admin.ModelAdmin):
    list_display = fields = ['id', 'title', 'content', 'patient']


# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Doctor, DoctorAdmin)
admin_site.register(News, NewsAdmin)
admin_site.register(Patient, PatientAdmin)
admin_site.register(Nurse, NurseAdmin)
admin_site.register(Appointment, AppointmentAdmin)
admin_site.register(Prescription, PrescriptionAdmin)
admin_site.register(HealthRecord, HealthRecordAdmin)
admin_site.register(HealthMonitoring, HealthMonitoringAdmin)
admin_site.register(Medicine, MedicineAdmin)
admin_site.register(PrescriptionMedicine, PreMeAdmin)
admin_site.register(Rating)
admin_site.register(ForumQuestion, ForumQuestionAdmin)
admin_site.register(ForumAnswers)
admin_site.register(Notification)
admin_site.register(Payment)
admin_site.register(Report)
