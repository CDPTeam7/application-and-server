# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask import send_file
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from tokens import *
from database import db
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
from model.model import CNN
import cv2
from werkzeug.utils import secure_filename
from detection import *
from ultralytics import YOLO
import math
from detection import *

# 전처리
Ai_service = Namespace(
    name="Model",
    description="model 관련 API",
)


"""pet_model = CNN()
pet_model.load_state_dict(torch.load("./server/model/mnist_model.pt"), strict=False)
pet_model.eval()
# model.train(data='data.yaml', epochs=70, batch=-1, plots=True,imgsz=640, patience=10, save_period=5, mixup=0.25, label_smoothing=0.1, project='final', name='final')
# metrics = model.eval()  # evaluate model performance on the validation set
# path = model.export()  # export the model to PT format
normalize = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
)"""


pet_recognition_fields = Ai_service.model(
    "Pet_recognition_request",
    {  # Model 객체 생성
        "images": fields.String(
            description="an Images", required=True, example="np.array(image).tolist()"
        )
    },
)
pet_recognition_response1 = Ai_service.model(
    "Pet_recognition_success",
    {
        "result": fields.String(example="success"),
        "data": fields.String(example="pet_bottle"),
    },
)
pet_recognition_response2 = Ai_service.model(
    "Pet_recognition_fail",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="평가할 수 없습니다."),
    },
)


# pet bottle inference API
@Ai_service.route("/pet-recognition")
class pet_recognition(Resource):
    @Ai_service.expect(pet_recognition_fields)
    @Ai_service.response(200, "success", pet_recognition_response1)
    @Ai_service.response(400, "fail", pet_recognition_response2)
    def post(self):
        """입력된 페트병 이미지에 대해 개수를 구해줍니다."""
        frame = request.files["image"]
        result = image_detection(frame)
        return make_response(
            jsonify({"result": "SUCCESS_PET_RECOGNITION", "data": {"count": result}}),
            202,
        )


@Ai_service.route("/face-recognition")
class face_recognition(Resource):
    def post(self):
        """입력된 얼굴 이미지에 대해 인증을 확인하여 로그인 여부를 구해줍니다."""
        frame = request.files["image"]
        frame.save("./static/face-recog/" + secure_filename(str(frame.filename)))
        f = cv2.imread(("./static/face-recog/" + secure_filename(str(frame.filename))))

        try:
            target_embedding = get_target_embedding(f)
            results = search_similar_images(target_embedding)
            res = {}
            for result in results:
                final_result = verify(target_embedding, result["image"])
                # print(result["img_path"])
                res = result
                break
            if final_result:
                print("Face verification succeeded.")
                response = {
                    "result": "SUCCESS_LOGIN",
                    "msg": "얼굴 인식 성공 및 로그인 성공하였습니다.",
                    "data": {"user_id": res["user_id"]},
                }
                return make_response(jsonify(response), 200)
            else:
                print("Face verification failed.")
                response = {
                    "result": "ERROR_FAIL_LOGIN",
                    "msg": "얼굴 인식 성공 및 로그인 실패하였습니다.",
                }
                return make_response(jsonify(response), 202)
        except Exception as e:
            print(e)
            print("No face detected in the target imaget or Error occured.")
            response = {
                "result": "ERROR_FAIL_FACE_RECOGNITION",
                "msg": "얼굴 인식 실패하였습니다.",
            }
            return make_response(jsonify(response), 400)
