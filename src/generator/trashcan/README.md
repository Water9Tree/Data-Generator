# 데이터 생성기

실제론 LoRaWAN으로 데이터를 받아와야 하지만, \
LoRaWAN까지 프로젝트에 담기엔 무리가 있어 데이터 생성기로 대신함.

## mongodb & cron

MongoDB 내부에서 CRON을 돌려 데이터를 생성하려 했지만, \
[MongoDB 3.2 이상 버전에선 더이상 cron을 지원하지 않아서](https://stackoverflow.com/a/36291780) 애플리케이션에서 데이터 생성.

> cron job을 이용하기 때문에 1초보다 빠른 주기로 돌 순 없음.

## 쓰레기통 데이터 채움 로직

매초마다 수행

1. 랜덤한 빌딩의 랜덤한 층수 하나를 선택.
2. 랜덤한 층수의 쓰레기통에 쓰레기를 채우거나 비움.
    - 쓰레기통 percent < 80%: 50%확률로 쓰레기 증가 or 유지
    - 80% < 쓰레기통 percent < 100% : 10%확률로 쓰레기 비우거나 45%확률로 쓰레기 증가 or 유지
    - 100% == 쓰레기통 percent: 10% 확률로 비우거나 90% 확률로 유지


