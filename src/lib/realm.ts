import * as Realm from 'realm-web';

// Realm 앱 초기화
const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID || '' });

// Realm 사용자 인증

async function getAuthenticatedUser() {
    if (!app.currentUser) {
        await app.logIn(Realm.Credentials.anonymous()); 
    }
    return app.currentUser;
}

// MongoDB 컬렉션 대신 Realm 컬렉션 사용
export async function getQuestionSetsCollection() {
    try {
        const user = await getAuthenticatedUser();

        // Atlas 연결 이름과 데이터베이스 이름 확인
        const mongodb = user.mongoClient("Cluster0");

        return mongodb.db("quiz_app").collection("question_sets");

    } catch (error) {
        console.error("Realm 연결 실패!", error);
        throw error;
    }
}

export async function getQuestionsCollection() {
    try {
        const user = await getAuthenticatedUser();

        const mongodb = user.mongoClient("Cluster0");

        return mongodb.db("quiz_app").collection("questions");

    } catch (error) {
        console.error("Realm 연결 실패!", error);
        throw error;
    }
}


export async function getQuestionSets(grade: string, semester: string, examType: string, subject: string) {
    try {
        const user = await getAuthenticatedUser();
  
      return await user.functions.callFunction("findQuestionSets", {
        grade,
        semester,
        examType,
        subject,
      });
    } catch (error) {
      console.error('Realm 연결 실패!', error);
      throw error;
    }
  }

export async function findQuestions(questionSetId: string) {
  try {
      const user = await getAuthenticatedUser();

    return await user.functions.callFunction("findQuestions", {
      questionSetId,
    });
  } catch (error) {
    console.error('Realm 함수 호출 실패!', error);
    throw error;
  }
}
