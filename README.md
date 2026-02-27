# Git 학습 퀴즈 웹 애플리케이션

신입 온보딩을 위한 Git 학습 퀴즈 채점 시스템입니다. AI 기반 자동 채점과 실시간 랭킹 기능을 제공합니다.

## 🚀 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **AI**: OpenAI GPT-4o-mini

## 📋 주요 기능

1. **사용자 등록**: 퀴즈 시작 전 이름 입력
2. **단계별 퀴즈**: 9개의 Git 학습 단계 (Step 0 ~ Step 8)
3. **AI 자동 채점**: OpenAI를 활용한 서술형/단답형 답변 채점
4. **실시간 피드백**: 각 문제별 점수와 피드백 제공
5. **랭킹 시스템**: 점수 기반 전체 사용자 랭킹 (무한 스크롤)

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에 다음 값들을 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. SQL Editor에서 `supabase-setup.sql` 파일의 내용 실행
3. Settings → API에서 URL과 anon key 확인

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🎯 퀴즈 구성

- **Step 0**: 과제 전 준비
- **Step 1**: Working directory, Staging area, Repository
- **Step 2**: git add와 tracked/untracked
- **Step 3**: git commit
- **Step 4**: git restore
- **Step 5**: git reset (soft/mixed/hard)
- **Step 6**: git reflog
- **Step 7**: Fast-Forward merge vs 3-way merge
- **Step 8**: git revert (협업 시나리오)

## 📁 프로젝트 구조

```
git_playground/
├── app/
│   ├── api/          # API 라우트
│   └── page.tsx      # 메인 페이지
├── components/       # React 컴포넌트
├── lib/              # 유틸리티 및 데이터
└── supabase-setup.sql
```

---

Made with ❤️ for Git learners

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
