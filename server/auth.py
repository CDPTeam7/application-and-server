# from flask_cors import CORS # CORS 미들웨어를 위한 모듈
from flask import request, jsonify  # flask 관련 라이브러리
from flask_restx import Resource, Namespace  # Api 구현을 위한 Api 객체 import
import hashlib  # 비밀번호 암호화를 위한 모듈
import jwt  # jwt 토큰을 발급하기 위한 모듈
from tokens import *
from database import db

# 전처리
Auth = Namespace(
    name="Auth",
    description="login 관련 API",
)
SECRET_KEY = "b_4(!id8ro!1645n@ub55555hbu93gaia0"  # 테스트용 secret key
JWT_ALGORITHM = "HS256"  # 암호화할 때 쓸 알고리즘


# 회원가입
@Auth.route("/signup", methods=["POST"])
class api_register(Resource):
    def post(self):
        req = request.get_json()
        id_receive = req["user_id"]
        pw_receive = req["user_pw"]
        # nickname_receive = request.form['user_nickname'] # nickname은 나중에 처리
        pw_hash = hashlib.sha256(
            pw_receive.encode("utf-8")
        ).hexdigest()  # password는 암호화해서 저장
        # print(id_receive, pw_receive, pw_hash)
        # 이미 존재하는 아이디면 패스
        result = db.user.find_one({"id": id_receive})
        if result is not None:
            return jsonify({"result": "fail", "msg": "이미 존재하는 ID입니다."})
        else:
            db.user.insert_one(
                {"id": id_receive, "pw": pw_hash, "refresh_token": None}
            )  # , 'nick': nickname_receive # id와 암호화된 pw를 user DB에 저장
            return jsonify({"result": "success"})


# 로그인
@Auth.route("/login", methods=["POST"])
class api_login(Resource):
    def post(self):
        req = request.get_json()
        id_receive = req["user_id"]
        pw_receive = req["user_pw"]
        # 회원가입 때와 같은 방법으로 pw를 암호화
        pw_hash = hashlib.sha256(pw_receive.encode("utf-8")).hexdigest()
        # print(id_receive, pw_receive, pw_hash)
        # id, 암호화된 pw을 가지고 user DB로부터 해당 유저 찾기
        result = db.user.find_one({"id": id_receive, "pw": pw_hash})

        # 찾으면 JWT 토큰을 만들어 발급
        if result is not None:
            try:
                # JWT 토큰 생성
                payload = {"id": id_receive}
                # generate token 함수에 access를 넣어서 access token 발급
                access_token = generate_token(payload, "access")
                payload = {"id": id_receive}
                # generate token 함수에 access를 넣어서 access token 발급
                refresh_token = generate_token(payload, "refresh")
                # token return
                # print(jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"]))
                db.user.update_one(
                    {"id": id_receive}, {"$set": {"refresh_token": refresh_token}}
                )
                return jsonify(
                    {
                        "result": "success",
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                    }
                )

            except Exception as e:
                print(e)
                data = {
                    "results": "fail",
                    "msg": "정상적인 접근이 아닙니다.",
                    "code": "E5000",
                }
                return jsonify(data)
        # 찾지 못하면 fail
        else:
            return jsonify(
                {"result": "fail", "msg": "아이디/비밀번호가 일치하지 않습니다."}
            )


# 보안: 로그인한 사용자만 통과할 수 있는 API # 얘는 아마 안 쓸 것 같음
@Auth.route("/isAuth", methods=["POST"])
class api_valid(Resource):
    def post(self):
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


# access/refresh Token이 유효한지 확인하는 함수
@Auth.route("/checkToken", methods=["POST"])
class api_check_token(Resource):
    def post(self):
        # 요청의 토큰 정보를 받아옴
        token = request.headers.get("Cookie")
        # print(token.split(" "))
        # print(request.headers)
        if token is not None:  # 토큰이 있는 경우
            # access token 유효성 확인
            # print(token)
            access_token = (token.split("; ")[0]).split("=")[1]
            if len(token.split("; ")) > 1:
                refresh_token = (token.split("; ")[1]).split("=")[1]
            payload_access = check_access_token(access_token)
            # print(payload_access)
            if payload_access is None and len(token.split("; ")) > 1:
                # refresh token 유효성 확인
                payload_refresh = check_refresh_token(refresh_token, db)
                if (
                    payload_refresh is None
                ):  # access, refresh token decode 실패 시 401 반환
                    return jsonify({"result": "fail", "err": 401})
                access_token = generate_token(payload_refresh, "refresh")
                return jsonify({"result": "success", "access_token": access_token})
            else:
                return jsonify({"result": "fail", "err": 401})
        else:  # 토큰이 없는 경우 401 반환
            return jsonify({"result": "fail", "err": 401})


# 로그아웃
@Auth.route("/logout", methods=["POST"])
class api_logout(Resource):
    def post(self):
        req = request.get_json()
        token_receive = req["access_token"]
        # print(token_receive)
        payload = check_access_token(token_receive)
        db.user.update_one({"id": payload["id"]}, {"$set": {"refresh_token": None}})
        return jsonify({"result": "success"})
