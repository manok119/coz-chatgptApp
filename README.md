# aws 서버리스 기반 ChatGPT 앱
### 아키텍쳐
![image](https://user-images.githubusercontent.com/96624366/229686479-5e7494b2-8787-4768-9ac1-622ba318dccd.png)


### 사전 준비사항
1. aws 계정
2. 도메인 
3. aws cli 세팅
```
export AWS_ACCESS_KEY_ID= #입력
export AWS_SECRET_ACCESS_KEY= #입력
export AWS_DEFAULT_REGION=us-northeast-2
export AWS_PROFILE= # 입력

# configure를 확인합니다
aws configure list
--------------------------
Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                manok119             None    None
access_key     ****************ABCD  shared-credentials-file    
secret_key     ****************ABCD  shared-credentials-file    
    region                us-northeast-2             env    AWS_DEFAULT_REGION
```

3. OPENAI API 키 발급

### 백앤드 세팅  및 실행(/coz-chatgpt-backend)
1. 발급된 api키를 백엔드 폴더의 serverless.yaml 파일 20번째 줄 OPENAPI_APIKEY: # 채워넣으세요.
```
OPENAPI_APIKEY: # 채워넣으세요.
```
2. 실행
```
serverless deploy --aws-profile 프로필명 
```
3. 디플로이가 완성된 뒤 나오는 엔드포인트를 유의하세요
```
...
endpoints:
    wss://15qleu33.execute-api.ap-northeast-2.com/dev/chat
    GET - https://22didjxofh.execute-api.ap-northeast-2.com/dev.chat 
    PUT - https://22didjxofh.execute-api.ap-northeast-2.com/dev.chat

```
이 과정까지 진행하면 aws 계정에 람다2개, api-gateway2개, sqs, dynamodb가 생성이 됩니다. 

### 프론트엔드 준비(/coz-chatgpt-frontend)
1. 환경변수 입력
위에서 wss는 웹소켓입니다. .execute 앞부분 (15qleu33)의 값을 프론트 엔드 환경 변수에 넣어야 합니다.     
또한 아래 GET과 PUT 으로 되어 있는 엔드포인트의 앞부분도 환경변수에 넣어야 합니다. 
```
NODE_PATH=src
REACT_APP_API_PATH=22didjxofh
REACT_APP_SOCKET_API_PATH=15qleu33
```
2. 리액스 환경에 필요한 모듈 설치 
3. npm start로 실행 

    http://locahost:3000 확인


### 프론트엔드 빌드
프론트엔드 실행을 확인한 수 정적 웹사이트를 aws S3에 호스팅 합니다. 
위 과정은 해당 유어클래스 내용을 참고하세요.
1. 정적웹사이트 호스팅

https://urclass.codestates.com/content/4d1d95bd-cd70-4c44-9765-a70f4dd45d0c?playlist=1005

2. 클라우드 프론트

https://urclass.codestates.com/content/0810be94-299d-4764-bbfb-70cc1c30416c?playlist=1005

3. 호스팅영역에 레코드 생성

https://urclass.codestates.com/content/a77f8072-d0a0-4247-a3c3-c8759247670e?playlist=1005
