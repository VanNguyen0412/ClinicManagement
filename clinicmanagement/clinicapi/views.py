from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
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


# Create your views here.
class NewsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = News.objects.filter(is_active=True)
    serializer_class = NewsSerializer

    @action(methods=['post'], url_path='create', detail=False, permission_classes=[IsAdminUser])
    def create_new(self, request, *args, **kwargs):
        serializer = NewsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

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

        # Lưu user tạm thời nhưng chưa kích hoạt
        user = serializer.save(is_active=False)

        # Tạo mã OTP
        otp_code = random.randint(100000, 999999)

        # Lưu mã OTP vào cơ sở dữ liệu hoặc sử dụng một mô hình OTPVerification
        OTPVerification.objects.create(user=user, otp_code=otp_code)

        # Gửi email chứa mã OTP
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
        # Lấy usename và mã OTP từ request
        username = request.data.get('username')
        otp_code = request.data.get('otp_code')
        if not otp_code or not username:
            return Response(
                data={"message": "Mã OTP và username là bắt buộc."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            # Tìm user bằng email
            user = User.objects.get(username=username)

            # Tìm mã OTP trong cơ sở dữ liệu
            otp_record = OTPVerification.objects.get(user=user, otp_code=otp_code)

            # Nếu tìm thấy mã OTP hợp lệ, kích hoạt tài khoản
            user.is_active = True
            user.save()

            # Xóa mã OTP sau khi xác nhận thành công
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
        # Check if the user is a doctor
        if not hasattr(request.user, 'doctor'):
            return Response(
                {"detail": "Bạn không có quyền xem hồ sơ sức khỏe của bệnh nhân này."},
                status=status.HTTP_403_FORBIDDEN
            )
        healthrecords = HealthRecord.objects.filter(patient_id=patient)
        serializer = HealthRecordSerializer(healthrecords, many=True)
        return Response(serializer.data)


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.filter(user__is_active=True)
    serializer_class = DoctorSerializer

    @action(methods=['post'], url_path='create', detail=False)
    def create_doctor(self, request, pk=None):
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


class NurseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Nurse.objects.filter(user__is_active=True)
    serializer_class = NurseSerializer

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


class AppointmentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

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

        data = request.data.get('date')
        doctor_id = nurse.doctor_id
        appointments = Appointment.objects.filter(doctor_id=doctor_id, appointment_date=data,
                                                  status=Appointment.Status.PENDING)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='listconfirm', detail=False)
    def list_appointment_confirm(self, request, pk=None):
        data = request.data.get('date')
        user = request.user.id
        doctor = Doctor.objects.get(user_id=user)

        appointments = Appointment.objects.filter(doctor_id=doctor.id, appointment_date=data,
                                                  status=Appointment.Status.CONFIRM)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='confirm', detail=True)
    def confirm_appointment(self, request, pk=None):
        nurse_id = request.user.id
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
            return Response({"error": "Bác sĩ đã có hơn 10 cuộc hẹn được xác nhận vào ngày này"},
                            status=status.HTTP_400_BAD_REQUEST)

        appointment.status = Appointment.Status.CONFIRM
        appointment.save()
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

        HealthRecord.objects.create(
            patient_id=appointment.patient.id,
            appointment_date=appointment.appointment_date,
            symptom=request.data.get('symptom'),
            diagnosis=request.data.get('diagnosis'),
            allergy_medicines=request.data.get('allergy_medicines', ''),
            # Get allergy medicines from request if available
            doctor=doctor
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PrescriptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    @action(methods=['post'], url_path='create_medicine', detail=True)
    def create_prescription(self, request, pk=None):
        result = self.get_object()
        user = request.user.id
        doctor = Doctor.objects.get(user_id=user)
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

    @action(detail=True, methods=['get'], url_path='medicines')
    def list_medicines(self, request, pk=None):
        prescription = self.get_object()
        medicines = PrescriptionMedicine.objects.filter(prescription=prescription)
        serializer = PresciptMedicineSerializer(medicines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='medicines_pdf')
    def list_medicines_pdf(self, request, pk=None):
        prescription = self.get_object()
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
        styles.add(ParagraphStyle(name='Title_TNR', fontName='bold', fontSize=25, leading=25, alignment=1))
        styles.add(ParagraphStyle(name='Title2_TNR', fontName='TimesNewRoman', fontSize=19, leading=20, alignment=1))
        styles.add(ParagraphStyle(name='Normal_TNR', fontName='TimesNewRoman', fontSize=16, leading=18))
        styles.add(ParagraphStyle(name='Normal1_TNR', fontName='TimesNewRoman', fontSize=16, leading=18, alignment=1))
        styles.add(ParagraphStyle(name='bold_TNR', fontName='bold', fontSize=16, leading=18))
        styles.add(ParagraphStyle(name='RightAligned1', fontName='bold', fontSize=18, leading=20, alignment=2))
        styles.add(ParagraphStyle(name='RightAligned', fontName='bold', fontSize=16, leading=18, alignment=2))

        elements = []
        elements.append(Paragraph("PHÒNG KHÁM TƯ NHÂN MỸ VÂN", styles['Title_TNR']))

        elements.append(Spacer(1, 7))
        elements.append(Paragraph("Trường Đại học Mở Thành phố Hồ Chí Minh", styles['Title2_TNR']))

        elements.append(Spacer(1, 4))
        elements.append(Paragraph("Địa chỉ: 97 Võ Văn Tần, P. Võ Thị Sáu, Q. 3, TP Hồ Chí Minh", styles['Normal1_TNR']))

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

            table = Table(data, colWidths=[4 * inch, 1 * inch, 2*inch, 1*inch])
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
