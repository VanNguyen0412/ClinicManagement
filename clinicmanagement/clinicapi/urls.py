from django.urls import path, include
from rest_framework import routers
from clinicapi import views

r = routers.DefaultRouter()

r.register('new', views.NewsViewSet, 'new')
r.register('user', views.UserViewSet, 'user')
r.register('patient', views.PatientViewSet, 'patient')
r.register('doctor', views.DoctorViewSet, 'doctor')
r.register('nurse', views.NurseViewSet, 'nurse')
r.register('appointment', views.AppointmentViewSet, 'appointment')
r.register('prescription', views.PrescriptionViewSet, 'prescription')
r.register('notification', views.NotificationViewSet, 'notification')
r.register('medicine', views.MedicineViewSet, 'medicine')


urlpatterns = [
    path('', include(r.urls)),
]