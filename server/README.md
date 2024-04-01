# script

## poetry 설치

- macOS: $ brew install poetry
- linux
  - 첫번째 방법: $ curl -sSL https://install.python-poetry.org | python3 -
  - 두번째 방법: $ pip3 install poetry
- windows:
  - powershell에서 다음 명령 실시: $ (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -

## pyproject.toml 파일 생성

- $ poetry init

## 패키지 설치

- $ poetry add [패키지명]

## 설치된 패키지 목록 확인

- $ poetry show

## 패키지 삭제

- $ poetry remove [패키지명]

## 파이썬 파일 실행

- $ poetry run python3 [파이썬파일명]
- $ poetry run python .\src\server\server.py

## pyproject.toml에 기재된 의존성 설치

- $ poetry install

## 의존성의 최신 버전을 얻고 poetry.lock 업데이트

- $ poetry update

## poetry 환경 확인

- $ poetry env info

## 가상환경 생성

- $ poetry env use $PYTHON_HOME/bin/python3

## poetry 파이썬 버전 변경

- $ poetry env use /path/to/preferred/python/version
  - 예시: $ poetry env use /Library/Developer/CommandLineTools/usr/bin/python3.9

## 가상환경 삭제

- $ poetry env remove $PYTHON_HOME/bin/python3

## 가상환경 접속

- $ poetry shell

## 가상환경 정보 확인

- $ poetry env info

## 가상환경 삭제

- $ poetry env remove $PYTHON_HOME/bin/python3
