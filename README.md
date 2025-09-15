# 42 Time

42 학습자들을 위한 월별 학습시간 추적 브라우저 확장 프로그램

## 🚀 기능

- **월별 학습시간 확인**: 42 Intra 프로필 페이지에서 월별 누적 학습시간을 쉽게 확인
- **다국어 지원**: 한국어, 영어, 일본어 지원
- **실시간 업데이트**: 42 Intra 시스템과 실시간 동기화
- **간편한 액세스**: 브라우저 툴바에서 원클릭 접근

## 📦 설치

### Chrome / Edge
1. 이 저장소를 클론하거나 다운로드합니다
2. Chrome에서 `chrome://extensions/` 페이지를 엽니다
3. "개발자 모드"를 활성화합니다
4. "압축해제된 확장 프로그램을 로드합니다"를 클릭하고 프로젝트 폴더를 선택합니다

### Firefox
1. 이 저장소를 클론하거나 다운로드합니다
2. `./package-firefox.sh` 스크립트를 실행하여 Firefox용 패키지를 생성합니다
3. Firefox에서 `about:debugging` 페이지를 엽니다
4. "임시 부가 기능" 섹션에서 생성된 패키지를 로드합니다

## 🔧 개발

### 프로젝트 구조
```
42time/
├── manifest.json          # 확장 프로그램 설정
├── background.js          # 백그라운드 서비스 워커
├── content.js            # 콘텐츠 스크립트
├── common-utils.js       # 공통 유틸리티 함수
├── popup/               # 팝업 UI
│   ├── popup.html
│   ├── popup.js
│   └── style.css
├── option/              # 설정 페이지
│   ├── options.html
│   ├── options.js
│   └── options.css
├── icons/               # 확장 프로그램 아이콘
├── _locales/            # 다국어 지원 파일
│   ├── en/
│   ├── ko/
│   └── ja/
└── modules/             # 추가 모듈
```

### 개발 환경 설정

#### 필수: variable 파일 설정
개발 및 빌드를 위해서는 프로젝트 루트에 `variable` 파일을 생성해야 합니다:

```bash
# variable 파일 예시
VERSION="1.2.3"
FIREFOX_ADDON_ID="{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}"
```

- `VERSION`: 확장 프로그램 버전 번호
- `FIREFOX_ADDON_ID`: Firefox 애드온 고유 ID (UUID 형식)

⚠️ **중요**: `variable` 파일이 없으면 빌드 스크립트가 정상적으로 작동하지 않습니다.

### 빌드 및 패키징

#### Chrome용 패키징
```bash
./package-chrome.sh
```

#### Firefox용 패키징
```bash
./package-firefox.sh
```

### 지원 브라우저
- Chrome (Manifest V3)
- Firefox (최소 버전: 109.0)
- Edge (Chromium 기반)

## 🌐 지원 사이트

- `https://profile-v3.intra.42.fr/*`
- `https://profile.intra.42.fr/*`
- `https://translate.intra.42.fr/*`

## 📋 권한

이 확장 프로그램은 다음 권한을 요청합니다:
- `tabs`: 활성 탭 정보 접근
- `activeTab`: 현재 활성화된 탭과 상호작용
- `storage`: 사용자 설정 저장

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 관련 링크

- [42 Seoul](https://42seoul.kr/)
- [42 Intra](https://intra.42.fr/)
- [Issues & Feedback](https://github.com/your-username/42time/issues)

## 📊 버전 정보

현재 버전: v1.2.2

### 주요 업데이트
- 다국어 지원 추가
- UI/UX 개선
- 성능 최적화
- 버그 수정

---

*42 Time으로 효율적인 학습시간 관리를 시작하세요!* 🎯