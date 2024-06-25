import jwt
from flask import request, jsonify, make_response  # flask 관련 라이브러리
import datetime
from database import db
import os
from dotenv import load_dotenv
from functools import wraps


# 전처리
load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")
JWT_ALGORITHMS = os.environ.get("JWT_ALGORITHMS")


# access token or refresh token을 만들어주는 함수
def generate_token(payload, type):
    if type == "access":
        # 2시간
        exp = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    elif type == "refresh":
        # 2주
        exp = datetime.datetime.utcnow() + datetime.timedelta(weeks=2)
    else:
        raise Exception("Invalid tokenType")

    payload["exp"] = exp
    payload["iat"] = datetime.datetime.utcnow()
    encoded = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return encoded


# access token이 유효한지를 확인하는 함수
def check_access_token(access_token):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        """ 토큰에 대한 시간 계산은 알아서 해줌 
        if payload["exp"] < datetime.datetime.utcnow().timestamp():  # 토큰이 만료된 경우
            payload = None
        """
    except jwt.InvalidTokenError:  # 토큰이 만료된 경우 또는 없는 경우
        payload = None

    return payload


# access token이 유효한지를 확인하는 함수
def check_refresh_token(refresh_token):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
        """ 토큰에 대한 시간 계산은 알아서 해줌
        if payload["exp"] < datetime.datetime.utcnow().timestamp():  # 토큰이 만료된 경우
            payload = None
        else:
        """
        userinfo = db.token.find_one({"refresh_token": refresh_token}, {"_id": 0})
        # print(userinfo, refresh_token)
        if userinfo is None:
            payload = None
        else:
            payload["id"] = userinfo["user_id"]
    except jwt.InvalidTokenError:  # 토큰이 만료된 경우 또는 없는 경우
        payload = None

    return payload


# decorator for auth
def token_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Cookie")
        if token is not None:  # 토큰이 있는 경우
            # access token 유효성 확인
            access_token = (token.split("; ")[0]).split("=")[1]
            if len(token.split("; ")) > 1:
                refresh_token = (token.split("; ")[1]).split("=")[1]
            payload_access = check_access_token(access_token)
            # print(payload_access)
            if payload_access is None and len(token.split("; ")) > 1:
                # refresh token 유효성 확인
                payload_refresh = check_refresh_token(refresh_token)
                if payload_refresh is None:
                    # access, refresh token decode 실패 시 401 반환
                    return make_response(
                        jsonify(
                            {
                                "result": "ERROR_TOKEN_NOT_EXIST",
                                "msg": "access token, refresh token이 없습니다.",
                            }
                        ),
                        401,
                    )
            elif payload_access is None:
                return make_response(
                    jsonify(
                        {
                            "result": "ERROR_TOKEN_NOT_EXIST",
                            "msg": "access token, refresh token이 없습니다.",
                        }
                    ),
                    401,
                )
        else:  # 토큰이 없는 경우 401 반환
            return make_response(
                jsonify(
                    {
                        "result": "ERROR_TOKEN_NOT_EXIST",
                        "msg": "access token, refresh token이 없습니다.",
                    }
                ),
                401,
            )
        return func(*args, **kwargs)

    return decorated_function


# header에 있는 token으로부터 payload 정보 가져오기
def get_payload_from_header():
    token = request.headers.get("Cookie")
    if token is not None:  # 토큰이 있는 경우
        # access token 유효성 확인
        access_token = (token.split("; ")[0]).split("=")[1]
        if len(token.split("; ")) > 1:
            refresh_token = (token.split("; ")[1]).split("=")[1]
        payload_access = check_access_token(access_token)
        # print(payload_access)
        if payload_access is not None:
            return payload_access
        if payload_access is None and len(token.split("; ")) > 1:
            # refresh token 유효성 확인
            payload_refresh = check_refresh_token(refresh_token)
            if payload_refresh is not None:
                # access, refresh token decode 실패 시 401 반환
                return payload_refresh
            return None
        else:
            return None
    else:  # 토큰이 없는 경우 401 반환
        return None
