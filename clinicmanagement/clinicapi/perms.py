from rest_framework import permissions
from .models import *


class PatientOwner(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        # Gọi hàm has_permission của lớp cha để kiểm tra người dùng đã đăng nhập chưa
        is_authenticated = super().has_permission(request, view)

        # Kiểm tra xem người dùng có phải là bệnh nhân hay không
        is_patient = hasattr(request.user, 'role') and request.user.role == 'patient'

        return is_authenticated and is_patient


class DoctorOwner(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        # Gọi hàm has_permission của lớp cha để kiểm tra người dùng đã đăng nhập chưa
        is_authenticated = super().has_permission(request, view)

        is_doctor = hasattr(request.user, 'role') and request.user.role == 'doctor'

        return is_authenticated and is_doctor


class DoctorPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        # Chỉ bác sĩ mới có quyền truy cập
        return super().has_permission(request, view) and request.user.role == 'doctor'


class NursePermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        # Gọi hàm has_permission của lớp cha để kiểm tra người dùng đã đăng nhập chưa
        is_authenticated = super().has_permission(request, view)

        is_nurse = hasattr(request.user, 'role') and request.user.role == 'nurse'

        return is_authenticated and is_nurse


class NotificationOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        # Kiểm tra xem thông báo có thuộc về người dùng đã đăng nhập hay không
        return obj.user == request.user


class PaymentNursePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực
        if not request.user.is_authenticated:
            return False

        # Kiểm tra xem người dùng có phải là một y tá không
        try:
            nurse = Nurse.objects.get(user=request.user)
        except Nurse.DoesNotExist:
            return False

        # Kiểm tra xem vị trí của y tá có phải là 'payment_nurse' không
        return nurse.position == Nurse.Position.PAYMENT_NURSE
