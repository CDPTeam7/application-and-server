from flask import Flask, request, jsonify # flask 관련 라이브러리
from flask_cors import CORS # CORS 미들웨어를 위한 모듈
import pymongo # mongoDB와의 연결을 위한 모듈

client = pymongo.MongoClient(host='localhost', port=27017) # mongoDB와 연결 (http://localhost:27017)
db = client.mongodb_tutorial # mongoDB 내에서 사용할 DB와 연결
app = Flask(__name__) # flask 객체를 생성. __name__은 현재 실행 중인 모듈 이름
CORS(app, supports_credentials=True, resources={r'*': {'origins': 'http://localhost:3000'}})  # CORS 미들웨어 추가

@app.route('/') # 기본서버 127.0.0.1:5000 뒤에 붙는 주소
def home(): # 위의 주소를 호출 시 보여 줄 것을 함수로 작성
   return 'EC2 Flask Test' # 예제 코드

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data}
    return jsonify(response_data)

@app.route('/api/point/check', methods=['POST'])
def CheckPoint():
    data1 = request.get_json() # api를 요청한 서버에서 보낸 json파일 저장
    data2 = db.people.find_one({"name": data1["name"]}) # select 쿼리 실행: request의 name과 동일한 document 찾기
    if (data2 != None): data2["_id"] = str(data2["_id"]) # 찾은 값이 있을 때만 id를 Objectid에서 str로 변경
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data1, 'result_one': data2} # 전달할 데이터 묶기 
    return jsonify(response_data) # json형태로 전달

@app.route('/api/point/add', methods=['POST'])
def AddPoint():
    data1 = request.get_json()
    data3 = db.people.update_one({"name": data1["name"]}, {"$inc": {"score": data1["score"]}}) # update 쿼리 실행: request의 name과 동일한 document에서 score 속성 값을 기존 값에서 request의 score 값만큼 증가(inc)
    data2 = db.people.find_one({"name": data1["name"]})
    if (data2 != None): data2["_id"] = str(data2["_id"])
    # 데이터를 처리하고 응답 생성
    response_data = {'message': 'Data received successfully', 'received_data': data1, 'result_one': data2}
    return jsonify(response_data)

if __name__ == '__main__': # 이 파일이 직접 실행되야만 해당 코드 실행
   app.run('0.0.0.0', port=5000, debug=True)
