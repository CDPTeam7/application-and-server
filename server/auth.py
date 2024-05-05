# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify, make_response  # flask 관련 라이브러리
from flask_restx import Resource, Namespace, fields  # Api 구현을 위한 Api 객체 import
import hashlib  # 비밀번호 암호화를 위한 모듈
import jwt  # jwt 토큰을 발급하기 위한 모듈
from tokens import *
from database import db
import os
from dotenv import load_dotenv


# 전처리
Auth = Namespace(
    name="Auth",
    description="login 관련 API",
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


signup_fields = Auth.model(
    "Signup_request",
    {  # Model 객체 생성
        "user_id": fields.String(description="an ID", required=True, example="ID"),
        "user_pw": fields.String(
            description="a password", required=True, example="Password"
        ),
        "nickname": fields.String(
            description="a nickname", required=True, example="nick"
        ),
    },
)
signup_response1 = Auth.model(
    "Signup_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="회원가입에 성공하였습니다."),
    },
)
signup_response2 = Auth.model(
    "Signup_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="이미 존재하는 ID입니다."),
    },
)
signup_response3 = Auth.model(
    "Signup_fail2",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="회원가입에 실패하였습니다."),
    },
)


# 회원가입
@Auth.route("/signup", methods=["POST"])
class api_register(Resource):
    @Auth.expect(signup_fields)
    @Auth.response(202, "success", signup_response1)
    @Auth.response(401, "fail", signup_response2)
    @Auth.response(402, "fail", signup_response3)
    def post(self):
        """signup을 합니다"""
        req = request.get_json()
        id_receive = req["user_id"]
        pw_receive = req["user_pw"]
        nick_receive = req["nickname"]
        pw_hash = hashlib.sha256(pw_receive.encode("utf-8")).hexdigest()
        # password는 암호화해서 저장
        # print(id_receive, pw_receive, pw_hash)
        # 이미 존재하는 아이디면 패스
        try:
            result = db.user.find_one({"user_id": id_receive})
            if result is not None:
                return make_response(
                    jsonify({"result": "fail", "msg": "이미 존재하는 ID입니다."}), 401
                )
            else:
                # id와 암호화된 pw를 user DB에 저장
                result = db.user.insert_one(
                    {
                        "user_id": id_receive,
                        "user_pw": pw_hash,
                        "nick": nick_receive,
                        "point": 0,
                        "score": 0,
                        "prev_score": 0,
                    }
                )
                if result.inserted_id is None:
                    response = {"result": "fail", "msg": "회원가입에 실패하였습니다."}
                    return make_response(jsonify(response), 402)
                db.image.insert_one({"user_id": id_receive, "image": []})
                db.history.insert_one({"user_id": id_receive, "point_history": []})
                return make_response(
                    jsonify({"result": "success", "msg": "회원가입에 성공하였습니다."}),
                    202,
                )
        except:
            response = {"result": "fail", "msg": "회원가입에 실패하였습니다."}
            return make_response(jsonify(response), 402)


login_fields = Auth.inherit("Login_request", signup_fields, {})
login_response1 = Auth.inherit(
    "Login_success",
    signup_response1,
    {
        "access_token": fields.String(example="access_token"),
        "refresh_token": fields.String(example="refresh_token"),
    },
)
login_response2 = Auth.inherit(
    "Login_fail1",
    signup_response2,
    {"msg": fields.String(example="비밀번호가 일치하지 않습니다.")},
)
login_response3 = Auth.inherit(
    "Login_fail2",
    signup_response2,
    {
        "msg": fields.String(example="존재하지 않는 아이디입니다."),
    },
)
login_response4 = Auth.inherit(
    "Login_fail3",
    signup_response2,
    {
        "msg": fields.String(example="정상적인 접근이 아닙니다."),
    },
)


