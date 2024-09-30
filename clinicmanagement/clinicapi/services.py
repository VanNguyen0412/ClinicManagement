import hashlib
import hmac
import json
import requests
from django.conf import settings


def generate_signature(data, secret_key):
    raw_data = '&'.join([f'{key}={data[key]}' for key in sorted(data)])
    signature = hmac.new(secret_key.encode('utf-8'), raw_data.encode('utf-8'), hashlib.sha256).hexdigest()
    return signature


def create_momo_payment(invoice):
    data = {
        "partnerCode": settings.MOMO_PARTNER_CODE,
        "accessKey": settings.MOMO_ACCESS_KEY,
        "requestId": str(invoice.id),
        "amount": str(int(invoice.total_price)),
        "orderId": invoice.invoice_number,
        "orderInfo": f"Thanh toán hóa đơn {invoice.invoice_number}",
        "returnUrl": settings.RETURN_URL,
        "notifyUrl": settings.NOTIFY_URL,
        "requestType": "captureMoMoWallet",
        "extraData": "",  # Tùy chọn
    }

    data["signature"] = generate_signature(data, settings.MOMO_SECRET_KEY)

    response = requests.post(settings.MOMO_ENDPOINT, json=data)
    response_data = response.json()

    if response_data.get('errorCode') == 0:
        # URL để người dùng chuyển đến thanh toán
        return response_data['payUrl']
    else:
        raise Exception(f"Lỗi MoMo: {response_data.get('localMessage')}")
