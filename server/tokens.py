import jwt
import datetime
from database import db
import os
from dotenv import load_dotenv


# 전처리
load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")
JWT_ALGORITHMS = os.environ.get("JWT_ALGORITHMS")


# access token or refresh token을 만들어주는 함수
def generate_token(payload, type):
    if type == "access":
        # 2시간
        exp = datetime.datetime.utcnow() + datetime.timedelta(seconds=30)
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
        userinfo = db.user.find_one({"id": payload["id"]}, {"_id": 0})
        # print(userinfo, refresh_token)
        if userinfo is None or userinfo["refresh_token"] != refresh_token:
            payload = None
    except jwt.InvalidTokenError:  # 토큰이 만료된 경우 또는 없는 경우
        payload = None

    return payload
