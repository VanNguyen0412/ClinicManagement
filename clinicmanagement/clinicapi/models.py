from django.db import models
import random

from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
class BaseModel(models.Model):
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class User(AbstractUser):
    avatar = CloudinaryField()
    first_name = None
    last_name = None

    class Role(models.TextChoices):
        ADMIN = 'admin'
        PATIENT = 'patient'
        DOCTOR = 'doctor'
        NURSE = 'nurse'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PATIENT)

    def __str__(self):
        return self.username

    # Xác định xem người dùng có phải là quản trị viên hay không
    def is_admin(self):
        return self.role == 'admin'

    # Xác định xem người dùng có phải là bệnh nhân hay không
    def is_patient(self):
        return self.role == 'patient'

    # Xác định xem người dùng có phải là bác sĩ hay không
    def is_doctor(self):
        return self.role == 'doctor'

    # Xác định xem người dùng có phải là y tá hay không
    def is_nurse(self):
        return self.role == 'nurse'


class People(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birthdate = models.DateField()
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        abstract = True


class Doctor(People):
    expertise = models.CharField(max_length=255)  # chuyên môn
    qualifications = models.CharField(max_length=255)  # bằng cấp
    experience_years = models.IntegerField()  # năm kinh nghiệm
    position = models.CharField(max_length=255)  # chức vụ
    description = RichTextField()


class Nurse(People):
    class Position(models.TextChoices):
        PAYMENT_NURSE = 'payment_nurse'
        DOCTOR_ASSISTANT = 'doctor_assistant'
        CARE_NURSE = 'care_nurse'

    position = models.CharField(max_length=255, choices=Position.choices, default=Position.DOCTOR_ASSISTANT)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, blank=True, null=True)


class Patient(People):
    gender = models.BooleanField(default=True)  # true là Nam, false là nữ
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=10, unique=True)
    code = models.CharField(max_length=10, null=True, blank=True, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.pk:  # Chỉ tạo code khi chưa có khóa chính (mới tạo)
            self.code = self.generate_random_code()
        super().save(*args, **kwargs)

    def generate_random_code(self):
        digits = '123456789'  # Chỉ chứa các chữ số từ 1 đến 9
        code = ''.join(random.choice(digits) for _ in range(10))
        return code

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Appointment(BaseModel):
    appointment_date = models.DateField()
    appointment_time = models.TimeField(auto_now_add=True)

    class Status(models.TextChoices):
        PENDING = 'pending'
        CONFIRM = 'confirm'
        CANCELING = 'canceling'

    status = models.CharField(max_length=255, choices=Status.choices, default=Status.PENDING)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.patient} {self.appointment_date} {self.status}"


class Prescription(BaseModel):  # phiếu khám
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    symptom = models.CharField(max_length=255)  # triệu chứng
    diagnosis = models.CharField(max_length=255)  # chẩn đoán

    def __str__(self):
        return f"{self.appointment.patient} {self.appointment.appointment_date}"


class HealthRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    symptom = models.TextField()
    diagnosis = models.TextField()
    allergy_medicines = models.TextField() # thuốc bị dị ứng
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.patient} {self.appointment_date}"


class HealthMonitoring(models.Model):  # theo dõi sức khỏe
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    height = models.FloatField()
    weight = models.FloatField()
    heart_rate = models.IntegerField()
    blood_pressure_systolic = models.IntegerField()  # huyết áp tâm thu
    blood_pressure_diastolic = models.IntegerField()  # huyết áp tâm trương
    measurement_time = models.DateTimeField(auto_now=True)  # ngày đo
    doctor = models.ManyToManyField(Doctor, blank=True)


class Medicine(models.Model):
    image = CloudinaryField(null=True)
    exp_date = models.DateField()
    mfg_date = models.DateField()
    name = models.CharField(max_length=255)
    price = models.FloatField(null=True)
    type = models.TextField()
    unit = models.CharField(max_length=255, default='Viên')

    def __str__(self):
        return self.name


class PrescriptionMedicine(BaseModel):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=255)  # liều dùng
    count = models.IntegerField(default=10)
    price = models.FloatField(default=15000)
    

class Rating(BaseModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    content = RichTextField()
    star = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def __str__(self):
        return f'{self.patient} rating for {self.doctor} - {self.star} stars'


class ForumQuestion(BaseModel):
    title = models.TextField()
    content = RichTextField()
    image = CloudinaryField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)


class ForumAnswers(BaseModel):
    title = models.TextField()
    content = RichTextField()
    forum_question = models.ForeignKey(ForumQuestion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Notification(BaseModel):
    content = RichTextField()

    class Type(models.TextChoices):
        APPOINTMENT = 'appointment'
        MEDICINE = 'medicine'
        GENERAL = 'general'

    type = models.CharField(max_length=255, choices=Type.choices, default=Type.APPOINTMENT)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)


class News(BaseModel):
    title = models.TextField()
    content = RichTextField()
    image = CloudinaryField()

    def __str__(self):
        return self.title


class Payment(BaseModel):
    amount = models.FloatField()

    class Method(models.TextChoices):
        MONO = 'mono'
        ZALOPAY = 'zalopay'
        OFFLINE = 'offline'

    class Status(models.TextChoices):
        PENDING = 'pending'
        COMPLETED = 'completed'
        FAILED = 'failed'

    method = models.CharField(max_length=255, choices=Method.choices, default=Method.OFFLINE)
    status = models.CharField(max_length=255, choices=Status.choices, default=Status.PENDING)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)


class Report(models.Model):
    type_data = models.TextField()

    class Type(models.TextChoices):
        MONTHLY = 'monthly'
        YEAR = 'yearly'

    type = models.CharField(max_length=255, choices=Type.choices, default=Type.MONTHLY)


class OTPVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)