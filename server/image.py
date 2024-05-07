# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask import send_file
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from tokens import *
from database import db
import os
from dotenv import load_dotenv
from PIL import Image
import cv2
from werkzeug.utils import secure_filename
from detection import *

# 전처리
Image = Namespace(
    name="Image",
    description="Image 처리 관련 API",
)
# load .env
load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")
JWT_ALGORITHMS = os.environ.get("JWT_ALGORITHMS")

"""
SECRET_KEY = "b_4(!id8ro!1645n@ub55555hbu93gaia0"  # 테스트용 secret key
JWT_ALGORITHM = "HS256"  # 암호화할 때 쓸 알고리즘
"""


"""get_image_fields = Image.model(
    "Get_image_request",
    {  # Model 객체 생성
        "user_id": fields.String(description="an ID", required=True, example="ID"),
        "user_pw": fields.String(
            description="a password", required=True, example="Password"
        ),
        "nickname": fields.String(
            description="a nickname", required=True, example="nick"
        ),
    },
)"""
get_image_response1 = Image.model(
    "Get_image_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="이미지 정보 확인에 성공하였습니다."),
        "data": fields.List(fields.String(), default=[]),
    },
)
get_image_response2 = Image.model(
    "Get_image_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="이미지 정보 확인에 실패하였습니다."),
    },
)
get_image_response3 = Image.model(
    "Get_image_fail2",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# 회원가입
@Image.route("/check-image", methods=["GET"])
class api_get_image(Resource):
    @Image.response(202, "success", get_image_response1)
    @Image.response(401, "fail", get_image_response2)
    @Image.response(402, "fail", get_image_response3)
    # @token_required
    def get(self):
        """이미지 정보를 확인합니다"""
        payload = get_payload_from_header()
        if payload is None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            result = db.image.find_one(
                {"user_id": payload["id"]}, {"_id": 0, "path": 1}
            )
            response_data = {
                "result": "success",
                "msg": "이미지 정보 확인에 성공하였습니다.",
                "data": result,
            }
            # print(type(result["path"]))
            # print(os.getcwd())

            return send_file("." + result["path"])
            # return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "이미지 정보 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


set_image_fields = Image.model(
    "Set_image_request",
    {  # Model 객체 생성
        "image": fields.List(
            fields.String(), default=[], reqired=True, description="an image"
        ),
    },
)
set_image_response1 = Image.model(
    "Set_image_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="이미지 정보 저장에 성공하였습니다."),
    },
)
set_image_response2 = Image.inherit(
    "Set_image_fail1",
    get_image_response2,
    {"msg": fields.String(example="이미지 정보 저장에 실패하였습니다.")},
)
set_image_response3 = Image.inherit(
    "Set_image_fail2",
    get_image_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# 로그인
@Image.route("/set-image", methods=["POST"])
class api_set_image(Resource):
    @Image.expect(set_image_fields)
    @Image.response(202, "success", set_image_response1)
    @Image.response(401, "fail", set_image_response2)
    @Image.response(402, "fail", set_image_response3)
    def post(self):
        """이미지 정보를 저장합니다"""
        # payload = get_payload_from_header()
        """req = request.get_data()
        print(1)
        # print(req)
        print(request.files["file"])
        image_receive = request.files["file"]
        image_receive = base64.b64decode(image_receive)
        print(1)
        with open("encode.bin", "wb") as file:
            file.write(image_receive)
        file = open("encode.bin", "rb")
        byte = file.read()
        print(1)
        decodeit = open("hello_level.jpeg", "wb")
        decodeit.write(base64.b64decode(byte))
        decodeit.close()
        embedding = get_target_embedding(cv2.imread("./hello_level.jpeg"))
        print(image_receive)"""
        f = request.files["image"]
        # print(os.getcwd())
        f.save("./static/" + secure_filename(str(f.filename)))
        embedding = get_target_embedding(
            cv2.imread(("./static/" + secure_filename(str(f.filename))))
        )
        # print(type(embedding))
        """if payload is None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )"""
        try:
            id_receive = "1231"  # payload["id"]
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.image.update_one(
                {"user_id": id_receive},
                {
                    "$set": {
                        "image": embedding,
                        "path": ("./static/" + secure_filename(str(f.filename))),
                    }
                },
            )
            # print(result.matched_count)
            if result.matched_count > 0:
                # 데이터를 처리하고 응답 생성
                response_data = {
                    "result": "success",
                    "msg": "이미지 정보 저장에 성공하였습니다.",
                }
                return make_response(jsonify(response_data), 202)
            response_data = {
                "result": "fail",
                "msg": "이미지 정보 저장에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)
        except Exception as e:
            print(e)
            response_data = {
                "result": "fail",
                "msg": "이미지 정보 저장에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)
