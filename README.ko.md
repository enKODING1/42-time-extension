# 42-time-extension

[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/42-time/mkcopllnpeelmaigfccokdclgaefnjoe?authuser=3&hl=ko)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/42-time/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

**Language / 언어**: [English](README.md) | [한국어](README.ko.md)

---

설치 후 프로필 캘린더를 확인해보세요! 42-time은 42 인트라에서 월별 누적 로그인 시간을 시각적으로 표시하는 크로스 브라우저 확장 프로그램입니다. 이 확장 프로그램은 42 School 인트라넷에서 월별 누적 학습 시간을 쉽게 확인할 수 없는 문제를 해결하기 위해 만들어졌습니다.
<br>
<img width="173" alt="intra-original" src="https://github.com/user-attachments/assets/1aceb15b-7392-42cc-b9e3-1bfe4cf68836" />
<br>
<img width="200" alt="intra-v3" src="https://github.com/user-attachments/assets/83d6abf9-d905-4aa3-963f-0498ec8ceb5d" />

## 주요 기능

- **크로스 브라우저 지원**: Chrome과 Firefox 모두에서 작동
- ⏱️ **시간 추적**: 42 인트라 페이지에서 월별 누적 로그인 시간(시간/분) 표시
- **프로필 v3 지원**: 기존 및 새로운 42 인트라 프로필과 호환
- **다국어 지원**: 6개 언어 지원 (EN, KO, JA, AR, FR, IT)

## 설치 방법

### Chrome

1. 이 저장소를 클론하거나 zip 파일로 다운로드하세요.
2. `npm run build` 실행
3. Chrome 브라우저에서 `chrome://extensions`로 이동
4. 우측 상단에서 **개발자 모드** 활성화
5. **압축해제된 확장 프로그램을 로드합니다** 클릭 후 `dist` 폴더 선택

### Firefox

1. 이 저장소를 클론하거나 zip 파일로 다운로드하세요.
2. Firefox 버전 빌드: `npm run build:firefox`
3. Firefox 브라우저에서 `about:debugging`으로 이동
4. 좌측 사이드바에서 **This Firefox** 클릭
5. **Load Temporary Add-on** 클릭 후 `dist/manifest.json` 선택

## 사용법

1. 42 인트라(https://intra.42.fr)에 로그인
2. 월별 누적 로그인 시간이 인트라 내에서 자동으로 표시됩니다

## 개발 환경

- TypeScript
- Webpack
- ESLint & Prettier
- 크로스 브라우저 호환성 레이어

## 개발 및 빌드

```bash
npm install

# Chrome용
npm run build

# Firefox용
npm run build:firefox

# 개발 모드
npm run dev        # Chrome
npm run dev:firefox # Firefox

# 코드 품질
npm run lint       # 린팅 오류 확인
npm run lint:fix   # 린팅 오류 자동 수정
npm run format     # Prettier로 코드 포맷팅
npm run format:check # 코드 포맷팅 확인
```

- 빌드 출력은 `dist/` 폴더에 생성됩니다

## 기여하기

1. 이슈나 PR을 통해 피드백이나 제안을 자유롭게 남겨주세요

## 라이선스

MIT

---

질문과 피드백은 언제나 환영합니다!
