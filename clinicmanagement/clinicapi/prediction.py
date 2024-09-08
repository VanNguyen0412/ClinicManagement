import numpy as np
from sklearn.linear_model import LogisticRegression


class HypertensionPredictor:
    def __init__(self):
        self.model = LogisticRegression()
        # Giả sử rằng chúng ta có dữ liệu mẫu với chỉ số huyết áp trong ba ngày (6 giá trị)
        self.model.fit(np.array([
            [120, 80, 121, 81, 122, 82],
            [130, 85, 131, 86, 132, 87],
            [140, 90, 141, 91, 142, 92]
        ]), [0, 0, 1])  # 0 là không nguy cơ, 1 là có nguy cơ

    def predict(self, data):
        data = np.array(data).reshape(1, -1)  # Chuyển đổi thành mảng numpy 2D
        return self.model.predict(data)[0]