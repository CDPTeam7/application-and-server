# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask import send_file
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from tokens import *
from database import db
import cv2
from werkzeug.utils import secure_filename
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
        "image": fields.String(description="an Images", required=True, example="pet image")
    },
)
pet_recognition_response1_data = Ai_service.model(
    "Pet_recognition_data", {"count": fields.Integer(example=2)}
)
pet_recognition_response1 = Ai_service.model(
    "Pet_recognition_success",
    {
        "result": fields.String(example="SUCCESS_PET_RECOGNITION"),
        "msg": fields.String(example="페트병 인식에 성공하였습니다."),
        "data": fields.Nested(pet_recognition_response1_data, example={"count": 2}),
    },
)
pet_recognition_response2 = Ai_service.model(
    "Pet_recognition_fail",
    {
        "result": fields.String(example="ERROR_FAIL_PET_RECOGNITION"),
        "msg": fields.String(example="페트병 인식에 실패하였습니다."),
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
        try:
            result = image_detection(frame)
            return make_response(
                jsonify(
                    {
                        "result": "SUCCESS_PET_RECOGNITION",
                        "msg": "페트병 인식에 성공하였습니다.",
                        "data": {"count": result},
                    }
                ),
                200,
            )
        except Exception as e:
            print(e)
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_FAIL_PET_RECOGNITION",
                        "msg": "페트병 인식에 실패하였습니다.",
                    }
                ),
                400,
            )


face_recognition_fields = Ai_service.model(
    "Face_recognition_request",
    {  # Model 객체 생성
        "image": fields.String(description="an Images", required=True, example="face image")
    },
)
face_recognition_response1_data = Ai_service.model(
    "Face_recognition_data", {"user_id": fields.String(example="ID")}
)
face_recognition_response1 = Ai_service.model(
    "Face_recognition_success1",
    {
        "result": fields.String(example="SUCCESS_LOGIN"),
        "msg": fields.String(example="얼굴 인식 성공 및 로그인 성공하였습니다."),
        "data": fields.Nested(
            pet_recognition_response1_data, example={"user_id": "ID"}
        ),
    },
)
face_recognition_response2 = Ai_service.model(
    "Face_recognition_success2",
    {
        "result": fields.String(example="ERROR_FAIL_LOGIN"),
        "msg": fields.String(example="얼굴 인식 성공 및 로그인 실패하였습니다."),
    },
)
face_recognition_response3 = Ai_service.model(
    "Face_recognition_fail",
    {
        "result": fields.String(example="ERROR_FAIL_FACE_RECOGNITION"),
        "msg": fields.String(example="얼굴 인식에 실패하였습니다."),
    },
)


@Ai_service.route("/face-recognition")
class face_recognition(Resource):
    @Ai_service.expect(face_recognition_fields)
    @Ai_service.response(200, "success", face_recognition_response1)
    @Ai_service.response(202, "success", face_recognition_response2)
    @Ai_service.response(400, "fail", face_recognition_response3)
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
                if final_result:
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
