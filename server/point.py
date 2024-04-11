# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from pymongo import ReturnDocument
from database import db
from tokens import *

# 전처리
Point = Namespace(
    name="Point",
    description="point 관련 API",
)


point_check_fields = Point.model(
    "Point_check_request",
    {  # Model 객체 생성
        "access_token": fields.String(
            description="an access token", required=True, example="access_token"
        )
    },
)
point_check_response1_data = Point.model(
    "Point_check_response1_data", {"point": fields.Integer(example=30)}
)
point_check_response1 = Point.model(
    "Point_check_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="포인트 확인에 성공하였습니다."),
        "data": fields.Nested(point_check_response1_data),
    },
)
point_check_response2 = Point.model(
    "Point_check_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="포인트 확인에 실패하였습니다."),
    },
)
point_check_response3 = Point.model(
    "Point_check_fail2",
    point_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point check API call route
@Point.route("/check", methods=["POST"])
class check_point(Resource):
    @Point.expect(point_check_fields)
    @Point.response(202, "success", point_check_response1)
    @Point.response(401, "fail", point_check_response2)
    @Point.response(402, "fail", point_check_response3)
    def post(self):
        """현재 포인트를 얼마나 가지고 있는지를 확인합니다 - token 사용"""
        req = request.get_json()
        token_receive = req["access_token"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.find_one({"user_id": id_receive}, {"_id": 0, "point": 1})
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "포인트 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "포인트 확인에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)


point_check_using_id_fields = Point.model(
    "Point_check_using_id_request",
    {  # Model 객체 생성
        "user_id": fields.String(description="an ID", required=True, example="ID"),
    },
)
point_check_using_id_response1_data = Point.model(
    "Point_check_using_id_response1_data", {"point": fields.Integer(example=30)}
)
point_check_using_id_response1 = Point.inherit(
    "Point_check_using_id_success",
    point_check_response1,
    {
        "msg": fields.String(example="포인트 확인에 성공하였습니다."),
    },
)
point_check_using_id_response2 = Point.inherit(
    "Point_check_using_id_fail",
    point_check_response2,
    {
        "msg": fields.String(example="포인트 확인에 실패하였습니다."),
    },
)


# point check API call route
@Point.route("/checkUsingId", methods=["POST"])
class check_point_using_id(Resource):
    @Point.expect(point_check_using_id_fields)
    @Point.response(202, "success", point_check_using_id_response1)
    @Point.response(401, "fail", point_check_using_id_response2)
    def post(self):
        """현재 포인트를 얼마나 가지고 있는지를 확인합니다 - id 사용"""
        req = request.get_json()  # api를 요청한 서버에서 보낸 json파일 저장
        id_receive = req["user_id"]
        try:
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.find_one({"user_id": id_receive}, {"_id": 0, "point": 1})
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "포인트 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "포인트 확인에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)


point_add_fields = Point.model(
    "Point_add_request",
    {  # Model 객체 생성
        "access_token": fields.String(
            description="an access token", required=True, example="access_token"
        ),
        "point": fields.Integer(description="a point", required=True, example=20),
    },
)
point_add_response1_data = Point.model(
    "Point_add_response1_data", {"point": fields.Integer(example=30)}
)
point_add_response1 = Point.inherit(
    "Point_add_success",
    point_check_response1,
    {
        "data": fields.Nested(point_add_response1_data),
    },
)
point_add_response2 = Point.inherit(
    "Point_add_fail1",
    point_check_response2,
    {
        "msg": fields.String(example="포인트 적립에 실패하였습니다."),
    },
)
point_add_response3 = Point.inherit(
    "Point_add_fail2",
    point_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point add API call route
@Point.route("/add", methods=["POST"])
class add_point(Resource):
    @Point.expect(point_add_fields)
    @Point.response(202, "success", point_add_response1)
    @Point.response(401, "fail", point_add_response2)
    @Point.response(402, "fail", point_add_response3)
    def post(self):
        """요청한 포인트만큼 적립합니다 - token 사용"""
        req = request.get_json()
        token_receive = req["access_token"]
        point_receive = req["point"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            result = db.user.find_one_and_update(
                {"user_id": id_receive},
                {"$inc": {"point": point_receive}},
                projection={"_id": 0, "point": 1},
                return_document=ReturnDocument.AFTER,
            )
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "포인트 적립에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "포인트 적립에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)


point_add_using_id_fields = Point.inherit(
    "Point_add_using_id_request",
    point_check_using_id_fields,
    {  # Model 객체 생성
        "point": fields.Integer(description="a point", required=True, example=20),
    },
)
point_add_using_id_response1_data = Point.model(
    "Point_add_using_id_response1_data", {"point": fields.Integer(example=30)}
)
point_add_using_id_response1 = Point.inherit(
    "Point_add_using_id_success",
    point_check_using_id_response1,
    {
        "data": fields.Nested(point_add_response1_data),
    },
)
point_add_using_id_response2 = Point.inherit(
    "Point_add_using_id_fail",
    point_check_using_id_response2,
    {
        "msg": fields.String(example="포인트 적립에 실패하였습니다."),
    },
)


# point add API call route
@Point.route("/addUsingId", methods=["POST"])
class add_point_using_id(Resource):
    @Point.expect(point_add_using_id_fields)
    @Point.response(202, "success", point_add_using_id_response1)
    @Point.response(401, "fail", point_add_using_id_response2)
    def post(self):
        """요청한 포인트만큼 적립합니다 - id 사용"""
        req = request.get_json()
        id_receive = req["user_id"]
        point_receive = req["point"]
        try:
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            result = db.user.find_one_and_update(
                {"user_id": id_receive},
                {"$inc": {"point": point_receive}},
                projection={"_id": 0, "point": 1},
                return_document=ReturnDocument.AFTER,
            )
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "포인트 적립에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "포인트 적립에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)
