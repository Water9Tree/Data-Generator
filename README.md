## Data Generator
데이터 생성기와 알림 동작을 수행하는 서버입니다.

### 데이터 생성기의 동작

<img width="500" alt="image" src="https://github.com/Water9Tree/Data-Generator/assets/78250089/563bf430-7260-4cc6-9749-6feaf1b96190">

1. Data Generator Pool은 주기적으로 DB에 저장된 전체 가로등/쓰레기통 정보를 가져옵니다.
2. 그 후 Data Generator Pool은 추가되거나 삭제된 가로등/쓰레기통이 있는 지 확인하고,
3. 추가된 가로등/쓰레기통은 새로운 Data Generator와 1:1로 매핑해주고,
4. 삭제된 가로등/쓰레기통의 Data Generator는 삭제해줍니다.

### 알림 동작

<img width="500" alt="image" src="https://github.com/Water9Tree/Data-Generator/assets/78250089/85c5a41a-8aa2-4a2a-bd95-9c4ab0f928b8">

1. 먼저 모바일, 리액트 네이티브에서 엑스포 노티피케이션이라는 라이브러리를 통해 토큰을 발급 받습니다.
2. 이렇게 발급 받은 토큰은 로그인 시에 백엔드(해당 데이터 생성기 앱)으로 전달 해주고,
3. 백엔드에서는 이 토큰을 송신할 메시지와 함께 Expo Back-end로 전달하게 됩니다.
4. 안드로이드에서 이 알림을 모바일에 보내기 위해 FCM을 사용하게 되고, 이 FCM이 Push 알림을 수행하여 사용자에게 푸시 알림이 제공됩니다.


### How to Deploy

1. root path에 `.env` 파일 추가
```dotenv
# 예시
MONGODB_URL={{ mongodb://localhost:27017 }}
```

2. 필요한 패키지 설치 (`npm v8.19.2`)
```bash
$ npm install
```

3. production 배포
```bash
$ npm run start:prod
```
