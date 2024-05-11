## poetry 설치

- macOS: $ brew install pipenv
- linux: $ pip3 install pipenv
- windows: $ pip install pipenv

## 가상환경 생성

- $ pipenv --python 3.11

- python 3.11 버전이 설치되어 있어야 합니다. 

## 패키지 설치

- $ pipenv install [패키지명]

## 설치된 패키지 목록 확인

- $ pipenv graph

## 패키지 삭제

- $ pipenv uninstall [패키지명]

## 파이썬 파일 실행

- $ pipenv run python3 [파이썬파일명]
- $ pipenv run python .\server\server.py

## Pipfile에 기재된 의존성 설치

- $ pipenv install

## 의존성의 최신 버전을 얻고 Pipfile.lock 업데이트

- $ pipenv update

## 가상환경 삭제

- $ pipenv --rm

## 가상환경 접속

- $ pipenv shell