# 로그인
@Auth.route("/login", methods=["POST"])
class api_login(Resource):
    @Auth.expect(login_fields)
    @Auth.response(202, "success", login_response1)
    @Auth.response(401, "fail", login_response2)
    @Auth.response(402, "fail", login_response3)
    @Auth.response(403, "fail", login_response4)
    def post(self):
        """login을 합니다"""
        req = request.get_json()
        id_receive = req["user_id"]
        pw_receive = req["user_pw"]
        # 회원가입 때와 같은 방법으로 pw를 암호화
        pw_hash = hashlib.sha256(pw_receive.encode("utf-8")).hexdigest()
        # print(id_receive, pw_receive, pw_hash)
        # id, 암호화된 pw을 가지고 user DB로부터 해당 유저 찾기
        try:
            result = db.user.find_one({"user_id": id_receive})

            # 찾으면 JWT 토큰을 만들어 발급
            if result is not None:
                if result["user_pw"] != pw_hash:
                    return make_response(
                        jsonify(
                            {"result": "fail", "msg": "비밀번호가 일치하지 않습니다."}
                        ),
                        402,
                    )
                # JWT 토큰 생성
                payload = {"id": id_receive}
                # generate token 함수에 access를 넣어서 access token 발급
                access_token = generate_token(payload, "access")
                payload = {}
                # generate token 함수에 access를 넣어서 access token 발급
                refresh_token = generate_token(payload, "refresh")
                # token return
                # print(jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"]))
                result = db.token.update_one(
                    {"user_id": id_receive}, {"$set": {"refresh_token": refresh_token}}
                )
                if result.matched_count == 0:
                    db.token.insert_one(
                        {"user_id": id_receive, "refresh_token": refresh_token}
                    )
                return make_response(
                    jsonify(
                        {
                            "result": "success",
                            "access_token": access_token,
                            "refresh_token": refresh_token,
                        }
                    ),
                    202,
                )
            # 찾지 못하면 fail
            else:
                return make_response(
                    jsonify({"result": "fail", "msg": "존재하지 않는 아이디입니다."}),
                    401,
                )

        except Exception as e:
            print(e)
            data = {"results": "fail", "msg": "정상적인 접근이 아닙니다."}
            return make_response(jsonify(data), 403)


# fields는 수정할 예정 - header
check_fields = Auth.inherit("Check_request", signup_fields, {})
check_response1 = Auth.model(
    "Check_success1", {"result": fields.String(example="success")}
)
check_response2 = Auth.inherit(
    "Check_success2",
    signup_response1,
    {
        "access_token": fields.String(example="access_token"),
    },
)
check_response3 = Auth.inherit(
    "Check_fail",
    signup_response2,
    {"msg": fields.String(example="access token, refresh token이 없습니다.")},
)


# access/refresh Token이 유효한지 확인하는 함수
@Auth.route("/check-token", methods=["POST"])
class api_check_token(Resource):
    @Auth.response(202, "success_access_token", check_response1)
    @Auth.response(203, "success_refresh_token", check_response2)
    @Auth.response(401, "fail", check_response3)
    def post(self):
        """access token, refresh token이 있는지를 확인합니다.
        header.Cookie로 token 입력
        ex) header.Cookie: "accessToken=string; refreshToken=string" """
        # 요청의 토큰 정보를 받아옴
        token = request.headers.get("Cookie")
        if token is not None:  # 토큰이 있는 경우
            # access token 유효성 확인
            access_token = (token.split("; ")[0]).split("=")[1]
            if len(token.split("; ")) > 1:
                refresh_token = (token.split("; ")[1]).split("=")[1]
            payload_access = check_access_token(access_token)
            # print(payload_access)
            if payload_access is not None:
                return make_response(jsonify({"result": "success"}), 203)
            if payload_access is None and len(token.split("; ")) > 1:
                # refresh token 유효성 확인
                payload_refresh = check_refresh_token(refresh_token)
                if payload_refresh is None:
                    # access, refresh token decode 실패 시 401 반환
                    return make_response(
                        jsonify(
                            {
                                "result": "fail",
                                "msg": "access token, refresh token이 없습니다.",
                            }
                        ),
                        401,
                    )
                access_token = generate_token(payload_refresh, "refresh")
                return make_response(
                    jsonify({"result": "success", "access_token": access_token}), 202
                )
            else:
                return make_response(
                    jsonify(
                        {
                            "result": "fail",
                            "msg": "access token, refresh token이 없습니다.",
                        }
                    ),
                    401,
                )
        else:  # 토큰이 없는 경우 401 반환
            return make_response(
                jsonify(
                    {"result": "fail", "msg": "access token, refresh token이 없습니다."}
                ),
                401,
            )


