# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import Flask, redirect, request, jsonify  # flask 관련 라이브러리
from flask_restx import (
    Api,
    Resource,
    Namespace,
    fields,
)  # Api 구현을 위한 Api 객체 import
from database import db
from tokens import *
from auth import Auth
from point import Point
from ranking import Ranking
from image import Image
from ai_service import Ai_service
import os
import ssl


load_dotenv()
SSL_PASSWORD = os.environ.get("SSL_PASSWORD")


os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import tensorflow as tf

# 전처리
app = Flask(__name__)  # flask 객체를 생성. __name__은 현재 실행 중인 모듈 이름
# Flask 객체에 Api 객체 등록
api = Api(
    app,
    version="0.1",
    title="CDPTeam7's API Server",
    description="CDPTeam7's flask API Server",
    doc="/documents/",
    terms_url="/documents/",
    contact="holmane333@naver.com",
    license="MIT",
)
# CORS(app, supports_credentials=True, resources={r'*': {'origins': 'http://localhost:3000'}})  # CORS 미들웨어 추가


# 테스트 API 용 namespace
TestAPI = Namespace(
    name="TestAPI",
    description="기본적인 테스트를 위한 API",
)


# namespace 추가
api.add_namespace(TestAPI, "/")
api.add_namespace(Auth, "/api/auth")
api.add_namespace(Point, "/api/point")
api.add_namespace(Ranking, "/api/rank")
api.add_namespace(Image, "/api/image")
api.add_namespace(Ai_service, "/api/model")


# API 테스트용
@TestAPI.route("/test")  # 기본서버 127.0.0.1:8080 뒤에 붙는 주소
class flask_test(Resource):
    def get(self):  # 위의 주소를 호출 시 보여 줄 것을 함수로 작성
        return "EC2 Flask Test"  # 예제 코드


# API 테스트용2
@TestAPI.route("/hello")
class hello_world(Resource):
    def get(self):
        return {"result": "Hello World"}


# test field
test_fields = TestAPI.model(
    "Test_request",
    {  # Model 객체 생성
        "data": fields.String(description="test data", required=True, example="Data"),
        "result": fields.String(
            description="test result", required=True, example="success"
        ),
    },
)


# POST API 테스트용
@TestAPI.route("/api/data", methods=["POST"])
class receive_data(Resource):
    @TestAPI.expect(test_fields)
    def post(self):
        data = request.get_json()
        # 데이터를 처리하고 응답 생성
        response_data = {"message": "Data received successfully", "received_data": data}
        return jsonify(response_data)


"""
@app.before_request
def before_request():
    scheme = request.headers.get("X-Forwarded-Proto")
    if scheme and scheme == "http" and request.url.startswith("http://"):
        url = request.url.replace("http://", "https://", 1)
        code = 301
        return redirect(url, code=code)
"""

if __name__ == "__main__":  # 이 파일이 직접 실행되야만 해당 코드 실행
    """ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    ssl_context.load_cert_chain(
        certfile="./cert.pem", keyfile="./key.pem", password=SSL_PASSWORD
    )"""
    # app.run("0.0.0.0", port=8080, debug=True, ssl_context=ssl_context)
    app.run("0.0.0.0", port=8080, debug=True)
