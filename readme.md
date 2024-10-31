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
