from clinicapi.models import *
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from django.db.models import Avg, Count

User = get_user_model()


class NewsSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url
            req['image2'] = instance.image2.url
            req['image3'] = instance.image3.url
        return req

    class Meta:
        model = News
        fields = ['id', 'title', 'created_date', 'image', 'content', 'image2', 'image3', 'content2']


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.avatar:
            req['avatar'] = instance.avatar.url
        return req

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'password', 'date_joined', 'is_active', 'role', 'email']

        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }


class PatientDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'user']
        extra_kwargs = {
            'user': {'required': False}  # Đảm bảo 'user' không phải là trường bắt buộc
        }


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'code', 'birthdate', 'gender', 'address', 'phone', 'user']
        extra_kwargs = {
            'user': {'required': False}  # Đảm bảo 'user' không phải là trường bắt buộc
        }


class DoctorNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'expertise']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class PatientNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'full_name', 'code', 'email']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorNameSerializer()
    patient = PatientNameSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'appointment_date', 'appointment_time', 'created_date', 'status', 'patient', 'doctor']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'appointment_date', 'created_date', 'status', 'patient', 'doctor']
        extra_kwargs = {
            'patient': {'required': False}
        }


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['id', 'first_name', 'last_name', 'birthdate', 'expertise', 'qualifications',
                  'experience_years', 'position', 'description', 'user']
        extra_kwargs = {
            'user': {'required': False}  # Đảm bảo 'user' không phải là trường bắt buộc
        }


class NurseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nurse
        fields = ['id', 'first_name', 'last_name', 'birthdate', 'position', 'user', 'doctor']
        extra_kwargs = {
            'user': {'required': False}  # Đảm bảo 'user' không phải là trường bắt buộc
        }

        def validate(self, data):
            if data['position'] == Nurse.Position.DOCTOR_ASSISTANT and not data.get('doctor'):
                raise serializers.ValidationError("Doctor must be provided if the position is 'doctor_assistant'.")
            return data


class AppointmentInfoSerializer(serializers.ModelSerializer):
    patient = PatientNameSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'appointment_date', 'appointment_time', 'status', 'patient']


class PrescriptionSerializer(serializers.ModelSerializer):
    doctor = DoctorNameSerializer()
    appointment = AppointmentInfoSerializer()

    class Meta:
        model = Prescription
        fields = ['id', 'created_date', 'symptom', 'diagnosis', 'appointment', 'doctor']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'created_date', 'symptom', 'diagnosis', 'appointment', 'doctor']


class MedicineSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url
        return req

    class Meta:
        model = Medicine
        fields = '__all__'


class PreMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ['id', 'dosage', 'prescription', 'medicine', 'count', 'price']


class PresciptMedicineSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer()

    # prescription = PrescriptionSerializer()
    class Meta:
        model = PrescriptionMedicine
        fields = ['id', 'dosage', 'prescription', 'medicine', 'count', 'price']


class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = ['id', 'appointment_date', 'symptom', 'patient', 'diagnosis', 'doctor', 'allergy_medicines']


class HealthRecordViewSerializer(serializers.ModelSerializer):
    doctor = DoctorNameSerializer()
    patient = PatientNameSerializer()

    class Meta:
        model = HealthRecord
        fields = ['id', 'appointment_date', 'symptom', 'patient', 'diagnosis', 'doctor', 'allergy_medicines']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'created_date', 'content', 'type', 'is_read', 'user']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'created_date', 'content', 'star', 'patient', 'doctor']


class RatingDetailSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = Rating
        fields = ['id', 'created_date', 'content', 'star', 'patient', 'doctor']


class RatingDetailAllSerializer(serializers.ModelSerializer):
    patient = PatientDetailSerializer()

    class Meta:
        model = Rating
        fields = ['id', 'created_date', 'content', 'star', 'patient', 'doctor']


class HealthMonitoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthMonitoring
        fields = ['patient', 'height', 'weight', 'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
                  'measurement_time', 'doctor']
        read_only_fields = ['doctor']


class HealthMonitoringDetailSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(many=True)

    class Meta:
        model = HealthMonitoring
        fields = ['id', 'patient', 'height', 'weight', 'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
                  'measurement_time', 'doctor']


class ForumAnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ForumAnswers
        fields = ['id', 'title', 'content', 'forum_question', 'created_date', 'updated_date', 'user']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumAnswers
        fields = ['id', 'title', 'content', 'forum_question', 'created_date', 'updated_date', 'user']
        extra_kwargs = {
            'user': {'required': False}  # Đảm bảo 'user' không phải là trường bắt buộc
        }


class ForumQuestionSerializer(serializers.ModelSerializer):
    patient = PatientNameSerializer()

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url
        return req

    class Meta:
        model = ForumQuestion
        fields = ['id', 'title', 'content', 'image', 'created_date', 'updated_date', 'patient']
        extra_kwargs = {
            'patient': {'required': False}  # Đảm bảo 'patient' không phải là trường bắt buộc
        }


class ForumQuestionCreateSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url
        return req

    class Meta:
        model = ForumQuestion
        fields = ['id', 'title', 'content', 'image', 'created_date', 'updated_date', 'patient']
        extra_kwargs = {
            'patient': {'required': False}  # Đảm bảo 'patient' không phải là trường bắt buộc
        }


class InvoiceSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.payment_proof:
            req['payment_proof'] = instance.payment_proof.url
        return req

    class Meta:
        model = Invoice
        fields = '__all__'


class InvoiceDetailSerializer(InvoiceSerializer):
    prescription = PrescriptionSerializer()

    class Meta:
        model = InvoiceSerializer.Meta.model
        fields = InvoiceSerializer.Meta.fields


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class DoctorRatingSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ['id', 'first_name', 'last_name', 'birthdate', 'expertise', 'qualifications',
                  'experience_years', 'position', 'description', 'user', 'average_rating',
                  'total_ratings']

    def get_average_rating(self, obj):
        avg_rating = Rating.objects.filter(doctor=obj).aggregate(average=Avg('star'))['average']
        return round(avg_rating, 2) if avg_rating else 0

    def get_total_ratings(self, obj):
        return Rating.objects.filter(doctor=obj).count()


class CartItemSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'medicine', 'quantity', 'get_total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']