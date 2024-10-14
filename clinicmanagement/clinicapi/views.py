from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from clinicapi.models import *
from clinicapi.serializers import *
from django.core.mail import send_mail
from django.conf import settings
import random
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Table, TableStyle, Spacer
from io import BytesIO
from django.http import HttpResponse
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from .prediction import HypertensionPredictor
from rest_framework.views import APIView
from .perms import *
from .paginators import *
from django.utils import timezone
from datetime import timedelta
import json
from django.http import JsonResponse
import hashlib
import hmac
import requests as external_requests
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.
class NewsViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = News.objects.filter(is_active=True)
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.action in ['create_new', 'update_new', 'delete_new']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create', detail=False)
    def create_new(self, request, *args, **kwargs):
        serializer = NewsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='update', detail=True)
    def update_new(self, request, pk=None):
        new = self.get_object()
        serializer = self.serializer_class(new, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], url_path='delete', detail=True)
    def delete_new(self, request, pk=None):
        new = self.get_object()
        new.delete()
        return Response({'detail': 'Đã xóa thành công.'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        return Response(UserSerializer(user).data)

    @action(methods=['post'], detail=False, url_path='patient')
    def create_user(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)

        # Tạo mã OTP
        otp_code = random.randint(100000, 999999)
        OTPVerification.objects.create(user=user, otp_code=otp_code)
        send_mail(
            'Xác nhận tài khoản của bạn',
            f'Mã OTP của bạn là: {otp_code}',
            'yanghara2611@gmail.com',
            [user.email],
            fail_silently=False,
        )

        return Response(
            data={"message": "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản."},
            status=status.HTTP_201_CREATED
        )

    @action(methods=['post'], detail=False, url_path='verify-otp')
    def verify_otp(self, request, pk=None):
        username = request.data.get('username')
        otp_code = request.data.get('otp')
        if not otp_code or not username:
            return Response(
                data={"message": "Mã OTP và username là bắt buộc."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(username=username)

            otp_record = OTPVerification.objects.get(user=user, otp_code=otp_code)

            user.is_active = True
            user.save()
            otp_record.delete()

            return Response(
                data={"message": "Xác nhận thành công. Tài khoản đã được kích hoạt."},
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:
            return Response(
                data={"message": "Không tìm thấy người dùng với username này."},
                status=status.HTTP_404_NOT_FOUND
            )

        except OTPVerification.DoesNotExist:
            return Response(
                data={"message": "Mã OTP không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST
            )


class PatientViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Patient.objects.filter(user__is_active=True)
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create_patient', 'update_patient', 'create_health_monitoring',
                           'update_health_monitoring', 'update_doctor',
                           'get_invoice_done', 'get_invoice']:
            return [PatientOwner()]
        elif self.action in ['get_health_record']:
            return [DoctorPermission()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'], url_path='current')
    def get_patient_by_user(self, request):
        user_id = request.query_params.get('user')
        try:
            user = User.objects.get(id=user_id)
            patient = Patient.objects.get(user=user)
            serializer = self.get_serializer(patient)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], url_path='create', detail=False)
    def create_patient(self, request, pk=None):
        user_id = request.user.id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": user_id}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['user'] = user_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='update', detail=True)
    def update_patient(self, request, pk=None):
        try:
            patient = self.get_object()
            serializer = self.serializer_class(patient, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Patient.DoesNotExist:
            return Response({'detail': 'Not Found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='healthrecord', detail=True)
    def get_health_record(self, request, pk=None):
        patient = self.get_object()
        health_records = HealthRecord.objects.filter(patient_id=patient)
        serializer = HealthRecordViewSerializer(health_records, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='health_monitoring', detail=True)
    def get_health_monitoring(self, request, pk=None):
        patient = self.get_object()
        health_monitoring = HealthMonitoring.objects.filter(patient_id=patient)
        serializer = HealthMonitoringDetailSerializer(health_monitoring, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='create_health_monitoring', detail=True)
    def create_health_monitoring(self, request, pk=None):
        patient = self.get_object()

        # Kiểm tra nếu đã tồn tại bản ghi theo dõi sức khỏe
        if HealthMonitoring.objects.filter(patient=patient).exists():
            return Response({"error": "Bệnh nhân này đã có bản ghi theo dõi sức khỏe, không thể tạo thêm."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Nếu chưa có bản ghi, tạo mới
        data = request.data.copy()
        data['patient'] = patient.id
        serializer = HealthMonitoringSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Đã tạo tình trạng sức khỏe thành công"}, status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='update_health_monitoring', detail=True)
    def update_health_monitoring(self, request, pk):
        patient = self.get_object()
        health_monitoring = HealthMonitoring.objects.get(patient=patient)
        serializer = HealthMonitoringSerializer(health_monitoring, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Đã cập nhật tình trạng sức khỏe thành công"}, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='update_doctor', detail=True)
    def update_doctor(self, request, pk=None):
        patient = self.get_object()
        doctors = Doctor.objects.filter(healthrecord__patient=patient).distinct()
        health_monitoring = HealthMonitoring.objects.get(patient=patient)
        if health_monitoring:
            health_monitoring.doctor.set(doctors)
            return Response({"detail": "Đã cập nhập thành công."}, status=status.HTTP_200_OK)
        return Response({"error": "Bệnh nhân chưa có tạo theo dõi sức khỏe"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='invoice_done', detail=True)
    def get_invoice_done(self, request, pk=None):
        patient = self.get_object()
        prescriptions = Prescription.objects.filter(appointment__patient=patient)
        invoices = Invoice.objects.filter(prescription__in=prescriptions, is_paid=True)
        if invoices.exists():
            serializer = InvoiceDetailSerializer(invoices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'Không có hóa đơn'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='invoice', detail=True)
    def get_invoice(self, request, pk=None):
        patient = self.get_object()
        prescriptions = Prescription.objects.filter(appointment__patient=patient)
        unpaid_invoices = Invoice.objects.filter(prescription__in=prescriptions,is_paid=False)
        if unpaid_invoices.exists():
            serializer = InvoiceDetailSerializer(unpaid_invoices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'Không có hóa đơn'}, status=status.HTTP_404_NOT_FOUND)


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.filter(user__is_active=True)
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update_doctor']:
            return [DoctorOwner()]
        elif self.action in ['create_rating']:
            return [PatientOwner()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current', detail=False)
    def get_doctor(self, request, pk=None):
        doctor = Doctor.objects.get(user_id=request.user.id)
        return Response(DoctorSerializer(doctor).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update', detail=True)
    def update_doctor(self, request, pk=None):
        try:
            doctor = self.get_object()
            serializer = self.serializer_class(doctor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Doctor.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='rating', detail=True)
    def get_rating(self, request, pk=None):
        doctor = self.get_object()
        rating = Rating.objects.filter(doctor_id=doctor)

        paginator = RatingPaginator()
        paginated_ratings = paginator.paginate_queryset(rating, request)
        serializer = RatingDetailSerializer(paginated_ratings, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='ratingall', detail=True)
    def get_rating_all(self, request, pk=None):
        doctor = self.get_object()
        rating = Rating.objects.filter(doctor_id=doctor)
        serializer = RatingDetailAllSerializer(rating, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='create_rating', detail=True)
    def create_rating(self, request, pk=None):
        patient = Patient.objects.get(user_id=request.user.id)
        doctor = self.get_object()

        # Kiểm tra xem bệnh nhân đã hoàn tất cuộc hẹn với toa thuốc chưa
        has_prescription = Prescription.objects.filter(
            appointment__patient=patient,
            appointment__doctor=doctor
        ).exists()

        if not has_prescription:
            return Response(
                {"error": "Bạn chỉ có thể đánh giá một bác sĩ nếu bạn đã hoàn tất cuộc hẹn và có đơn thuốc.",
                 "doctor": DoctorSerializer(doctor).data},  # Serialize doctor here
                status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['patient'] = patient.id
        data['doctor'] = doctor.id
        serializer = RatingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='name', detail=False)
    def get_doctor_name(self, request):
        doctors = self.get_queryset()
        serializer = DoctorNameSerializer(doctors, many=True)
        return Response(serializer.data)


class NurseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Nurse.objects.filter(user__is_active=True)
    serializer_class = NurseSerializer
    permission_classes = [NursePermission]

    @action(methods=['get'], url_path='current', detail=False)
    def get_nurse(self, request, pk=None):
        nurse = Nurse.objects.get(user_id=request.user.id)
        return Response(NurseSerializer(nurse).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='create', detail=False)
    def create_nurse(self, request):
        user_id = request.user.id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": user_id}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['user'] = user_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AppointmentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create_appointment', 'cancel_appointment', 'get_appoint_patient']:
            return [PatientOwner()]
        elif self.action in ['list_appointment', 'confirm_appointment']:
            return [NursePermission()]
        elif self.action in ['create_result', 'list_appointment_confirm']:
            return [DoctorPermission()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create', detail=False)
    def create_appointment(self, request, pk=None):
        user = request.user.id
        try:
            user = User.objects.get(id=user)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": user}, status=status.HTTP_400_BAD_REQUEST)

        patient = Patient.objects.get(user_id=user)
        data = request.data.copy()
        data['patient'] = patient.id
        serializer = AppointmentCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='listpending', detail=False)
    def list_appointment(self, request, pk=None):  # nurse
        nurse_id = request.user.id
        try:
            nurse = Nurse.objects.get(user_id=nurse_id)
        except Nurse.DoesNotExist:
            return Response({"error": "Nurse not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy ngày hôm qua
        yesterday = timezone.now() - timedelta(days=1)

        doctor_id = nurse.doctor_id
        appointments = Appointment.objects.filter(doctor_id=doctor_id, appointment_date__gte=yesterday.date(),
                                                  status=Appointment.Status.PENDING)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='listconfirm', detail=False)
    def list_appointment_confirm(self, request, pk=None):
        yesterday = timezone.now() - timedelta(days=1)
        user = request.user.id
        doctor = Doctor.objects.get(user_id=user)

        appointments = Appointment.objects.filter(doctor_id=doctor.id, appointment_date__gte=yesterday.date(),
                                                  status=Appointment.Status.CONFIRM)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='confirm', detail=True)
    def confirm_appointment(self, request, pk=None):
        try:
            appointment = self.get_object()
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        appointment_date = appointment.appointment_date

        # Đếm số lịch khám của bác sĩ đã xác nhận trong một ngày
        confirmed_appointments_count = Appointment.objects.filter(
            doctor=appointment.doctor,
            status=Appointment.Status.CONFIRM,
            appointment_date=appointment_date
        ).count()

        if confirmed_appointments_count >= 10:
            none = []
            none.append(appointment.appointment_date)  # 0
            none.append(appointment.appointment_time)  # 1
            none.append(appointment.patient.first_name)  # 2
            none.append(appointment.patient.last_name)  # 3
            none.append(appointment.doctor.last_name)  # 4
            none.append(appointment.doctor.first_name)  # 5
            self.send_error_email(appointment.patient.user.email, none)
            appointment.status = Appointment.Status.CANCELING
            appointment.save()
            return Response({"error": "Bác sĩ đã có hơn 10 cuộc hẹn được xác nhận vào ngày này"},
                            status=status.HTTP_400_BAD_REQUEST)

        appointment.status = Appointment.Status.CONFIRM
        appointment.save()

        # Tạo thông báo về lịch hẹn
        notification_content = f"Lịch hẹn của bạn vào {appointment.appointment_date} đã được xác nhận."
        Notification.objects.create(
            content=notification_content,
            type=Notification.Type.APPOINTMENT,
            user=appointment.patient.user,

        )
        notification_content1 = \
            (f"Bạn có lịch hẹn mới ngày {appointment.appointment_date} cho bệnh nhân "
             f"{appointment.patient.first_name} {appointment.patient.last_name}.")

        Notification.objects.create(
            content=notification_content1,
            type=Notification.Type.GENERAL,
            user=appointment.doctor.user
        )
        serializer = AppointmentSerializer(appointment)
        info = []
        info.append(appointment.appointment_date)  # 0
        info.append(appointment.appointment_time)  # 1
        info.append(appointment.patient.first_name)  # 2
        info.append(appointment.patient.last_name)  # 3
        info.append(appointment.patient.code)  # 4
        info.append(appointment.doctor.last_name)  # 5
        info.append(appointment.doctor.first_name)  # 6
        self.send_notification_email(appointment.patient.user.email, info)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def send_notification_email(self, to_email, info):
        subject = 'Thông báo lịch hẹn khám của bạn'
        message = f"""
        Chào bạn,

        Chúng tôi xin thông báo lịch khám sắp tới của bạn như sau:

        * Họ và tên bệnh nhân: {info[2]} {info[3]}
        * Mã bệnh nhân: {info[4]}
        * Tên bác sĩ: {info[6]} {info[5]}
        * Ngày khám: {info[0]}
        * Giờ khám: {info[1]}

        Vui lòng có mặt tại phòng khám trước giờ hẹn 15 phút để làm thủ tục đăng ký.
        Nếu bạn cần thay đổi, xin vui lòng liên hệ với chúng tôi qua email yanghara2611@gmail.com.
        """

        email_from = settings.EMAIL_HOST_USER
        recipient_list = [to_email]
        send_mail(subject, message, email_from, recipient_list)

    def send_error_email(self, to_email, none):
        subject = 'Thông báo lịch hẹn khám của bạn'
        message = f"""
        Chào bạn,

        Chúng tôi xin thông báo thông tin lịch khám của bạn như sau:

        * Họ và tên bệnh nhân: {none[2]} {none[3]}
        * Tên bác sĩ: {none[5]} {none[4]}
        * Ngày khám: {none[0]}
        * Giờ khám: {none[1]}

        Xin lỗi bạn, vào ngày khám {none[0]} bác sĩ của chúng tôi là {none[5]} {none[4]} đã đủ lịch khám trong một ngày.
        Xin lỗi bạn về vấn đề này, nếu bạn muốn khám bệnh tại phòng khám của chúng tôi, hãy đăng ký lịch khám vào ngày khác hoặc bác sĩ khác.
        Cảm ơn vì đã đến với chúng tôi, nếu có điều thắc mắc, xin vui lòng liên hệ với chúng tôi qua email yanghara2611@gmail.com.
        """

        email_from = settings.EMAIL_HOST_USER
        recipient_list = [to_email]
        send_mail(subject, message, email_from, recipient_list)

    @action(methods=['delete'], url_path='cancel', detail=True)
    def cancel_appointment(self, request, pk=None):
        appointment = self.get_object()
        appointment.delete()
        return Response({"detail": "Đã hủy lịch hẹn thành công"}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], url_path='result', detail=True)
    def create_result(self, request, pk=None):
        appointment = self.get_object()
        user = request.user.id
        doctor = Doctor.objects.get(user_id=user)

        # Kiểm tra xem kết quả khám đã tồn tại cho cuộc hẹn này chưa
        if Prescription.objects.filter(appointment=appointment).exists():
            return Response(
                {"detail": "Đã có kết quả cho cuộc hẹn này."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = request.data.copy()
        data['appointment'] = appointment.id
        data['doctor'] = doctor.id
        serializer = PrescriptionCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        appointment.status = Appointment.Status.DONE
        appointment.save()

        HealthRecord.objects.create(
            patient_id=appointment.patient.id,
            appointment_date=appointment.appointment_date,
            symptom=request.data.get('symptom'),
            diagnosis=request.data.get('diagnosis'),
            allergy_medicines=request.data.get('allergy_medicines', ''),
            doctor=doctor
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='patient', detail=False)
    def get_appoint_patient(self, request, pk=None):
        patient = Patient.objects.get(user_id=request.user.id)
        appointments = Appointment.objects.filter(patient_id=patient.id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PrescriptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create_prescription', 'list_medicines', 'no_prescription', 'delete_prescription']:
            return [DoctorPermission()]
        elif self.action in ['create_invoice', 'info']:
            return [PaymentNursePermission()]
        elif self.action in ['get_result_prescription', 'require_receipt', 'get_invoice_prescription']:
            return [PatientOwner()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='no_medicine', detail=False)
    def no_prescription(self, request, pk=None):
        appointment_id = request.query_params.get('appointment')

        if not appointment_id:
            return Response({"error": "Appointment ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            prescriptions_without_medicine = Prescription.objects.filter(
                prescriptionmedicine__isnull=True,
                appointment_id=appointment_id
            )
        except Prescription.DoesNotExist:
            return Response({"error": "No prescriptions found for this appointment."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PrescriptionSerializer(prescriptions_without_medicine, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='invoice', detail=True)
    def create_invoice(self, request, pk=None):
        prescription = self.get_object()
        medicines = PrescriptionMedicine.objects.filter(prescription=prescription)
        total_price = sum(medicine.price * medicine.count for medicine in medicines)
        data = request.data.copy()
        data['prescription'] = prescription.id
        data['total_price'] = total_price
        data['invoice_type'] = Invoice.INVOICE_TYPE.PRESCRIPTION

        if medicines:
            notification_content = f"""Y tá đã tạo hóa đơn thành công cho bạn."""
            Notification.objects.create(
                content=notification_content,
                type=Notification.Type.INVOICE,
                user=prescription.appointment.patient.user,
                prescription=prescription
            )
            serializer = InvoiceSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Hóa đơn chưa được kê toa thuốc.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='create_medicine', detail=True)
    def create_prescription(self, request, pk=None):
        result = self.get_object()
        medicine_id = request.data.get('medicine')
        if PrescriptionMedicine.objects.filter(prescription=result, medicine_id=medicine_id).exists():
            return Response(
                {"detail": "Thuốc này đã được thêm vào đơn thuốc."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = request.data.copy()
        data['prescription'] = result.id
        serializer = PreMedicineSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['delete'], url_path='medicine', detail=True)
    def delete_prescription(self, request, pk=None):
        result = self.get_object()
        medicine_id = request.query_params.get('medicine')
        prescription = PrescriptionMedicine.objects.filter(prescription=result, medicine_id=medicine_id)
        prescription.delete()

        return Response({'detail': 'Xóa thành công'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='medicines')
    def list_medicines(self, request, pk=None):
        doctor = Doctor.objects.get(user_id=request.user.id)
        prescription = self.get_object()
        medicines = PrescriptionMedicine.objects.filter(prescription=prescription)
        serializer = PresciptMedicineSerializer(medicines, many=True)

        if prescription.doctor.id == doctor.id:
            notification_content = \
                f"""Kết quả khám bệnh của bạn."""
            Notification.objects.create(
                content=notification_content,
                type=Notification.Type.GENERAL,
                user=prescription.appointment.patient.user,
                prescription=prescription
            )
            notification = \
                f"""Thông tin toa thuốc của bạn"""
            Notification.objects.create(
                content=notification,
                type=Notification.Type.MEDICINE,
                user=prescription.appointment.patient.user,
                prescription=prescription
            )
        else:
            return Response({"error": "Bác sĩ hoàn tất phiếu khám phải là bác sĩ khám."})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='result', detail=False)
    def get_result_prescription(self, request, pk=None):
        patients = Patient.objects.get(user=request.user)
        prescriptions = Prescription.objects.filter(appointment__patient=patients)

        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='result_invoice', detail=False)
    def get_invoice_prescription(self, request, pk=None):
        patients = Patient.objects.get(user=request.user)
        prescriptions = Prescription.objects.filter(appointment__patient=patients)
        no_invoice = prescriptions.filter(invoice__isnull=True)

        serializer = PrescriptionSerializer(no_invoice, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='require', detail=True)
    def require_receipt(self, request, pk=None):
        prescription = self.get_object()
        patient = Patient.objects.get(user=request.user)

        nurse = Nurse.objects.get(position='payment_nurse')
        has_prescription = PrescriptionMedicine.objects.filter(
            prescription=prescription
        ).exists()

        if has_prescription:
            notification_content = \
                f"Yêu cầu thanh toán hóa đơn cho bệnh nhân {patient.last_name} với lịch khám {prescription.appointment.appointment_date}."
            Notification.objects.create(
                content=notification_content,
                type=Notification.Type.INVOICE,
                user=nurse.user,
                prescription=prescription
            )
            return Response({'detail': 'Đã yêu cầu thành công.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Bạn chưa được hoàn thành kết quả khám'}, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['get_notification_user', 'get_notification_info']:
            return [NotificationOwner()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset

        user = self.request.query_params.get('user')
        if user:
            queryset = queryset.filter(user_id=user)
        return queryset

    @action(methods=['get'], url_path='list', detail=False)
    def get_notification_user(self, request, pk=None):
        notification = Notification.objects.filter(user_id=request.user.id)

        serializer = NotificationSerializer(notification, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='read', detail=True)
    def read_notification(self, request, pk=None):
        try:
            notification = self.get_queryset().get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        notification.is_read = True
        notification.save()

        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='information', detail=True)
    def get_notification_info(self, request, pk=None):
        notification = self.get_object()

        if notification.type == Notification.Type.APPOINTMENT:
            patient = Patient.objects.get(user=notification.user)
            appointment = Appointment.objects.filter(patient=patient).first()  # Lấy cuộc hẹn gần nhất
            if appointment:
                appointment_serializer = AppointmentSerializer(appointment)
                return Response(appointment_serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "No appointment found"}, status=status.HTTP_404_NOT_FOUND)

        elif notification.type == Notification.Type.GENERAL:
            try:
                prescription = Prescription.objects.get(id=notification.prescription.id)
                prescription_serializer = PrescriptionSerializer(prescription)
                return Response(prescription_serializer.data, status=status.HTTP_200_OK)
            except Prescription.DoesNotExist:
                return Response({"error": "No prescription found for this appointment"},
                                status=status.HTTP_404_NOT_FOUND)

        elif notification.type == Notification.Type.MEDICINE:
            try:
                prescription = Prescription.objects.get(id=notification.prescription.id)
                if prescription:
                    medicine = PrescriptionMedicine.objects.filter(prescription=prescription)
                    serializer = PresciptMedicineSerializer(medicine, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            except PrescriptionMedicine.DoesNotExist:
                return Response({"error": "No medicine found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"error": "Invalid notification type"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=True, url_path='medicines_pdf')
    def get_notification_pdf(self, request, pk=None):
        notification = self.get_object()

        if notification.type == Notification.Type.MEDICINE:
            try:
                prescription = Prescription.objects.get(id=notification.prescription.id)
                if prescription:
                    medicines = PrescriptionMedicine.objects.filter(prescription=prescription)

                    # Đăng ký font Times New Roman
                    font_path = os.path.join(os.path.dirname(__file__), 'path', 'Times New Roman 400.ttf')
                    font_path1 = os.path.join(os.path.dirname(__file__), 'path', 'SVN-Times New Roman Bold.ttf')
                    pdfmetrics.registerFont(TTFont('TimesNewRoman', font_path))
                    pdfmetrics.registerFont(TTFont('bold', font_path1))

                    # Khởi tạo đối tượng BytesIO để lưu PDF
                    buffer = BytesIO()
                    doc = SimpleDocTemplate(buffer, pagesize=A4,
                                            rightMargin=45, leftMargin=45,
                                            topMargin=45, bottomMargin=18)

                    styles = getSampleStyleSheet()
                    styles.add(
                        ParagraphStyle(name='Title_TNR', fontName='bold', fontSize=25, leading=25, alignment=1))
                    styles.add(ParagraphStyle(name='Title2_TNR', fontName='TimesNewRoman', fontSize=19, leading=20,
                                              alignment=1))
                    styles.add(ParagraphStyle(name='Normal_TNR', fontName='TimesNewRoman', fontSize=16, leading=18))
                    styles.add(ParagraphStyle(name='Normal1_TNR', fontName='TimesNewRoman', fontSize=16, leading=18,
                                              alignment=1))
                    styles.add(ParagraphStyle(name='bold_TNR', fontName='bold', fontSize=16, leading=18))
                    styles.add(
                        ParagraphStyle(name='RightAligned1', fontName='bold', fontSize=18, leading=20, alignment=2))
                    styles.add(
                        ParagraphStyle(name='RightAligned', fontName='bold', fontSize=16, leading=18, alignment=2))

                    elements = []
                    elements.append(Paragraph("PHÒNG KHÁM TƯ NHÂN VÍTALCARE CLINIC", styles['Title_TNR']))

                    elements.append(Spacer(1, 7))
                    elements.append(Paragraph("Trường Đại học Mở Thành phố Hồ Chí Minh", styles['Title2_TNR']))

                    elements.append(Spacer(1, 4))
                    elements.append(Paragraph("Địa chỉ: 97 Võ Văn Tần, P. Võ Thị Sáu, Q. 3, TP Hồ Chí Minh",
                                              styles['Normal1_TNR']))

                    # Tiêu đề
                    elements.append(Spacer(1, 15))
                    elements.append(Paragraph("PHIẾU KẾT QUẢ KHÁM", styles['Title_TNR']))

                    # Thông tin bệnh nhân
                    patient_info = [
                        f"Họ và Tên: {prescription.appointment.patient.first_name} {prescription.appointment.patient.last_name}",
                        f"Mã Bệnh Nhân: MH{prescription.appointment.patient.code}",
                        f"Ngày Khám: {prescription.appointment.appointment_date}",
                        f"Giờ Khám: {prescription.appointment.appointment_time}",
                        f"Bác Sĩ Chỉ Định: {prescription.doctor.first_name} {prescription.doctor.last_name}",
                        f"Chuyên Khoa: {prescription.doctor.expertise}",
                    ]

                    elements.append(Spacer(1, 15))
                    elements.append(Paragraph(f"I. THÔNG TIN BỆNH NHÂN:", styles['bold_TNR']))
                    elements.append(Spacer(1, 7))

                    for info in patient_info:
                        elements.append(Paragraph(info, styles['Normal_TNR']))
                        elements.append(Spacer(1, 5))  # Spacer giữa các dòng thông tin

                    results = [
                        f"Triệu Chứng: {prescription.symptom}",
                        f"Chẩn Đoán: {prescription.diagnosis}",
                    ]

                    elements.append(Spacer(1, 10))
                    elements.append(Paragraph(f"II. KẾT QUẢ CHẨN ĐOÁN:", styles['bold_TNR']))
                    elements.append(Spacer(1, 7))
                    for result in results:
                        elements.append(Paragraph(result, styles['Normal_TNR']))
                        elements.append(Spacer(1, 5))  # Spacer giữa các dòng thông tin

                    elements.append(Spacer(1, 12))
                    elements.append(Paragraph(f"III. TOA THUỐC :", styles['bold_TNR']))
                    elements.append(Spacer(1, 10))
                    if medicines.exists():
                        data = [["Tên thuốc", "Giá", "Cách Dùng", "Số Lượng"]]
                        for medicine in medicines:
                            data.append([
                                Paragraph(medicine.medicine.name, styles['Normal_TNR']),
                                Paragraph(str(medicine.price), styles['Normal_TNR']),
                                Paragraph(medicine.dosage, styles['Normal_TNR']),
                                Paragraph(f"{medicine.count} {medicine.medicine.unit}", styles['Normal_TNR'])
                            ])

                        table = Table(data, colWidths=[4 * inch, 1 * inch, 2 * inch, 1 * inch])
                        table.setStyle(TableStyle([
                            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                            ('FONTNAME', (0, 0), (-1, 0), 'bold'),
                            ('FONTSIZE', (0, 0), (-1, 0), 15),
                            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                            ('GRID', (0, 0), (-1, -1), 1, colors.black),
                        ]))
                        elements.append(table)

                    doctor_info = f"{prescription.doctor.first_name} {prescription.doctor.last_name}"
                    elements.append(Spacer(1, 17))
                    elements.append(Paragraph(f"BÁC SĨ CHỈ ĐỊNH", styles['RightAligned1']))
                    elements.append(Spacer(1, 5))
                    elements.append(Paragraph(doctor_info, styles['RightAligned']))
                    # Hoàn thành PDF
                    doc.build(elements)

                    buffer.seek(0)

                    # Tạo phản hồi HTTP với nội dung PDF
                    response = HttpResponse(buffer, content_type='application/pdf')
                    response['Content-Disposition'] = f'attachment; filename="ToaThuoc.pdf"'
                    return response

            except PrescriptionMedicine.DoesNotExist:
                return Response({"error": "No medicine found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": "No appointment found"}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='get_prescription', detail=True)
    def info(self, request, pk=None):
        notification = self.get_object()
        prescription = Prescription.objects.get(id=notification.prescription.id)
        if prescription:
            serializer = PrescriptionSerializer(prescription)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Không tìm thấy phiếu khám'}, status=status.HTTP_404_NOT_FOUND)


class MedicineViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

    @action(methods=['get'], url_path='functional', detail=False)
    def get_functional_food(self, request):
        medicines = Medicine.objects.filter(type='Thực phẩm chức năng')
        paginator = ItemPaginator()
        page = paginator.paginate_queryset(medicines, request)
        if page is not None:
            serializer = MedicineSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(MedicineSerializer(medicines, many=True).data,
                        status=status.HTTP_200_OK)


class RatingViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [PatientOwner()]

    @action(methods=['patch'], url_path='update_rating', detail=True)
    def update_rating(self, request, pk=None):
        user_id = request.user.id
        try:
            patient = Patient.objects.get(user_id=user_id)
        except Patient.DoesNotExist:
            return Response({"error": "User does not exist", "user": user_id}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = Rating.objects.get(pk=pk, patient=patient)
        except Rating.DoesNotExist:
            return Response({"error": "Đánh giá này không tồn tại hoặc bạn không có quyền chỉnh sửa."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = RatingSerializer(rating, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['delete'], url_path='delete_rating', detail=True)
    def delete_rating(self, request, pk=None):
        user_id = request.user.id
        try:
            patient = Patient.objects.get(user_id=user_id)
        except Patient.DoesNotExist:
            return Response({"error": "User does not exist", "user": user_id}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = Rating.objects.get(pk=pk, patient=patient)
        except Rating.DoesNotExist:
            return Response({"error": "Đánh giá này không tồn tại hoặc bạn không có quyền chỉnh sửa."},
                            status=status.HTTP_404_NOT_FOUND)
        rating.delete()
        return Response({"detail": "Đã xóa đánh giá thành công."}, status=status.HTTP_204_NO_CONTENT)


class ForumQuestionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = ForumQuestion.objects.all()
    serializer_class = ForumQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create_forum', 'update_forum', 'delete_forum']:
            return [PatientOwner()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create_forum', detail=False)
    def create_forum(self, request, pk=None):
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": request.user.id},
                            status=status.HTTP_400_BAD_REQUEST)
        patient = Patient.objects.get(user=user)
        data = request.data.copy()
        data['patient'] = patient.id
        serializer = ForumQuestionCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Đã tạo diễn đàn thành công", "data": serializer.data},
                        status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='update_forum', detail=True)
    def update_forum(self, request, pk=None):
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": request.user.id},
                            status=status.HTTP_400_BAD_REQUEST)
        forum = self.get_object()
        patient = Patient.objects.get(user=user)
        if forum.patient.id == patient.id:
            serializer = self.serializer_class(forum, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Bạn không có quyền thực hiện điều này'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], url_path='delete_forum', detail=True)
    def delete_forum(self, request, pk=None):
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response({"error": "User does not exist", "user": request.user.id},
                            status=status.HTTP_400_BAD_REQUEST)

        forum = self.get_object()
        patient = Patient.objects.get(user=user)
        if forum.patient.id == patient.id:
            forum.delete()
            return Response({'detail': 'Đã xóa diễn đàn thành công'}, status=status.HTTP_200_OK)
        return Response({'error': 'Bạn không có quyền thực hiện điều này'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='create_answer', detail=True)
    def create_forum_answer(self, request, pk=None):
        try:
            question = ForumQuestion.objects.get(id=self.get_object().id)
        except ForumQuestion.DoesNotExist:
            return Response({'error': 'Không tìm thấy diễn đàn'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['user'] = request.user.id
        data['forum_question'] = question.id
        serializer = AnswerSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='list_answer', detail=True)
    def get_answer(self, request, pk=None):
        question_id = self.get_object().id
        answers = ForumAnswers.objects.filter(forum_question_id=question_id)
        serializer = ForumAnswerSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PredictView(APIView):
    permission_classes = [PatientOwner]

    def post(self, request, format=None):
        data = request.data.get('blood_pressure', [])
        if len(data) != 3 or any(len(day) != 2 for day in data):
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blood_pressure_data = []
            for day in data:
                systolic = float(day[0])
                diastolic = float(day[1])
                blood_pressure_data.extend([systolic, diastolic])
        except ValueError:
            return Response({'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)

        predictor = HypertensionPredictor()
        prediction = predictor.predict(blood_pressure_data)
        return Response({'prediction': prediction})


class InvoiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['upload_payment_proof']:
            return [PatientOwner()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='upload_payment_proof', detail=True)
    def upload_payment_proof(self, request, pk=None):
        invoice = self.get_object()
        if invoice.payment_proof:
            return Response({
                "error": "Payment proof has already been uploaded. You cannot upload it again."
            }, status=status.HTTP_400_BAD_REQUEST)

        payment_method = Invoice.PAYMENT_CHOICES.MOMO
        payment_proof = request.FILES.get('payment_proof')
        if not payment_method or not payment_proof:
            return Response({"error": "Missing payment_method or payment_proof"}, status=status.HTTP_400_BAD_REQUEST)
        invoice.payment_method = payment_method
        invoice.payment_proof = payment_proof
        price = invoice.total_price + invoice.consultation_fee
        invoice.is_paid = True
        invoice.save()
        Payment.objects.create(
            invoice=invoice,
            payment_method=payment_method,
            amount=price
        )

        return Response({
            "message": "Payment proof uploaded successfully"}, status=status.HTTP_200_OK)


class DoctorRatingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorRatingSerializer


class RemoveAnswer(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def destroy(self, request, question=None, answer=None):
        try:
            question = ForumQuestion.objects.get(id=question)
            forum_answer = ForumAnswers.objects.get(forum_question=question, id=answer)

            if forum_answer.user.id != request.user.id:
                return Response({'error': 'Bạn không có quyền xóa câu trả lời này'},
                                status=status.HTTP_403_FORBIDDEN)
            if forum_answer:
                forum_answer.delete()
                return Response({"detail": "Đã xóa câu trả lời thành công."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "Không tìm thấy câu trả lời."}, status=status.HTTP_404_NOT_FOUND)
        except ForumQuestion.DoesNotExist:
            return Response({"detail": "Không tìm thấy câu hỏi."}, status=status.HTTP_404_NOT_FOUND)
        except ForumAnswers.DoesNotExist:
            return Response({"detail": "Không tìm thấy câu trả lời."}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, question=None, answer=None):
        try:
            question = ForumQuestion.objects.get(id=question)
            forum_answer = ForumAnswers.objects.get(forum_question=question, id=answer)

            # Kiểm tra quyền sở hữu câu trả lời
            if forum_answer.user.id != request.user.id:
                return Response({'error': 'Bạn không có quyền chỉnh sửa câu trả lời này'},
                                status=status.HTTP_403_FORBIDDEN)

            # Cập nhật thuộc tính được gửi trong request
            title = request.data.get('title', None)
            content = request.data.get('content', None)

            if title:
                forum_answer.title = title
            if content:
                forum_answer.content = content

            # Lưu thay đổi
            forum_answer.save()

            return Response({"detail": "Đã cập nhật câu trả lời thành công."}, status=status.HTTP_200_OK)

        except ForumQuestion.DoesNotExist:
            return Response({"detail": "Không tìm thấy câu hỏi."}, status=status.HTTP_404_NOT_FOUND)
        except ForumAnswers.DoesNotExist:
            return Response({"detail": "Không tìm thấy câu trả lời."}, status=status.HTTP_404_NOT_FOUND)


class MoMoViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['momo_payment_request']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create_momo', detail=False)
    def momo_payment_request(self, request):
        invoice_id = request.query_params.get('invoice_id')
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
            partner_code = "MOMO"
            access_key = "F8BBA842ECF85"
            secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
            order_info = "pay with MoMo"
            redirect_url = "http://192.168.1.252:8000/momo/return/"
            ipn_url = "http://192.168.1.252:8000/momo/return/"
            amount = str(invoice.total_price + invoice.consultation_fee)
            order_id = str(uuid.uuid4())
            extra_data = ""
            request_id = str(uuid.uuid4())
            request_type = 'captureWallet'

            invoice.order_id = order_id  # Lưu order_id vào hóa đơn
            invoice.save()

            # Tạo chữ ký
            raw_signature = ("accessKey=" + access_key +
                             "&amount=" + amount +
                             "&extraData=" + extra_data +
                             "&ipnUrl=" + ipn_url +
                             "&orderId=" + order_id +
                             "&orderInfo=" + order_info +
                             "&partnerCode=" + partner_code +
                             "&redirectUrl=" + redirect_url +
                             "&requestId=" + request_id +
                             "&requestType=" + request_type)

            signature = hmac.new(secret_key.encode('utf-8'), raw_signature.encode('utf-8'), hashlib.sha256).hexdigest()

            data = {
                "partnerCode": partner_code,
                "partnerName": "Test",
                "storeId": "MoMoTestStore",
                "requestId": request_id,
                "amount": amount,
                "orderId": order_id,
                "orderInfo": order_info,
                "redirectUrl": redirect_url,
                "ipnUrl": ipn_url,
                "lang": "vi",
                "extraData": extra_data,
                "requestType": request_type,
                "signature": signature
            }
            response = external_requests.post(endpoint, json=data, headers={"Content-Type": "application/json"})
            if response.status_code == 200:
                payUrl = response.json().get('payUrl')
                return Response({'payUrl': payUrl})
            else:
                error_detail = response.json()
                return Response({'error': error_detail}, status=response.status_code)

        except Invoice.DoesNotExist:
            return JsonResponse({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='return')
    def return_url(self, request):
        try:
            order_id = request.query_params.get('orderId')
            result_code = request.query_params.get('resultCode')
            message = request.query_params.get('message')

            if not order_id:
                return Response({'message': 'Thiếu orderId trong URL'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                invoice = Invoice.objects.get(order_id=order_id)

                if result_code == '0':  # 0 là mã thành công
                    invoice.is_paid = True
                    invoice.payment_method = Invoice.PAYMENT_CHOICES.MOMO
                    invoice.save()

                    return Response({'message': 'Thanh toán thành công', 'order_id': order_id},
                                    status=status.HTTP_200_OK)
                else:
                    return Response({'message': f'Thanh toán thất bại: {message}', 'order_id': order_id},
                                    status=status.HTTP_400_BAD_REQUEST)

            except Invoice.DoesNotExist:
                return Response({'message': 'Không tìm thấy hóa đơn với orderId này'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': f'Có lỗi xảy ra: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'create_invoice', 'get_items']:
            return [PatientOwner()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        user = request.user
        medicine_id = request.data.get('medicine_id')
        quantity = request.data.get('quantity', 1)

        try:
            medicine = Medicine.objects.get(id=medicine_id)
        except Medicine.DoesNotExist:
            return Response({"error": "Medicine not found"}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=user)

        # Add medicine to cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, medicine=medicine)

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity

        cart_item.save()

        return Response({"message": "Medicine added to cart successfully"},
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='invoice', detail=False)
    def create_invoice(self, request, *args, **kwargs):
        user = request.user

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = CartItem.objects.filter(cart=cart)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.get_total_price() for item in cart_items)
        consultation_fee = 0
        # Create Invoice
        invoice = Invoice.objects.create(
            total_price=total_price,
            consultation_fee=consultation_fee,
            invoice_type=Invoice.INVOICE_TYPE.MEDICINE
        )
        cart_items.delete()

        return Response({
            "message": "Payment successful",
            "invoice_id": invoice.id,
            "total_price": total_price,
        }, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='items', detail=False)
    def get_items(self, request, pk=None):
        cart = Cart.objects.get(user=request.user)
        items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RemoveCart(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def destroy(self, request, item_id=None):
        try:
            cart = Cart.objects.get(user=request.user)
            item = CartItem.objects.get(cart=cart, id=item_id)

            if item:
                item.delete()
                return Response({"detail": "Đã xóa sản phẩm khỏi giỏ hàng."},
                                status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Không tìm thấy sản phẩm."}, status=status.HTTP_404_NOT_FOUND)
        except Cart.DoesNotExist:
            return Response({"detail": "Không tìm thấy giỏ hàng."}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({"detail": "Không tìm thấy sản phẩm."}, status=status.HTTP_404_NOT_FOUND)
