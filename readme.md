# TCP - Unity 게임 정리

# 일일 퀘스트

---

## 필수 기능

### 프로젝트 생성 및 이벤트 별 코드 처리 - [x]

### 2일차 환경변수 및 상수, 에러 처리 - [x]

### 3일차 프로토콜 버퍼 적용 및 패킷 파싱 - [x]

### 4일차 유저 세션 및 게임 세션 관리 - [x]

### 5일차 접속 및 이동 패킷 교환 - [x]

## 도전 기능

### 6일차 서버 DB 연동 - [x]

### 7일차 클라이언트 DB 연동- [x]

### 8일차 레이턴시 매니저, 추측항법 적용 - [x]

### 9일차 핑 체크 - 클라이언트 - [x]

---

## 예외로 만든 것들

### 1. 게임 시작시 gameId를 uuid로 생성 - 하나의 서버에 하나의 게임임 무조건 존재하되 해당하는 gameId로 조회 가능

### 2. 클라이언트에서 보내는 timestamp 패킷의 타입을 Timestamp로 해서 데이터를 처리해봄

---

# 트러블 슈팅

## 1.클라이언트쪽에서 시작 위치를 변경해야할 때 보낸 data의 JSON.Stringfiy타입을 Deserialize 하지 못하는 문제가 발생했다.

해결 방안: 패킷을 JSON.Stringfiy로 변환하는 데이터를 encode방식으로 변환하여 보내줌으로써 해결하였다.

## 2.클라이언트에서 보내는 Timestamp 타입에 대해서 Seconds.low와 nanos로 데이터가 나눠져서 오게되어 제대로 된 레이턴시 계산이 되지 않는 문제가 발생하였다.

해결 방안:
// 1. seconds 부분을 밀리초 단위로 변환
const secondsInMillis = data.timestamp.seconds.low \* 1000;

// 2. nanos 부분을 밀리초 단위로 변환
const nanosInMillis = data.timestamp.nanos / 1000000;

// 3. 두 값을 합쳐 최종 밀리초 단위 타임스탬프 생성
const timestampInMillis = secondsInMillis + nanosInMillis;

방식을 적용하여 Timestamp를 다시 구성하여 비교하는 방식으로 해결하였다.


---

# 기능 정리

manager - latencyManager -> 레이턴시 관련 매니저
나머지 매니저는 사용하지 않음.


models  
   user.class.js -> 유저 클래스
    - 주요 함수
        / updatePosition => 마지막 위치 저장 및 유저의 x,y 변경
        / calculateLocation => 레이턴시를 계산하여 유저의 다음 위치(x,y)를 계산
        / ping => 현재 시간과 레이턴시를 클라이언트에 보내주는 역할
        / pong => 클라이언트에서 보내온 timestamp를 받아 서버의 레이턴시를 업데이트 한다.
   game.class.js -> 게임 클래스
    - 주요 함수
        - addUser => 받은 유저를 게임세션에 추가 및 user의 ping을 시작시킴
        - getUser => id에 해당하는 유저를 찾음
        - removeUser => id에 해당하는 유저를 찾아서 지움
        - getMaxLatency => 유저들중에 최대 레이턴시를 계산함
        - getAllLocation => 자신을 제외한 다른 유저들의 위치를 레이턴시를 적용한 추측항법으로 계산하여 보내줌
    
config - env나 DB 관련 상수들을 중앙 집중식으로 관리


constants
    - env.js => env 관련 상수들 정리
    - handlerIds.js => 핸들러 아이디 관련 정리
    - header.js => 헤더에 들어가는 전체크기, 패킷 크기 / 패킷 타입 관련 정리


DB
  migration 
    - createSchema => 유저 관련 스키마 생성
  sql - DB 관련 sql문 저장
  user 
    - user_db.js => 유저 DB 관련 함수들 정리
       - 주요 함수
            - findUserByDeviceId => deviceId로 유저를 찾음
            - findUserByDBId => id로 유저를 찾음
            - createUser => 유저를 생성함 (이때 유저의 id는 uuid)
            - updateUserLogin => 유저가 로그인시 마지막로그인시간을 업데이트 해줌
            - updateEndLocation => 게임 종료시 현재 유저의 위치를 업데이트 해줌
    - userqueries.js => user_db.js에서 사용하는 함수들의 쿼리를 정리해둠
    - database.js => mysql pool을 만들어 DB와 연결을 지속시킴

event
    - onConnection.js => 서버에서 커넥션 및 커넥션 연결
    - onData.js => 서버에서 데이터가 들어왔을 경우에 호출되어 들어온 버퍼에 대한 처리를 함
    - onEnd.js => 클라이언트에서 종료 요청시 호출되어 현재 유저의 위치를 저장하고 게임세션과 유저세션에서 데이터를 지우고 돌아가던 인터벌을 종료시킴
    - onError.js => 윈도우에서 클라이언트를 정상종료하더라도 에러가 발생하는 경우가 생기므로 이를 처리하기 위해 onEnd와 같은 역할을 한다.


handlers
   game 
     - location.handlers.js => 위치 핸들러 아이디로 요청이 들어왔을 떄 위치관련 처리
     - ping.handlers.js => 핑 핸들러 아이디로 요청이 들어왔을 떄 pong 호출 
   user   
     - initial.handler.js => 로그인 핸들러 아이디로 요청이 들어왔을 때 유저,게임 생성 처리 및 클라이언트에게 로그인시 유저 위치를 보내줌
   index.js => 핸들러를 종합적으로 관리함, 핸들러 아이디나, 핸들러에 해당하는 protoType를 얻는 함수가 있다.


init => 서버 시작시 proto 파일들을 로드하는 폴더


protobuf => 각종 프로토들을 모아둠( 보내온 패킷에 대한 인코딩, 디코딩 역할)


sessions => 유저와 게임 세션에 대한 정보 저장하는 폴더


utils => 에러 처리나 패킷에 대한 파싱과 같은 각종 유틸관련 처리를 하는 폴더
    - notification
        - gameNotification.js => 게임 관련 처리
            - makeNotificaitonPacket => 헤더를 추가하여 패킷을 만듬
            - createLocationPacket => 유저 정보를 받아서 message를 만들어 makeNotificaitonPacket에 보냄
            - createPingPacket => 현재 시간을 받아서 레이턴시와 현재 시간을 보내줌