# fields는 수정할 예정 - header
logout_fields = Auth.model(
    "Logout_request", {"access_token": fields.String(example="access_token")}
)
logout_response1 = Auth.model(
    "Logout_success", {"result": fields.String(example="success")}
)
logout_response2 = Auth.inherit(
    "Logout_fail1",
    signup_response2,
    {"msg": fields.String(example="access token이 없습니다.")},
)
logout_response3 = Auth.inherit(
    "Logout_fail2",
    signup_response2,
    {"msg": fields.String(example="token에 대한 정보가 DB에 존재하지 않습니다.")},
)
logout_response4 = Auth.inherit(
    "Logout_fail3",
    signup_response2,
    {"msg": fields.String(example="로그아웃에 실패하였습니다.")},
)


# 로그아웃
@Auth.route("/logout", methods=["POST"])
class api_logout(Resource):
    @Auth.expect(logout_fields)
    @Auth.response(202, "success", logout_response1)
    @Auth.response(401, "fail", logout_response2)
    @Auth.response(402, "fail", logout_response3)
    @Auth.response(403, "fail", logout_response4)
    @token_required
    def post(self):
        """logout을 합니다"""
        req = request.get_json()
        token_receive = req["access_token"]
        # print(token_receive)
        payload = check_access_token(token_receive)
        if payload is None:
            return make_response(
                jsonify(
                    {
                        "result": "fail",
                        "msg": "access token이 없습니다.",
                    }
                ),
                401,
            )
        try:
            result = db.token.delete_one({"user_id": payload["id"]})
            if result.deleted_count != 0:
                return make_response(jsonify({"result": "success"}), 202)
            else:
                return make_response(
                    jsonify(
                        {
                            "result": "fail",
                            "msg": "token에 대한 정보가 DB에 존재하지 않습니다.",
                        }
                    ),
                    402,
                )
        except:
            response = {
                "result": "fail",
                "msg": "로그아웃에 실패하였습니다.",
            }
            return make_response(jsonify(response), 403)


"""auth_check_userinfo_fields = Auth.model(
    "Auth_check_userinfo_request",
    {},
)"""
auth_check_userinfo_response1_data = Auth.model(
    "Auth_check_userinfo_response1_data",
    {
        "nickname": fields.String(example="nick"),
        "point": fields.Integer(example=30),
        "score": fields.Integer(example=120),
        "region": fields.List(fields.String(), example=["대구", "북구"]),
    },
)
auth_check_userinfo_response1 = Auth.model(
    "Auth_check_userinfo_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="유저 정보 확인에 성공하였습니다."),
        "data": fields.Nested(auth_check_userinfo_response1_data),
    },
)
auth_check_userinfo_response2 = Auth.model(
    "Auth_check_userinfo_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="유저 정보 확인에 실패하였습니다."),
    },
)
auth_check_userinfo_response3 = Auth.model(
    "Auth_check_userinfo_fail2",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# 유저 정보 확인
@Auth.route("/check-userinfo", methods=["GET"])
class api_check_userinfo(Resource):
    # @Auth.expect(auth_check_userinfo_fields)
    @Auth.response(202, "success", auth_check_userinfo_response1)
    @Auth.response(401, "fail", auth_check_userinfo_response2)
    @Auth.response(402, "fail", auth_check_userinfo_response3)
    @token_required
    def get(self):
        """유저 정보를 가져옵니다"""
        payload = get_payload_from_header()
        if payload is None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.find_one(
                {"user_id": id_receive},
                {"_id": 0, "nickname": 1, "point": 1, "score": 1, "region": 1},
            )
            # 데이터를 처리하고 응답 생성
            response_data = {
                "result": "success",
                "msg": "유저 정보 확인에 성공하였습니다.",
                "data": result,
            }
            return make_response(jsonify(response_data), 202)
        except:
            response_data = {
                "result": "fail",
                "msg": "유저 정보 확인에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


auth_modify_userinfo_fields = Auth.model(
    "Auth_modify_userinfo_request",
    {
        "nickname": fields.String(example="nick"),
        "region": fields.List(fields.String(), example=["대구", "북구"]),
    },
)
auth_modify_userinfo_response1 = Auth.model(
    "Auth_modify_userinfo_success",
    {
        "result": fields.String(example="success"),
        "msg": fields.String(example="유저 정보 수정에 성공하였습니다."),
    },
)
auth_modify_userinfo_response2 = Auth.model(
    "Auth_modify_userinfo_fail1",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="유저 정보 수정에 실패하였습니다."),
    },
)
auth_modify_userinfo_response3 = Auth.model(
    "Auth_modify_userinfo_fail2",
    {
        "result": fields.String(example="fail"),
        "msg": fields.String(example="access token이 유효하지 않습니다."),
    },
)


