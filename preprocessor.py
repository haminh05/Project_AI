# import re
# from pyvi import ViTokenizer
# from rasa.engine.graph import GraphComponent
# from rasa.shared.nlu.training_data.message import Message
# from rasa.shared.nlu.training_data.training_data import TrainingData
# from typing import Any, Dict, Optional
# from rasa.engine.recipes.default_v1 import DefaultV1Recipe

# # Danh sách stopwords (có thể tùy chỉnh theo nhu cầu)
# stopwords = set(["ạ", "ưm", "ờ", "hừm", "la", "này"])

# def preprocess_text(text: str) -> str:
#     """
#     Hàm tiền xử lý văn bản: chuẩn hóa, tokenization, loại bỏ stopwords.
#     """
#     # Chuyển văn bản về chữ thường
#     text = text.lower()

#     # Loại bỏ ký tự đặc biệt và dấu câu
#     text = re.sub(r'[^\w\s]', '', text)

#     # Tokenization
#     tokens = ViTokenizer.tokenize(text).split()

#     # Loại bỏ stopwords
#     tokens = [token for token in tokens if token not in stopwords]

#     # Kết hợp lại thành chuỗi
#     return ' '.join(tokens)

# @DefaultV1Recipe.register
# class VietnamesePreprocessor(GraphComponent):
#     """
#     Component tùy chỉnh cho tiền xử lý văn bản tiếng Việt.
#     """

#     @classmethod
#     def create(
#         cls, config: Dict[str, Any], name: Optional[str] = None
#     ) -> "VietnamesePreprocessor":
#         return cls(config)

#     def process(self, message: Message, **kwargs: Any) -> None:
#         """
#         Phương thức xử lý từng tin nhắn, áp dụng tiền xử lý văn bản.
#         """
#         text = message.get("text")
#         if text:
#             processed_text = preprocess_text(text)
#             message.set("text", processed_text)

#     def process_training_data(self, training_data: TrainingData) -> TrainingData:
#         """
#         Tiền xử lý toàn bộ dữ liệu huấn luyện.
#         """
#         for message in training_data.training_examples:
#             text = message.get("text")
#             if text:
#                 processed_text = preprocess_text(text)
#                 message.set("text", processed_text)
#         return training_data

# if __name__ == "__main__":
#     # Kiểm tra hàm tiền xử lý
#     sample_text = "Xin chào, tôi là Chatbot! Bạn ổn chứ?"
#     processed = preprocess_text(sample_text)
#     print("Processed Text:", processed)
