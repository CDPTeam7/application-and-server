import pymongo  # mongoDB와의 연결을 위한 모듈

# mongoDB와 연결 (http://localhost:27017)
client = pymongo.MongoClient(host="localhost", port=27017)
db = client.mongodb_tutorial  # mongoDB 내에서 사용할 DB와 연결
