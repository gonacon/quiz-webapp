# 퀴즈 웹 애플리케이션

다양한 과목과 학년별 퀴즈를 풀 수 있는 React 기반 웹 애플리케이션입니다. MongoDB Realm을 백엔드로 사용하여 동적으로 문제 세트를 관리하며, GitHub Pages를 통해 배포됩니다.

## ✨ 주요 기능

-   학년, 학기, 시험 종류, 과목별 문제 필터링 기능
-   MongoDB Realm과 연동하여 동적 문제 세트 로딩
-   과목별 이용 가능한 문제 세트 개수 표시
-   객관식 및 주관식 문제 유형 지원
-   문제 풀이 후 정답 확인 및 채점 기능
-   Tailwind CSS를 이용한 반응형 UI
-   GitHub Actions를 통한 자동 배포

## 🚀 기술 스택

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: MongoDB Realm (Web SDK)
-   **Deployment**: GitHub Actions, GitHub Pages

## ⚙️ 로컬에서 실행하기

1.  **저장소 복제**
    ```bash
    git clone https://github.com/gonacon/quiz-webapp.git
    cd quiz-webapp
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 추가하세요. Realm 앱 ID는 MongoDB Realm 대시보드에서 확인할 수 있습니다.

    ```
    REACT_APP_REALM_APP_ID=Your_MongoDB_Realm_App_ID
    ```

4.  **개발 서버 실행**
    ```bash
    npm start
    ```
    브라우저에서 `http://localhost:2000` 주소로 접속할 수 있습니다.

## 📦 배포

`main` 브랜치에 코드를 푸시하면 GitHub Actions가 자동으로 빌드 및 배포를 진행합니다.

성공적인 배포를 위해서는 GitHub 저장소의 `Settings > Secrets and variables > Actions` 메뉴에서 `REACT_APP_REALM_APP_ID`를 `Repository secrets`으로 등록해야 합니다.

## git commit type keyword

| Type 키워드 | 사용 시점               |
|-|---------------------|
| feat     | 새로운 기능 추가           |
| fix      | 버그 수정               |
| docs     | 문서 수정               |
| style    | 코드 스타일 변경(기능 수정 없음) |
| refactor | 코드 리팩토링             |
| test     | 테스트 코드 추가 또는 수정     |  
| chore    | 기타 자잘한 작업           |