# 유저 정보 수정
@Auth.route("/modify-userinfo", methods=["POST"])
class api_modify_userinfo(Resource):
    @Auth.expect(auth_modify_userinfo_fields)
    @Auth.response(202, "success", auth_modify_userinfo_response1)
    @Auth.response(401, "fail", auth_modify_userinfo_response2)
    @Auth.response(402, "fail", auth_modify_userinfo_response3)
    @token_required
    def post(self):
        """유저 정보를 수정합니다"""
        req = request.get_json()
        payload = get_payload_from_header()
        nick_receive = req["nickname"]
        region_receive = req["region"]
        if payload is None:
            return make_response(
                jsonify({"result": "fail", "msg": "access token이 유효하지 않습니다."}),
                402,
            )
        try:
            id_receive = payload["id"]
            # select 쿼리 실행: request의 name과 동일한 document 찾기
            result = db.user.update_one(
                {"user_id": id_receive},
                {"nick": nick_receive, "region": region_receive},
            )
            if result.matched_count > 0:
                # 데이터를 처리하고 응답 생성
                response_data = {
                    "result": "success",
                    "msg": "유저 정보 수정에 성공하였습니다.",
                }
                return make_response(jsonify(response_data), 202)
            response_data = {
                "result": "fail",
                "msg": "유저 정보 수정에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)
        except:
            response_data = {
                "result": "fail",
                "msg": "유저 정보 수정에 실패하였습니다.",
            }
            return make_response(jsonify(response_data), 401)


'''
# 보안: 로그인한 사용자만 통과할 수 있는 API # 얘는 아마 안 쓸 것 같음
@Auth.route("/isAuth", methods=["POST"])
class api_valid(Resource):
    def post(self):
        """미사용 예정인 API"""
        req = request.get_json()
        token_receive = req.cookies["access_token"]
        try:
            # token을 시크릿키로 디코딩
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
            # payload 안에 id가 들어으므로 이 id로 유저정보를 찾기
            """ 토큰만 유효하면 되기 때문에 필요 없어짐
            userinfo = db.user.find_one({"id": payload["id"]}, {"_id": 0})
            if userinfo != None:
                return jsonify({"result": "success"})  # , 'nickname': userinfo['nick']
            return jsonify({"result": "fail", "msg": "로그인 정보가 존재하지 않습니다."})
            """
            return jsonify({"result": "success"})  # , 'nickname': userinfo['nick']
        except jwt.ExpiredSignatureError:
            # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
            return jsonify({"result": "fail", "msg": "로그인 시간이 만료되었습니다."})
        except jwt.exceptions.DecodeError:
            # 로그인 정보가 없으면 에러가 납니다.
            return jsonify(
                {"result": "fail", "msg": "로그인 정보가 존재하지 않습니다."}
            )
'''
