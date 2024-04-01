from flask import Flask, request, jsonify # flask 관련 라이브러리
#from flask_cors import CORS # CORS 미들웨어를 위한 모듈
import pymongo # mongoDB와의 연결을 위한 모듈
import hashlib # 비밀번호 암호화를 위한 모듈
import datetime # JWT를 발급할 때 속성으로 같이 줄 시간을 위한 모듈
import jwt # jwt 토큰을 발급하기 위한 모듈

# 전처리
client = pymongo.MongoClient(host='localhost', port=27017) # mongoDB와 연결 (http://localhost:27017)
db = client.mongodb_tutorial # mongoDB 내에서 사용할 DB와 연결
app = Flask(__name__) # flask 객체를 생성. __name__은 현재 실행 중인 모듈 이름
#CORS(app, supports_credentials=True, resources={r'*': {'origins': 'http://localhost:3000'}})  # CORS 미들웨어 추가
SECRET_KEY = "b_4(!id8ro!1645n@ub55555hbu93gaia0" # 테스트용 secret key

#API 테스트용
@app.route('/') # 기본서버 127.0.0.1:5000 뒤에 붙는 주소
def home(): # 위의 주소를 호출 시 보여 줄 것을 함수로 작성
   return 'EC2 Flask Test' # 예제 코드

#API 테스트용2
@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

#POST API 테스트용
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data}
    return jsonify(response_data)

# point check API call route
@app.route('/api/point/check', methods=['POST'])
def CheckPoint():
    data1 = request.get_json() # api를 요청한 서버에서 보낸 json파일 저장
    data2 = db.people.find_one({"name": data1["name"]}) # select 쿼리 실행: request의 name과 동일한 document 찾기
    if (data2 != None): data2["_id"] = str(data2["_id"]) # 찾은 값이 있을 때만 id를 Objectid에서 str로 변경
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data1, 'result_one': data2} # 전달할 데이터 묶기 
    return jsonify(response_data) # json형태로 전달

# point add API call route
@app.route('/api/point/add', methods=['POST'])
def AddPoint():
    data1 = request.get_json()
    data3 = db.people.update_one({"name": data1["name"]}, {"$inc": {"score": data1["score"]}}) # update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc)
    data2 = db.people.find_one({"name": data1["name"]})
    if (data2 != None): data2["_id"] = str(data2["_id"])
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data1, 'result_one': data2}
    return jsonify(response_data)

# 회원가입
@app.route('/api/auth/signup', methods=['POST'])
def api_register():
    req = request.get_json()
    id_receive = req['user_id']
    pw_receive = req['user_pw']
    #nickname_receive = request.form['user_nickname'] # nickname은 나중에 처리
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest() # password는 암호화해서 저장
    #print(id_receive, pw_receive, pw_hash)
    # 이미 존재하는 아이디면 패스
    result = db.user.find_one({'id': id_receive})
    if result is not None:
        return jsonify({'result': 'fail', 'msg': '이미 존재하는 ID입니다.'})
    else:
        db.user.insert_one({'id': id_receive, 'pw': pw_hash}) # , 'nick': nickname_receive # id와 암호화된 pw를 user DB에 저장
        return jsonify({'result': 'success'})

# 로그인
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    req = request.get_json()
    id_receive = req['user_id']
    pw_receive = req['user_pw']
    # 회원가입 때와 같은 방법으로 pw를 암호화
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    #print(id_receive, pw_receive, pw_hash)
    # id, 암호화된 pw을 가지고 user DB로부터 해당 유저 찾기
    result = db.user.find_one({'id': id_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급
    if result is not None:
        # JWT 토큰 생성
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=60 * 60) # 1시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # token return
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면 fail
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

# 보안: 로그인한 사용자만 통과할 수 있는 API # 아직 프론트 쪽에서 구현은 하지 않았음
@app.route('/api/auth/isAuth', methods=['POST'])
def api_valid():
    req = request.get_json()
    token_receive = req.cookies['accessToken']
    try:
        # token을 시크릿키로 디코딩
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # payload 안에 id가 들어으므로 이 id로 유저정보를 찾기
        userinfo = db.user.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success'}) # , 'nickname': userinfo['nick']
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        # 로그인 정보가 없으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})

# refresh token도 구현할 예정이나, 아직 구현하지는 않았음

'''
# 로그아웃
@app.route('/api/auth/logout', methods=['GET'])
function logout() {
    $.removeCookie('mytoken');
}
'''

if __name__ == '__main__': # 이 파일이 직접 실행되야만 해당 코드 실행
   app.run('0.0.0.0', port=8080, debug=True)
