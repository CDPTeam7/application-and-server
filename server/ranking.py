# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
from database import db
from pymongo import ReturnDocument
from tokens import *


# 전처리
Ranking = Namespace(
    name="Ranking",
    description="Ranking 관련 API",
)


"""ranking_check_fields = Ranking.model(
    "Ranking_check_request",
    {},  # Model 객체 생성
)"""
ranking_check_response1_data = Ranking.model(
    "Ranking_check_response1_data", {"score": fields.Integer(example=30)}
)
ranking_check_response1 = Ranking.model(
    "Ranking_check_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="점수 확인에 성공하였습니다."),
        "data": fields.Nested(ranking_check_response1_data),
    },
)
ranking_check_response2 = Ranking.model(
    "Ranking_check_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="점수 확인에 실패하였습니다."),
    },
)
ranking_check_response3 = Ranking.model(
    "Ranking_check_fail2",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point add API call route
@Ranking.route("/check", methods=["GET"])
class check_score(Resource):
    # @Ranking.expect(ranking_check_fields)
    @Ranking.response(202, "success", ranking_check_response1)
    @Ranking.response(401, "fail", ranking_check_response2)
    @Ranking.response(402, "fail", ranking_check_response3)
    @token_required
    def get(self):
        """현재 점수를 얼마나 가지고 있는지를 확인합니다 - token 사용"""
        payload = get_payload_from_header()
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # select 쿼리 실행: request의 id과 동일한 document 찾기
            result = db.user.find_one({"user_id": id_receive}, {"_id": 0, "score": 1})
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "점수 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "점수 확인에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)


ranking_add_fields = Ranking.model(
    "Ranking_add_request",
    {  # Model 객체 생성
        "access_token": fields.String(
            description="an access token", required=True, example="access_token"
        ),
        "score": fields.Integer(description="a score", required=True, example=20),
    },
)
ranking_add_response1_data = Ranking.model(
    "Ranking_add_response1_data", {"score": fields.Integer(example=30)}
)
ranking_add_response1 = Ranking.inherit(
    "Ranking_add_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="점수 적립에 성공하였습니다."),
        "data": fields.Nested(ranking_add_response1_data),
    },
)
ranking_add_response2 = Ranking.inherit(
    "Ranking_add_fail1",
    ranking_check_response2,
    {
        "msg": fields.String(example="점수 적립에 실패하였습니다."),
    },
)
ranking_add_response3 = Ranking.inherit(
    "Ranking_add_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# point add API call route
@Ranking.route("/add", methods=["POST"])
class add_score(Resource):
    @Ranking.expect(ranking_add_fields)
    @Ranking.response(202, "success", ranking_add_response1)
    @Ranking.response(401, "fail", ranking_add_response2)
    @Ranking.response(402, "fail", ranking_add_response3)
    def post(self):
        """요청한 점수만큼 적립합니다 - token 사용"""
        req = request.get_json()
        token_receive = req["access_token"]
        score_receive = req["score"]
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
                {"$inc": {"score": score_receive}},
                projection={"_id": 0, "score": 1},
                return_document=ReturnDocument.AFTER,
            )
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "점수 적립에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {"result": "fail", "msg": "점수 적립에 실패하였습니다."}
            return make_response(jsonify(response_data), 401)


"""ranking_individual_fields = Ranking.model(
    "Ranking_individual_request",
    {},
)"""
ranking_individual_response1_data = Ranking.model(
    "Ranking_individual_response1_data",
    {
        "rank": fields.Integer(),
        "score": fields.Integer(),
        "user_id": fields.String(),
    },
)
ranking_individual_response1_example = [
    {"rank": 1, "score": 4520, "user_id": "11175"},
    {"rank": 2, "score": 1000, "user_id": "56111"},
    {"rank": 3, "score": 500, "user_id": "116561"},
]
ranking_individual_response1 = Ranking.inherit(
    "Ranking_individual_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="개인 점수 집계에 성공하였습니다."),
        "data": fields.List(
            fields.Nested(ranking_individual_response1_data),
            default=ranking_individual_response1_example,
        ),
    },
)
ranking_individual_response2 = Ranking.inherit(
    "Ranking_individual_fail",
    ranking_check_response2,
    {
        "msg": fields.String(example="개인 점수 집계에 실패하였습니다."),
    },
)
"""
ranking_individual_response3 = Ranking.inherit(
    "Ranking_individual_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)
"""


