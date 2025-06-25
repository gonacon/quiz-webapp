const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// 환경 변수에서 MongoDB 비밀번호 가져오기
const password = process.env.MONGODB_PASSWORD;
if (!password) {
    console.error('MONGODB_PASSWORD 환경 변수를 설정해주세요.');
    process.exit(1);
}

// MongoDB 연결 문자열
let uri = "mongodb+srv://gonacon:<db_password>@cluster0.hseadds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB URI의 비밀번호 치환
uri = uri.replace('<db_password>', password);

async function importData() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('MongoDB에 연결되었습니다.');

        const db = client.db('quiz_app');
        const questionSetsCollection = db.collection('question_sets');
        const questionsCollection = db.collection('questions');

        // 기존 데이터 삭제
        await questionSetsCollection.deleteMany({});
        await questionsCollection.deleteMany({});
        console.log('기존 데이터가 삭제되었습니다.');

        // 데이터 디렉토리 읽기
        const dataDir = path.join(__dirname, '../public/data');
        const subDirs = await fs.readdir(dataDir);

        for (const subDir of subDirs) {
            const subDirPath = path.join(dataDir, subDir);
            const stats = await fs.stat(subDirPath);
            
            if (stats.isDirectory()) {
                // 디렉토리 이름에서 정보 추출 (예: grade3_sem1_mid_korean)
                const [grade, semester, examType, subject] = subDir.split('_');
                
                console.log(`\n처리 중인 디렉토리: ${subDir}`);
                console.log('정보:', { grade, semester, examType, subject });

                // index.json 읽기
                const indexPath = path.join(subDirPath, 'index.json');
                const indexContent = await fs.readFile(indexPath, 'utf-8');
                const indexData = JSON.parse(indexContent);

                console.log('문제 세트 목록:', indexData);

                // 각 문제 세트 파일 처리
                for (const set of indexData) {
                    const setPath = path.join(subDirPath, set.file);
                    const setContent = await fs.readFile(setPath, 'utf-8');
                    const questions = JSON.parse(setContent);

                    console.log(`\n문제 세트 파일: ${set.file}`);
                    console.log('세트 이름:', set.name);
                    console.log('문제 수:', questions.list ? questions.list.length : '알 수 없음');

                    // 문제 세트 정보 저장
                    const questionSet = {
                        name: set.name,
                        file: set.file,
                        grade,
                        semester,
                        examType,
                        subject,
                        createdAt: new Date()
                    };

                    const result = await questionSetsCollection.insertOne(questionSet);
                    console.log('문제 세트가 저장되었습니다:', result.insertedId);

                    // 문제 목록 저장
                    if (questions.list && questions.list.length > 0) {
                        const questionsToInsert = questions.list.map(q => ({
                            ...q,
                            questionSetId: result.insertedId,
                            grade,
                            semester,
                            examType,
                            subject,
                            createdAt: new Date()
                        }));

                        const questionsResult = await questionsCollection.insertMany(questionsToInsert);
                        console.log(`${questionsResult.insertedCount}개의 문제가 저장되었습니다.`);
                    }
                }
            }
        }

        console.log('\n모든 데이터가 성공적으로 MongoDB에 저장되었습니다.');
    } catch (error) {
        console.error('데이터 처리 중 오류 발생:', error);
    } finally {
        await client.close();
        console.log('MongoDB 연결이 종료되었습니다.');
    }
}

// 스크립트 실행
importData().catch(console.error); 