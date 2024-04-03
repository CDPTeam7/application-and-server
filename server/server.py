# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import Flask, request, jsonify  # flask 관련 라이브러리
from flask_restx import Api, Resource  # Api 구현을 위한 Api 객체 import
import pymongo  # mongoDB와의 연결을 위한 모듈
from database import db
from tokens import *
from auth import Auth
from point import Point
from ranking import Ranking


# 전처리
app = Flask(__name__)  # flask 객체를 생성. __name__은 현재 실행 중인 모듈 이름
api = Api(
    app,
    version="0.1",
    title="CDPTeam7's API Server",
    description="CDPTeam7's flask API Server",
    terms_url="/",
    contact="holmane333@naver.com",
    license="MIT",
)
# Flask 객체에 Api 객체 등록
# mongoDB와 연결 (http://localhost:27017)
client = pymongo.MongoClient(host="localhost", port=27017)
db = client.mongodb_tutorial  # mongoDB 내에서 사용할 DB와 연결
# CORS(app, supports_credentials=True, resources={r'*': {'origins': 'http://localhost:3000'}})  # CORS 미들웨어 추가
SECRET_KEY = "b_4(!id8ro!1645n@ub55555hbu93gaia0"  # 테스트용 secret key
JWT_ALGORITHM = "HS256"  # 암호화할 때 쓸 알고리즘

# namespace 추가
api.add_namespace(Auth, "/api/auth")
api.add_namespace(Point, "/api/point")
api.add_namespace(Ranking, "/api/ranking")


# API 테스트용
@api.route("/test")  # 기본서버 127.0.0.1:8080 뒤에 붙는 주소
class flask_test(Resource):
    def get(self):  # 위의 주소를 호출 시 보여 줄 것을 함수로 작성
        return "EC2 Flask Test"  # 예제 코드


# API 테스트용2
@api.route("/hello")
class hello_world(Resource):
    def get(self):
        return {"result": "Hello World"}


# POST API 테스트용
@api.route("/api/data", methods=["POST"])
class receive_data(Resource):
    def post(self):
        data = request.get_json()
        # 데이터를 처리하고 응답 생성
        response_data = {"message": "Data received successfully", "received_data": data}
        return jsonify(response_data)


if __name__ == "__main__":  # 이 파일이 직접 실행되야만 해당 코드 실행
    app.run("0.0.0.0", port=8080, debug=True)
