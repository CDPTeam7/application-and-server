# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify  # flask 관련 라이브러리
from flask_restx import Resource, Namespace  # Api 구현을 위한 Api 객체 import
from database import db
from tokens import *


# 전처리
Point = Namespace(
    name="Point",
    description="point 관련 API",
)


# point check API call route
@Point.route("/check", methods=["POST"])
class check_point(Resource):
    def post(self):
        """현재 포인트가 어떤지를 가져옵니다"""
        data1 = request.get_json()  # api를 요청한 서버에서 보낸 json파일 저장
        data2 = db.people.find_one(
            {"name": data1["name"]}
        )  # select 쿼리 실행: request의 name과 동일한 document 찾기
        if data2 != None:
            data2["_id"] = str(
                data2["_id"]
            )  # 찾은 값이 있을 때만 id를 Objectid에서 str로 변경
        # 데이터를 처리하고 응답 생성
        response_data = {
            "message": "Data received successfully",
            "received_data": data1,
            "result_one": data2,
        }  # 전달할 데이터 묶기
        return jsonify(response_data)  # json형태로 전달


# point add API call route
@Point.route("/add", methods=["POST"])
class add_point(Resource):
    def post(self):
        """포인트를 추가합니다"""
        data1 = request.get_json()
        data3 = db.people.update_one(
            {"name": data1["name"]}, {"$inc": {"score": data1["score"]}}
        )  # update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc)
        data2 = db.people.find_one({"name": data1["name"]})
        if data2 != None:
            data2["_id"] = str(data2["_id"])
        # 데이터를 처리하고 응답 생성
        response_data = {
            "message": "Data received successfully",
            "received_data": data1,
            "result_one": data2,
        }
        return jsonify(response_data)
