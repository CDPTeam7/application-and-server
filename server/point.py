# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from pymongo import ReturnDocument
from database import db
from tokens import *
import datetime
import time

# 전처리
Point = Namespace(
    name="Point",
    description="point 관련 API",
)


"""point_check_fields = Point.model(
    "Point_check_request",
    {},
)"""
point_check_response1_data = Point.model(
    "Point_check_response1_data", {"point": fields.Integer(example=30)}
)
point_check_response1 = Point.model(
    "Point_check_success",
    {
        "result": fields.String(example="SUCCESS_CHECK_POINT"),
        "msg": fields.String(example="포인트 확인에 성공하였습니다."),
        "data": fields.Nested(point_check_response1_data),
    },
)
point_check_response2 = Point.model(
    "Point_check_fail1",
    {
        "result": fields.String(example="ERROR_FAIL_CHECK_POINT"),
        "msg": fields.String(example="포인트 확인에 실패하였습니다."),
    },
)
point_check_response3 = Point.model(
    "Point_check_fail2",
    {
        "result": fields.String(example="ERROR_ACCESS_TOKEN_NOT_EXIST"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point check API call route
@Point.route("/check", methods=["GET"])
class check_point(Resource):
    # @Point.expect(point_check_fields)
    @Point.response(200, "success", point_check_response1)
    @Point.response(400, "fail", point_check_response2)
    @Point.response(401, "fail", point_check_response3)
    @token_required
    def get(self):
        """현재 포인트를 얼마나 가지고 있는지를 확인합니다 - token 사용"""
        payload = get_payload_from_header()
        if payload is None:
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_ACCESS_TOKEN_NOT_EXIST",
                        "msg": "access token이 유효하지 않습니다.",
                    }
                ),
                401,
            )
        try:
            id_receive = payload["id"]
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.find_one({"user_id": id_receive}, {"_id": 0, "point": 1})
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "SUCCESS_CHECK_POINT",
                "msg": "포인트 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 200)
        except:
            response_data = {
                "result": "ERROR_FAIL_CHECK_POINT",
                "msg": "포인트 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 400)


point_check_using_id_fields = Point.model(
    "Point_check_using_id_request",
    {  # Model 객체 생성
        "user_id": fields.String(description="an ID", required=True, example="ID"),
    },
)
point_check_using_id_response1_data = Point.model(
    "Point_check_using_id_response1_data", {"point": fields.Integer(example=30)}
)
point_check_using_id_response1 = Point.model(
    "Point_check_using_id_success",
    {
        "result": fields.String(example="SUCCESS_CHECK_POINT"),
        "msg": fields.String(example="포인트 확인에 성공하였습니다."),
        "data": fields.Nested(point_check_using_id_response1_data),
    },
)
point_check_using_id_response2 = Point.model(
    "Point_check_using_id_fail",
    {
        "result": fields.String(example="ERROR_FAIL_CHECK_POINT"),
        "msg": fields.String(example="포인트 확인에 실패하였습니다."),
    },
)


# point check API call route
@Point.route("/check-use-id", methods=["POST"])
class check_point_using_id(Resource):
    @Point.expect(point_check_using_id_fields)
    @Point.response(200, "success", point_check_using_id_response1)
    @Point.response(400, "fail", point_check_using_id_response2)
    def post(self):
        """현재 포인트를 얼마나 가지고 있는지를 확인합니다 - id 사용"""
        req = request.get_json()  # api를 요청한 서버에서 보낸 json파일 저장
        id_receive = req["user_id"]
        try:
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.find_one({"user_id": id_receive}, {"_id": 0, "point": 1})
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "SUCCESS_CHECK_POINT",
                "msg": "포인트 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "ERROR_FAIL_CHECK_POINT",
                "msg": "포인트 확인에 실패하였습니다.",
            }
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
point_add_response1 = Point.model(
    "Point_add_success",
    {
        "result": fields.String(example="SUCCESS_CHECK_POINT"),
        "msg": fields.String(example="포인트 적립에 성공하였습니다."),
        "data": fields.Nested(point_add_response1_data),
    },
)
point_add_response2 = Point.model(
    "Point_add_fail1",
    {
        "result": fields.String(example="ERROR_FAIL_ADD_POINT"),
        "msg": fields.String(example="포인트 적립에 실패하였습니다."),
    },
)
point_add_response3 = Point.model(
    "Point_add_fail2",
    {
        "result": fields.String(example="ERROR_ACCESS_TOKEN_NOT_EXIST"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point add API call route
@Point.route("/add", methods=["POST"])
class add_point(Resource):
    @Point.expect(point_add_fields)
    @Point.response(200, "success", point_add_response1)
    @Point.response(400, "fail", point_add_response2)
    @Point.response(401, "fail", point_add_response3)
    def post(self):
        """요청한 포인트만큼 적립합니다 - token 사용"""
        req = request.get_json()
        token_receive = req["access_token"]
        point_receive = req["point"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_ACCESS_TOKEN_NOT_EXIST",
                        "msg": "access token이 유효하지 않습니다.",
                    }
                ),
                401,
            )
        try:
            id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            result = db.user.find_one_and_update(
                {"user_id": id_receive},
                {"$inc": {"point": point_receive}},
                projection={"_id": 0, "point": 1, "region": 1, "area": 1},
                return_document=ReturnDocument.AFTER,
            )
            # 데이터를 처리하고 응답 생성
            if result is None:
                response_data = {
                    "result": "ERROR_FAIL_ADD_POINT",
                    "msg": "포인트 적립에 실패하였습니다.",
                }
                return make_response(jsonify(response_data), 400)
            response_data = {
                "result": "SUCCESS_CHECK_POINT",
                "msg": "포인트 적립에 성공하였습니다.",
                "data": result,
            }
            db.history.update_one(
                {"user_id": id_receive},
                {
                    "$push": {
                        "point_history": {
                            "transactionID": "TRANS_RECYCLE_RESOLVED",
                            "date": time.mktime(datetime.datetime.now().timetuple()),
                            "point": point_receive,
                            "after_total": result["point"],
                            "regionName": result["region"],
                            "areaName": result["area"],
                        }
                    }
                },
            )
            return make_response(jsonify(response_data), 200)
        except:
            response_data = {
                "result": "ERROR_FAIL_ADD_POINT",
                "msg": "포인트 적립에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 400)


point_add_using_id_fields = Point.model(
    "Point_add_using_id_request",
    {  # Model 객체 생성
        "access_token": fields.String(
            description="an access token", required=True, example="access token"
        ),
        "point": fields.Integer(description="a point", required=True, example=20),
    },
)
point_add_using_id_response1_data = Point.model(
    "Point_add_using_id_response1_data", {"point": fields.Integer(example=30)}
)
point_add_using_id_response1 = Point.model(
    "Point_add_using_id_success",
    {
        "result": fields.String(example="SUCCESS_ADD_POINT"),
        "msg": fields.String(example="포인트 적립에 성공하였습니다."),
        "data": fields.Nested(point_add_response1_data),
    },
)
point_add_using_id_response2 = Point.model(
    "Point_add_using_id_fail",
    {
        "result": fields.String(example="ERROR_FAIL_ADD_POINT"),
        "msg": fields.String(example="포인트 적립에 실패하였습니다."),
    },
)


# point add API call route
@Point.route("/add-use-id", methods=["POST"])
class add_point_using_id(Resource):
    @Point.expect(point_add_using_id_fields)
    @Point.response(200, "success", point_add_using_id_response1)
    @Point.response(400, "fail", point_add_using_id_response2)
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
                projection={"_id": 0, "point": 1, "region": 1},
                return_document=ReturnDocument.AFTER,
            )
            # 데이터를 처리하고 응답 생성
            if result is None:
                response_data = {
                    "result": "ERROR_FAIL_ADD_POINT",
                    "msg": "포인트 적립에 실패하였습니다.",
                }
                return make_response(jsonify(response_data), 400)
            response_data = {
                "result": "SUCCESS_ADD_POINT",
                "msg": "포인트 적립에 성공하였습니다.",
                "data": result,
            }
            db.history.update_one(
                {"user_id": id_receive},
                {
                    "$push": {
                        "point_history": {
                            "date": datetime.datetime.now(),
                            "point": point_receive,
                            "after_total": result["point"],
                            "region": result["region"],
                            "area": result["area"],
                        }
                    }
                },
            )
            return make_response(jsonify(response_data), 200)
        except:
            response_data = {
                "result": "ERROR_FAIL_ADD_POINT",
                "msg": "포인트 적립에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 400)


history_interval_fields_fromto = Point.model(
    "History_interval_request_fromto",
    {
        "timestamp": fields.Integer(description="timestamp", required=True),
    },
)
"""history_interval_fields_from_data = {
    "year": 2017,
    "month": 5,
    "day": 10,
    "hour": 10,
    "minute": 0,
    "second": 0,
}
history_interval_fields_to_data = {
    "year": 2024,
    "month": 12,
    "day": 31,
    "hour": 10,
    "minute": 0,
    "second": 0,
}"""
history_interval_fields = Point.model(
    "History_interval_request",
    {  # Model 객체 생성
        "from": fields.Integer(
            description="from timestamp", required=True, example=1701069339870
        ),
        "to": fields.Integer(
            description="to timestamp", required=True, example=1714407851710
        ),
    },
)
history_interval_response1_data = Point.model(
    "History_interval_response1_data",
    {
        "after_total": fields.Integer(),
        "date": fields.DateTime(),
        "point": fields.Integer(),
    },
)
history_interval_response1_example = [
    {
        "after_total": 210,
        "date": datetime.datetime(2024, 1, 3, 13, 0).isoformat(),
        "point": 10,
    },
    {
        "after_total": 200,
        "date": datetime.datetime(2020, 12, 31, 15, 0).isoformat(),
        "point": 20,
    },
    {
        "after_total": 180,
        "date": datetime.datetime(2017, 5, 13, 12, 0).isoformat(),
        "point": 50,
    },
]
history_interval_response1 = Point.model(
    "History_interval_success",
    {
        "result": fields.String(example="SUCCESS_INTERVAL_HISTORY"),
        "data": fields.List(
            fields.Nested(history_interval_response1_data),
            default=history_interval_response1_example,
        ),
        "msg": fields.String(example="기간에 대한 포인트 내역 확인에 성공하였습니다."),
    },
)
history_interval_response2 = Point.model(
    "History_interval_fail1",
    {
        "result": fields.String(example="ERROR_FAIL_INTERVAL_HISTORY"),
        "msg": fields.String(example="기간에 대한 포인트 내역 확인에 실패하였습니다."),
    },
)
history_interval_response3 = Point.model(
    "History_interval_fail2",
    {
        "result": fields.String(example="ERROR_ACCESS_TOKEN_NOT_EXIST"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# interval history API call route
@Point.route("/history/interval", methods=["POST"])
class interval_history(Resource):
    @Point.expect(history_interval_fields)
    @Point.response(200, "success", history_interval_response1)
    @Point.response(400, "fail", history_interval_response2)
    @Point.response(401, "fail", history_interval_response3)
    @token_required
    def post(self):
        """요청한 날짜 사이에 대한 포인트 내역을 확인합니다 - token 사용"""
        req = request.get_json()
        from_receive = req["from"]
        to_receive = req["to"]
        payload = get_payload_from_header()
        if payload == None:
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_ACCESS_TOKEN_NOT_EXIST",
                        "msg": "access token이 유효하지 않습니다.",
                    }
                ),
                401,
            )
        try:
            id_receive = payload["id"]
            pipeline = [
                {"$match": {"user_id": id_receive}},
                {
                    "$project": {
                        "_id": 0,
                        "user_id": 1,
                        "point_history": {
                            "$filter": {
                                "input": {"$reverseArray": "$point_history"},
                                "as": "point",
                                "cond": {
                                    "$and": [
                                        {"$gte": ["$$point.date", from_receive]},
                                        {"$lte": ["$$point.date", to_receive]},
                                    ]
                                },
                            }
                        },
                    }
                },
            ]
            result = list(db.history.aggregate(pipeline))
            # 데이터를 처리하고 응답 생성
            # print(result)
            response_data = {
                "result": "SUCCESS_INTERVAL_HISTORY",
                "msg": "기간에 대한 포인트 내역 확인에 성공하였습니다.",
                "data": result[0]["point_history"],
            }
            return make_response(jsonify(response_data), 200)
        except Exception as e:
            print(str(e))
            response_data = {
                "result": "ERROR_FAIL_INTERVAL_HISTORY",
                "msg": "기간에 대한 포인트 내역 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 400)


history_count_fields = Point.model(
    "History_count_request",
    {  # Model 객체 생성
        "from": fields.Integer(description="from index", required=True, example=3),
        "count": fields.Integer(description="to count", required=True, example=4),
    },
)
history_count_response1_data = Point.model(
    "History_count_response1_data",
    {
        "after_total": fields.Integer(),
        "date": fields.DateTime(),
        "point": fields.Integer(),
    },
)
history_count_response1_example = [
    {
        "after_total": 200,
        "date": datetime.datetime(2020, 12, 31, 15, 0).isoformat(),
        "point": 20,
    },
    {
        "after_total": 180,
        "date": datetime.datetime(2017, 5, 13, 12, 0).isoformat(),
        "point": 50,
    },
    {
        "after_total": 130,
        "date": datetime.datetime(2016, 3, 1, 10, 0).isoformat(),
        "point": 10,
    },
    {
        "after_total": 120,
        "date": datetime.datetime(2016, 2, 20, 18, 0).isoformat(),
        "point": 50,
    },
]
history_count_response1 = Point.model(
    "History_count_success",
    {
        "result": fields.String(example="SUCCESS_COUNT_HISTORY"),
        "data": fields.List(
            fields.Nested(history_count_response1_data),
            default=history_count_response1_example,
        ),
        "msg": fields.String(example="기간에 대한 포인트 내역 확인에 성공하였습니다."),
    },
)
history_count_response2 = Point.model(
    "History_count_fail1",
    {
        "result": fields.String(example="ERROR_FAIL_COUNT_HISTORY"),
        "msg": fields.String(example="기간에 대한 포인트 내역 확인에 실패하였습니다."),
    },
)
history_count_response3 = Point.model(
    "History_count_fail2",
    {
        "result": fields.String(example="ERROR_ACCESS_TOKEN_NOT_EXIST"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# count history API call route
@Point.route("/history/count", methods=["POST"])
class count_history(Resource):
    @Point.expect(history_count_fields)
    @Point.response(200, "success", history_count_response1)
    @Point.response(400, "fail", history_count_response2)
    @Point.response(401, "fail", history_count_response3)
    @token_required
    def post(self):
        """요청한 위치부터 개수만큼 포인트 내역을 확인합니다 - token 사용"""
        req = request.get_json()
        from_receive = req["from"]
        count_receive = req["count"]
        payload = get_payload_from_header()
        if payload == None:
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_ACCESS_TOKEN_NOT_EXIST",
                        "msg": "access token이 유효하지 않습니다.",
                    }
                ),
                402,
            )
        try:
            id_receive = payload["id"]
            pipeline = [
                {"$match": {"user_id": id_receive}},
                {
                    "$project": {
                        "_id": 0,
                        "user_id": 1,
                        "point_history": {
                            "$slice": [
                                {"$reverseArray": "$point_history"},
                                from_receive,
                                count_receive,
                            ]
                        },
                    }
                },
            ]
            result = list(db.history.aggregate(pipeline))
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "SUCCESS_COUNT_HISTORY",
                "msg": "기간에 대한 포인트 내역 확인에 성공하였습니다.",
                "data": result[0]["point_history"],
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "ERROR_FAIL_COUNT_HISTORY",
                "msg": "기간에 대한 포인트 내역 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)
