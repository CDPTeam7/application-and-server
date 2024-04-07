# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from database import db
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
from model.model import CNN

# 전처리
Ai_service = Namespace(
    name="Model",
    description="model 관련 API - 우선은 mnist파일로 확인",
)


pet_model = CNN()
pet_model.load_state_dict(torch.load("./server/model/mnist_model.pt"), strict=False)
pet_model.eval()
normalize = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
)


pet_inference_fields = Ai_service.model(
    "Pet_Inference_request",
    {  # Model 객체 생성
        "images": fields.String(
            description="an Images", required=True, example="np.array(image).tolist()"
        )
    },
)
pet_inference_response1 = Ai_service.model(
    "Pet_Inference_success",
    {
        "result": fields.String(example="success"),
        "data": fields.String(example="pet_bottle"),
    },
)
pet_inference_response2 = Ai_service.model(
    "Pet_Inference_fail",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="평가할 수 없습니다."),
    },
)


# pet bottle inference API
@Ai_service.route("/petInference")
class pet_inference(Resource):
    @Ai_service.expect(pet_inference_fields)
    @Ai_service.response(202, "success", pet_inference_response1)
    @Ai_service.response(401, "fail", pet_inference_response2)
    def post(self):
        """입력 이미지에 대해 평가합니다. - 보강 필요"""
        data = request.get_json()
        _, result = pet_model.forward(
            normalize(np.array(data["images"], dtype=np.uint8)).unsqueeze(0)
        ).max(1)
        return make_response(
            jsonify({"result": "success", "data": str(result.item())}), 202
        )


pet_multi_inference_fields = Ai_service.inherit(
    "Pet_Multi_Inference_request",
    pet_inference_fields,
    {},
)
pet_multi_inference_response1 = Ai_service.inherit(
    "Pet_Multi_Inference_success",
    pet_inference_response1,
    {
        "data": fields.String(example="3"),
    },
)
pet_multi_inference_response2 = Ai_service.inherit(
    "Pet_Multi_Inference_fail",
    pet_inference_response2,
    {
        "msg": fields.String(example="평가할 수 없습니다."),
    },
)


# pet bottle inference API
@Ai_service.route("/petMultiInference")
class pet_multi_inference(Resource):
    @Ai_service.expect(pet_multi_inference_fields)
    @Ai_service.response(202, "success", pet_multi_inference_response1)
    @Ai_service.response(401, "fail", pet_multi_inference_response2)
    def post(self):
        """입력 이미지에 대해 페트병이 얼마나 있는지를 평가합니다. - 미구현"""
        data = request.get_json()
        _, result = pet_model.forward(
            normalize(np.array(data["images"], dtype=np.uint8)).unsqueeze(0)
        ).max(1)
        return make_response(
            jsonify({"result": "success", "data": str(result.item())}), 202
        )
