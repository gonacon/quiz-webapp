import * as Realm from "realm-web";

// MongoDB Realm 앱 ID (MongoDB Atlas에서 확인 가능)
const APP_ID = process.env.REACT_APP_REALM_APP_ID || "your-app-id";

// Realm 앱 인스턴스 생성
const app = new Realm.App({ id: APP_ID });

// 익명 로그인
export const loginAnonymous = async () => {
    const credentials = Realm.Credentials.anonymous();
    try {
        const user = await app.logIn(credentials);
        return user;
    } catch (error) {
        console.error("Anonymous login failed:", error);
        throw error;
    }
};

// MongoDB 컬렉션에 접근하는 함수
export const getCollection = (name: string) => {
    const user = app.currentUser;
    if (!user) {
        throw new Error("사용자가 로그인되어 있지 않습니다.");
    }

    return user.mongoClient("mongodb-atlas").db("quiz_app").collection(name);
}; 