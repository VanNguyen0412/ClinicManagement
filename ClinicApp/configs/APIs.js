import axios from "axios";

// const BASE_URL = 'http://192.168.234.42:8000/';
const BASE_URL = 'http://192.168.1.252:8000/';

export const endpoints = {
    'login': '/o/token/',
    'current-user': '/user/current-user/',
    'create-patient': '/patient/create/',
    'create-user': '/user/patient/',
    'confirm-user': '/user/verify-otp/',
    'current-patient': '/patient/current/',
    'new': '/new/',
    'new-detail': (newId) => `/new/${newId}`,
    'medicine': '/medicine/functional/',
    'medicine-all': '/medicine/',
    'doctor': '/doctorRating/',
    'doctorDetail': (doctorId) => `/doctorRating/${doctorId}/`,
    'medicineDetail': (medicineId) => `/medicine/${medicineId}/`,
    'doctorRating': (doctorId) => `/doctor/${doctorId}/rating/`,
    'rating-all': (doctorId) => `/doctor/${doctorId}/ratingall/`,
    'create-rating': (doctorId) => `/doctor/${doctorId}/create_rating/`,
    'delete-rating': (ratingId) => `/rating/${ratingId}/delete_rating/`,
    'update-rating': (ratingId) => `/rating/${ratingId}/update_rating/`,
    'doctor-name': '/doctor/name/',
    'create-appointment': '/appointment/create/',
    'appointment-pending': '/appointment/listpending/',
    'appointment-confirm': '/appointment/listconfirm/',
    'appointment-patient': '/appointment/patient/',
    'comfirm-appointment': (appointmentId) => `/appointment/${appointmentId}/confirm/`,
    'cancel-appointment': (appointmentId) => `appointment/${appointmentId}/cancel/`,
    'appointment-detail': (appointmentId) => `/appointment/${appointmentId}/`,
    'patient-record': (patientId) => `/patient/${patientId}/healthrecord/`,
    'list-noti': '/notification/list/',
    'delete-noti': (notificationId) => `/notification/${notificationId}/`,
    'read-noti': (notificationId) => `/notification/${notificationId}/read/`,
    'notification-information': (notificationId) => `notification/${notificationId}/information/`,
    'doctor-info': '/doctor/current/',
    'nurse-info': '/nurse/current/',
    'health_monitoring': (patientId) => `/patient/${patientId}/health_monitoring/`,
    'download-pdf': (notificationId) => `/notification/${notificationId}/medicines_pdf/`,
    'appointment-result': (appointmentId) => `/appointment/${appointmentId}/result/`,
    'prescription': (appointmentId) => `/prescription/no_medicine/?appointment=${appointmentId}`,
    'prescription-detail': (prescriptionId) => `/prescription/${prescriptionId}`,
    'add-medicines': (prescriptionId) => `prescription/${prescriptionId}/create_medicine/`,
    'delete-medicine': (prescriptionId, medicineId) => `prescription/${prescriptionId}/medicine/?medicine=${medicineId}`,
    'done-prescription':(prescriptionId) => `prescription/${prescriptionId}/medicines/`,
    'result': 'prescription/result/',
    'create_health_monitoring': (patientId) => `/patient/${patientId}/create_health_monitoring/`,
    'update-doctor-HM': (patientId) => `/patient/${patientId}/update_doctor/`,
    'update-HM': (patientId) => `/patient/${patientId}/update_health_monitoring/`,
    'predict': '/predict/',
    'forum': '/forum/',
    'create-forum': '/forum/create_forum/',
    'forum-detail': (forumId) => `/forum/${forumId}`,
    'forum-delete': (forumId) => `/forum/${forumId}/delete_forum/`,
    'forum-update': (forumId) => `/forum/${forumId}/update_forum/`,
    'answer-forum': (forumId) => `/forum/${forumId}/create_answer/`,
    'list-answer-forum': (forumId) => `/forum/${forumId}/list_answer/`,
    'update-answer': (forumId, answerId) => `/forum/${forumId}/answer/${answerId}/update/`,
    'invoice': (patientId) => `/patient/${patientId}/invoice_done/`,
    'invoice-none': (patientId) => `/patient/${patientId}/invoice/`,
    'require-invoice': (prescriptionId) => `/prescription/${prescriptionId}/require/`,
    'delete-answer': (forumId, answerId) => `/forum/${forumId}/answer/${answerId}/`,
    'pres-info': (notificationId) => `/notification/${notificationId}/get_prescription/`,
    'cacul-invoice': (prescriptionId) => `/prescription/${prescriptionId}/invoice/`,
    'invoice-detail': (invoiceId) => `/invoice/${invoiceId}`,
    
}

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
export default axios.create({
    baseURL: BASE_URL
});


//   thanh toán momo, firebase, minh chứng thanh toán