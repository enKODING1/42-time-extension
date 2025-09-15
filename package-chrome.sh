#!/bin/bash

# Chrome용 42time 확장 패키징 스크립트

echo "🟡 Chrome용 42time 확장 패키징 시작..."

# variable 파일 확인
if [ ! -f "variable" ]; then
	echo "❌ variable 파일이 존재하지 않습니다. 이 파일에 필요한 변수를 설정해야 합니다."
	exit 1
fi
source variable
# VERSION 확인
if [ -z "$VERSION" ]; then
	echo "❌ VERSION 변수가 설정되지 않았습니다. variable 파일을 확인하세요."
	exit 1
fi

# 패키지 이름과 버전
PACKAGE_NAME="42time-chrome"
OUTPUT_FILE="${PACKAGE_NAME}-v${VERSION}.zip"

# 기존 패키지 파일 제거
if [ -f "$OUTPUT_FILE" ]; then
    echo "기존 패키지 파일 제거: $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# 임시 디렉토리 생성
TEMP_DIR=$(mktemp -d)
echo "임시 디렉토리 생성: $TEMP_DIR"

# 필요한 파일들만 복사
echo "필요한 파일들 복사 중..."
# Chrome용 manifest.json 생성 (service_worker 사용, browser_specific_settings 제거)
cat > "$TEMP_DIR/manifest.json" << EOF
{
  "manifest_version": 3,
  "name": "42 time",
  "version": "$VERSION",
  "description": "42 time manager",
  "default_locale": "en",
  "host_permissions": [
    "https://profile-v3.intra.42.fr/*",
    "https://profile.intra.42.fr/*",
    "https://translate.intra.42.fr/*"
  ],
  "permissions": ["tabs", "activeTab", "storage"],
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://profile-v3.intra.42.fr/*",
        "https://profile.intra.42.fr/*"
      ],
      "js": ["common-utils.js", "content.js"],
      "run_at": "document_end"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": "icons/icon128.png"
  },
  "options_ui": {
    "page": "option/options.html",
    "open_in_tab": true
  }
}
EOF
cp background.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp common-utils.js "$TEMP_DIR/"
cp -r popup "$TEMP_DIR/"
cp -r option "$TEMP_DIR/"
cp -r icons "$TEMP_DIR/"
cp -r _locales "$TEMP_DIR/"

# README 파일 포함 (선택사항)
if [ "$1" = "--include-readme" ]; then
    cp README_CHROME.md "$TEMP_DIR/"
    echo "README 파일 포함됨"
fi

# zip 파일 생성
echo "ZIP 파일 생성 중: $OUTPUT_FILE"
cd "$TEMP_DIR"
zip -r "../$OUTPUT_FILE" . -x "*.DS_Store*" "*.git*"
cd - > /dev/null

# 생성된 파일을 현재 디렉토리로 이동
mv "$TEMP_DIR/../$OUTPUT_FILE" "./"

# 임시 디렉토리 정리
rm -rf "$TEMP_DIR"

# 파일 크기 확인
FILE_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE")
FILE_SIZE_KB=$((FILE_SIZE / 1024))

echo "✅ 패키징 완료!"
echo "📦 파일명: $OUTPUT_FILE"
echo "📊 파일 크기: ${FILE_SIZE_KB}KB"
echo ""
echo "🚀 Chrome에서 테스트하는 방법:"
echo "1. chrome://extensions/ 페이지로 이동"
echo "2. '개발자 모드' 활성화"
echo "3. '압축해제된 확장 프로그램을 로드합니다' 클릭"
echo "4. 압축 해제된 확장 프로그램 폴더 선택"
echo ""
echo "📤 Chrome 웹 스토어에 업로드 준비 완료!"
echo ""
echo "💡 Chrome 웹 스토어 업로드 시 참고사항:"
echo "- 개발자 계정 등록 필요 (일회성 5달러 등록비)"
echo "- 개인정보처리방침 URL 필요할 수 있음"
echo "- 스크린샷 및 상세 설명 준비 필요"