@Ranking.route("/aggregation/individual")
class ranking_individual(Resource):
    # @Ranking.expect(ranking_individual_fields)
    @Ranking.response(202, "success", ranking_individual_response1)
    @Ranking.response(401, "fail", ranking_individual_response2)
    # @Ranking.response(402, "fail", ranking_add_response3)
    def get(self):
        """개인 점수 집계를 확인합니다 - token 사용"""
        req = request.get_json()
        """token_receive = req["access_token"]
        score_receive = req["score"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )"""
        try:
            # id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            pipeline = [
                {
                    "$setWindowFields": {
                        "sortBy": {"score": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {"$project": {"_id": 0, "rank": 1, "score": 1, "user_id": 1}},
            ]
            result = list(db.user.aggregate(pipeline))
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "개인 점수 집계에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "개인 점수 집계에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


ranking_group_first_region_response1_data = Ranking.model(
    "Ranking_group_first_region_response1_data",
    {
        "rank": fields.Integer(),
        "total": fields.Integer(),
        "region": fields.String(),
    },
)
ranking_group_first_region_response1_example = [
    {"rank": 1, "region": "대구", "total": 4700},
    {"rank": 2, "region": "부산", "total": 1590},
    {"rank": 3, "region": "서울", "total": 670},
]
ranking_group_first_region_response1 = Ranking.inherit(
    "Ranking_group_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="시 단위 그룹 점수 집계에 성공하였습니다."),
        "data": fields.List(
            fields.Nested(ranking_group_first_region_response1_data),
            default=ranking_group_first_region_response1_example,
        ),
    },
)
ranking_group_first_region_response2 = Ranking.inherit(
    "Ranking_group_fail",
    ranking_check_response2,
    {
        "msg": fields.String(example="시 단위 그룹 점수 집계에 실패하였습니다."),
    },
)
"""
ranking_individual_response3 = Ranking.inherit(
    "Ranking_individual_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)
"""


@Ranking.route("/aggregation/group/first-region")
class ranking_group_first_region(Resource):
    @Ranking.response(202, "success", ranking_group_first_region_response1)
    @Ranking.response(401, "fail", ranking_group_first_region_response2)
    def get(self):
        """시 단위 그룹 점수 집계를 확인합니다 - token 사용"""
        """token_receive = req["access_token"]
        score_receive = req["score"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )"""
        try:
            # id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            """
            pipeline = [
                {
                    "$group": {
                        "_id": "$region",
                        "total": {"$sum": "$score"},
                    }
                },
                {
                    "$setWindowFields": {
                        "sortBy": {"total": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {"$project": {"_id": 0, "region": "$_id", "total": 1, "rank": 1}},
            ]
            """
            pipeline = [
                {
                    "$group": {
                        "_id": {"$arrayElemAt": ["$region", 0]},
                        "total": {"$sum": "$score"},
                    }
                },
                {
                    "$setWindowFields": {
                        "sortBy": {"total": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "first_region": "$_id",
                        "total": "$total",
                        "rank": "$rank",
                    },
                },
            ]
            result = list(db.user.aggregate(pipeline))
            """
            if len(result):
                result[0]["rank"] = 1
            rank = 1
            for i in range(1, len(result)):
                if result[i]["total"] != result[i - 1]["total"]:
                    rank = i + 1
                result[i]["rank"] = rank
            """
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "시 단위 지역 점수 집계에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "시 단위 지역 점수 집계에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


ranking_group_second_region_response1_documents = Ranking.model(
    "Ranking_group_second_region_response1_documents",
    {
        "rank": fields.Integer(),
        "second_region": fields.String(),
        "total": fields.Integer(),
    },
)
ranking_group_second_region_response1_data = Ranking.model(
    "Ranking_group_second_region_response1_data",
    {
        "first_region": fields.String(),
        "documents": fields.List(
            fields.Nested(ranking_group_second_region_response1_documents),
        ),
    },
)
ranking_group_second_region_response1_example = [
    {
        "first_region": "대구",
        "documents": [
            {"rank": 1, "second_region": "수성구", "total": 4520},
            {"rank": 5, "second_region": "중구", "total": 100},
            {"rank": 9, "second_region": "북구", "total": 40},
            {"rank": 11, "second_region": "동구", "total": 20},
            {"rank": 11, "second_region": "남구", "total": 20},
        ],
    },
    {
        "first_region": "부산",
        "documents": [
            {"rank": 2, "second_region": "북구", "total": 1020},
            {"rank": 3, "second_region": "중구", "total": 500},
            {"rank": 8, "second_region": "해운대구", "total": 70},
        ],
    },
    {
        "first_region": "서울",
        "documents": [
            {"rank": 4, "second_region": "강서구", "total": 450},
            {"rank": 5, "second_region": "강동구", "total": 100},
            {"rank": 7, "second_region": "동대문구", "total": 90},
            {"rank": 10, "second_region": "강남구", "total": 30},
        ],
    },
]
ranking_group_second_region_response1 = Ranking.inherit(
    "Ranking_group_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="구 단위 그룹 점수 집계에 성공하였습니다."),
        "data": fields.List(
            fields.Nested(ranking_group_second_region_response1_data),
            default=ranking_group_second_region_response1_example,
        ),
    },
)
ranking_group_second_region_response2 = Ranking.inherit(
    "Ranking_group_fail",
    ranking_check_response2,
    {
        "msg": fields.String(example="구 단위 그룹 점수 집계에 실패하였습니다."),
    },
)
"""
ranking_individual_response3 = Ranking.inherit(
    "Ranking_individual_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)
"""


@Ranking.route("/aggregation/group/second-region")
class ranking_group_second_region(Resource):
    @Ranking.response(202, "success", ranking_group_second_region_response1)
    @Ranking.response(401, "fail", ranking_group_second_region_response2)
    def get(self):
        """구 단위 그룹 점수 집계를 확인합니다 - token 사용"""
        """token_receive = req["access_token"]
        score_receive = req["score"]
        payload = check_access_token(token_receive)
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )"""
        try:
            # id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            """
            pipeline = [
                {
                    "$group": {
                        "_id": "$region",
                        "total": {"$sum": "$score"},
                    }
                },
                {
                    "$setWindowFields": {
                        "sortBy": {"total": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {"$project": {"_id": 0, "region": "$_id", "total": 1, "rank": 1}},
            ]
            """
            pipeline = [
                {
                    "$group": {
                        "_id": {
                            "first_region": {"$arrayElemAt": ["$region", 0]},
                            "second_region": {"$arrayElemAt": ["$region", 1]},
                        },
                        "total": {"$sum": "$score"},
                    }
                },
                {
                    "$setWindowFields": {
                        "sortBy": {"total": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.first_region",
                        "documents": {"$push": "$$ROOT"},
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "first_region": "$_id",
                        "documents": {
                            "$map": {
                                "input": "$documents",
                                "as": "item",
                                "in": {
                                    "second_region": "$$item._id.second_region",
                                    "total": "$$item.total",
                                    "rank": "$$item.rank",
                                },
                            }
                        },
                    },
                },
                {
                    "$sort": {
                        "first_region": 1,
                    },
                },
            ]
            result = list(db.user.aggregate(pipeline))
            """
            if len(result):
                result[0]["rank"] = 1
            rank = 1
            for i in range(1, len(result)):
                if result[i]["total"] != result[i - 1]["total"]:
                    rank = i + 1
                result[i]["rank"] = rank
            """
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "구 단위 지역 점수 집계에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "구 단위 지역 점수 집계에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


"""ranking_individual_rank_fields = Ranking.model(
    "Ranking_individual_rank_request",
    {},
)"""
ranking_individual_rank_response1_data = Ranking.model(
    "Ranking_individual_rank_response1_data",
    {
        "rank": fields.Integer(),
        "score": fields.Integer(),
        "user_id": fields.String(),
    },
)
ranking_individual_rank_response1_example = [
    {"rank": 3, "score": 500, "user_id": "1231"},
]
ranking_individual_rank_response1 = Ranking.inherit(
    "Ranking_individual_rank_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="개인 점수 랭킹 확인에 성공하였습니다."),
        "data": fields.List(
            fields.Nested(ranking_individual_rank_response1_data),
            default=ranking_individual_rank_response1_example,
        ),
    },
)
ranking_individual_rank_response2 = Ranking.inherit(
    "Ranking_individual_rank_fail1",
    ranking_check_response2,
    {
        "msg": fields.String(example="개인 점수 랭킹 확인에 실패하였습니다."),
    },
)
ranking_individual_rank_response3 = Ranking.inherit(
    "Ranking_individual_rank_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


@Ranking.route("/aggregation/individual-myrank")
class ranking_individual_rank(Resource):
    # @Ranking.expect(ranking_individual_rank_fields)
    @Ranking.response(202, "success", ranking_individual_rank_response1)
    @Ranking.response(401, "fail", ranking_individual_rank_response2)
    @Ranking.response(402, "fail", ranking_individual_rank_response3)
    @token_required
    def get(self):
        """본인의 개인 점수 랭킹 확인를 확인합니다 - token 사용"""
        payload = get_payload_from_header()
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            pipeline = [
                {
                    "$setWindowFields": {
                        "sortBy": {"score": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {"$match": {"user_id": id_receive}},
                {"$project": {"_id": 0, "rank": 1, "score": 1, "user_id": 1}},
            ]
            result = list(db.user.aggregate(pipeline))
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "개인 점수 랭킹 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "개인 점수 랭킹 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


"""ranking_group_rank_fields = Ranking.model(
    "Ranking_group_rank_request",
    {},
)"""
ranking_group_rank_response1_data = Ranking.model(
    "Ranking_group_rank_response1_data",
    {
        "rank": fields.Integer(),
        "total": fields.Integer(),
        "region": fields.String(),
    },
)
ranking_group_rank_response1_example = [
    {"rank": 3, "region": "Seoul", "total": 670},
]
ranking_group_rank_response1 = Ranking.inherit(
    "Ranking_group_rank_success",
    ranking_check_response1,
    {
        "msg": fields.String(example="그룹 점수 랭킹 확인에 성공하였습니다."),
        "data": fields.List(
            fields.Nested(ranking_group_rank_response1_data),
            default=ranking_group_rank_response1_example,
        ),
    },
)
ranking_group_rank_response2 = Ranking.inherit(
    "Ranking_group_rank_fail1",
    ranking_check_response2,
    {
        "msg": fields.String(example="그룹 점수 랭킹 확인에 실패하였습니다."),
    },
)
ranking_group_rank_response3 = Ranking.inherit(
    "Ranking_group_rank_fail2",
    ranking_check_response2,
    {
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)
ranking_group_rank_response4 = Ranking.inherit(
    "Ranking_group_rank_fail3",
    ranking_check_response2,
    {
        "msg": fields.String(example="지역이 등록되어 있지 않습니다."),
    },
)


@Ranking.route("/aggregation/group-myrank")
class ranking_group_rank(Resource):
    # @Ranking.expect(ranking_group_rank_fields)
    @Ranking.response(202, "success", ranking_group_rank_response1)
    @Ranking.response(401, "fail", ranking_group_rank_response2)
    @Ranking.response(402, "fail", ranking_group_rank_response3)
    @Ranking.response(403, "fail", ranking_group_rank_response4)
    @token_required
    def get(self):
        """본인의 그룹 점수 랭킹 확인를 확인합니다 - token 사용"""
        payload = get_payload_from_header()
        if payload == None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # print(id_receive)
            # find one and update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc), 업데이트 이후에 값을 return
            result1 = db.user.find_one({"user_id": id_receive})
            if "region" not in result1:
                response_data = {
                    "result": "fail",
                    "msg": "지역이 등록되어 있지 않습니다.",
                }
                return make_response(jsonify(response_data), 403)
            # print(result1)
            pipeline = [
                {
                    "$group": {
                        "_id": {"$arrayElemAt": ["$region", 0]},
                        "total": {"$sum": "$score"},
                    }
                },
                {
                    "$setWindowFields": {
                        "sortBy": {"total": -1},
                        "output": {"rank": {"$rank": {}}},
                    }
                },
                {"$match": {"_id": result1["region"][0]}},
                {"$project": {"_id": 0, "region": "$_id", "total": 1, "rank": 1}},
            ]
            result = list(db.user.aggregate(pipeline))
            """if len(result):
                result[0]["rank"] = 1
            rank = 1
            for i in range(1, len(result)):
                if result[i]["total"] != result[i - 1]["total"]:
                    rank = i + 1
                result[i]["rank"] = rank"""
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "지역 점수 집계에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "지역 점수 집계에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)
