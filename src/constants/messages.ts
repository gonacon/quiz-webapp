export const FEATURE_CARDS = [
    {
        icon: "🎯",
        title: "맞춤형 학습",
        description: "다양한 과목과 난이도의 문제들을 선택하여 학습할 수 있습니다.",
    },
    {
        icon: "✍️",
        title: "즉각적인 피드백",
        description: "문제 풀이 후 바로 정답과 해설을 확인할 수 있습니다.",
    },
    {
        icon: "📊",
        title: "성적 확인",
        description: "문제 풀이 후 바로 점수와 정답률을 확인할 수 있습니다.",
    },
]; 

// 사용자에게 표시되는 메시지 상수

// 에러 메시지
export const ERROR_MESSAGES = {
    LOAD_QUESTION_SETS: '문제 세트 목록을 불러오는데 실패했습니다.',
    LOAD_QUESTIONS: '문제를 불러오는데 실패했습니다.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    DEFAULT_ERROR: '해당 시험 문제는 아직 준비되지 않았습니다.',
} as const;

// 로딩 메시지
export const LOADING_MESSAGES = {
    LOADING_QUESTION_SETS: '문제 세트를 불러오는 중...',
    LOADING_QUESTIONS: '문제를 불러오는 중...',
    LOADING: '로딩 중...',
} as const;

// UI 메시지
export const UI_MESSAGES = {
    HOME: '홈으로',
    SELECT_QUESTION: '문제 선택',
    ADD_QUESTION: '문제 추가',
    DOWNLOAD_JSON: 'JSON 다운로드',
    RETRY: '다시 시도',
    REFRESH_PAGE: '페이지 새로고침',
    CONTACT_EMAIL: '문의사항은 이메일로 연락주세요',
    FILE_TITLE_PLACEHOLDER: '예: 중3_국어_1학기_중간',
    CREATE_QUESTION_TITLE: '문제 생성',
    FILE_TITLE_LABEL: '파일 제목 (확장자 제외)',
    FILE_TITLE_REQUIRED: '파일 제목을 입력해주세요.',
} as const;

// 과목 번역
export const SUBJECT_TRANSLATIONS = {
    korean: '국어',
    math: '수학',
    english: '영어',
    science: '과학',
    social: '사회',
} as const; 