import pymongo  # mongoDB와의 연결을 위한 모듈
import os
from dotenv import load_dotenv


load_dotenv()
USER_NAME = os.environ.get("USER_NAME")
PASSWORD = os.environ.get("PASSWORD")


# mongoDB와 연결 (http://localhost:27017)
# client = pymongo.MongoClient(host="localhost", port=27017)

# mongoDB atlas와 연결
mongoDB_URL = f"mongodb+srv://{USER_NAME}:{PASSWORD}@cluster0.ykmf0na.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(mongoDB_URL)
db = client.CDP  # mongoDB 내에서 사용할 DB와 연결

# print(db.user.find_one())
