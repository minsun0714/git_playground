export interface QuizStep {
  id: number;
  title: string;
  content: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  type: "short" | "long";
  correctAnswer: string;
  maxScore: number;
}

export const quizSteps: QuizStep[] = [
  {
    id: 0,
    title: "Step 0 — 과제 전 준비 (.gitignore)",
    content: `git_study 프로젝트를 과제 폴더 안에 만들어주세요.
프로젝트 폴더 내부 경로로 들어와서 \`git init\`을 터미널에 입력

\`\`\`bash
cd git_study
git init
\`\`\``,
    questions: [],
  },
  {
    id: 1,
    title: "Step 1 — 로컬에서 코드 변경 사항 발생",
    content: `file.txt를 만들고

\`touch file\`

새로 만든 파일에 "initial text"라는 글자를 추가하라.

이로써 로컬에서 코드에 변경이 발생하게 되었다.

\`git status\`를 입력하고 아래 질문에 답하라.
(참고로 \`git status\`는 이 과제에서 수시로 사용하게 될 것이다.)`,
    questions: [
      {
        id: "step1-q1",
        question:
          "Working directory, Staging area, Repository 중 어디에 변경 사항이 존재하는가?",
        type: "long",
        correctAnswer:
          "Working directory. 아직 stage area에 add하지 않아서 Working directory에서 untracked file로 남아있는 상태",
        maxScore: 5,
      },
    ],
  },
  {
    id: 2,
    title: "Step 2 — add",
    content: `working directory에만 있던 Step 1의 변경사항을 이번에는 stage area에 추가하라.

\`git status\` 입력 후 아래 질문에 답하라.`,
    questions: [
      {
        id: "step2-q1",
        question:
          "add했을 때 stage area와 repository에는 각각 무엇이 있겠는가? 또는 아무것도 없겠는가?",
        type: "long",
        correctAnswer:
          "stage area에 변경사항이 추가됨. 아직 커밋을 하지 않았기 때문에 repository에는 아무것도 없다.",
        maxScore: 5,
      },
      {
        id: "step2-q2",
        question:
          "변경사항은 untracked인가 tracked인가? (git에 의해 추적되기 시작했는가?)",
        type: "short",
        correctAnswer:
          "tracked. add되어 커밋할 파일이 생겼다는 것은, file이 git에 의해 추적되기 시작한 동시에 stage area에 file이 복사되었다는 것.",
        maxScore: 5,
      },
      {
        id: "step2-q3",
        question:
          '"initial text"를 "initial change"로 수정한 후, 수정사항을 staging area로 올릴 때 일일히 또 add를 해야하는가? 아니면 tracked 파일이기 때문에 자동으로 staging으로 올라가는가?',
        type: "long",
        correctAnswer:
          "add 해야 한다. git에 의해 추적되기 시작했다고 변경사항이 발생할 때마다 자동으로 stage area에 올라가는 건 아니다.",
        maxScore: 5,
      },
    ],
  },
  {
    id: 3,
    title: "Step 3 — commit",
    content: `"initial change"를 stage area에 다시 add한 다음 커밋까지 하라.

\`git add file\`
\`git commit -m "initial change"\`

\`git status\` 입력 후 아래 질문에 답하라.`,
    questions: [
      {
        id: "step3-q1",
        question:
          "commit까지 했을 시점에 stage area와 repository에는 각각 무엇이 있는가?",
        type: "long",
        correctAnswer:
          "stage area는 비워지고, repository에 커밋이 저장됨. commit은 stage area의 스냅샷을 repository에 저장한다.",
        maxScore: 5,
      },
      {
        id: "step3-q2",
        question:
          "결론적으로, commit은 Working directory를 저장하는가, Stage Area를 저장하는가?",
        type: "short",
        correctAnswer: "Stage Area를 저장한다.",
        maxScore: 5,
      },
    ],
  },
  {
    id: 4,
    title: "Step 4 — restore",
    content: `Step3에서 "initial change"를 커밋했다.
이제 "initial change"를 "next change"로 수정하라. 아직 add는 하지 않았다.
그런데 next라는 단어를 괜히 쓴 거 같다. 변경 사항을 취소하고 다시 working directory의 내용을 initial로 바꾸고 싶다.`,
    questions: [
      {
        id: "step4-q1",
        question:
          "이때 무엇을 써야 하는가? 그리고 왜 reset이 아닌 restore인가?",
        type: "long",
        correctAnswer:
          "git restore file을 사용. working directory에서의 변경사항만 취소하는 작업이기 때문이다.",
        maxScore: 5,
      },
      {
        id: "step4-q2",
        question: "restore는 어떤 공간을 변경하는가?",
        type: "short",
        correctAnswer: "working directory",
        maxScore: 5,
      },
      {
        id: "step4-q3",
        question:
          "git add를 먼저 한 다음 stage area에서 내리되 tracked 상태로 유지하려면 어떤 명령을 사용해야 하는가? 어떤 공간이 변경되는가?",
        type: "long",
        correctAnswer:
          "git restore --staged file. stage area에서는 변경사항을 내리되 tracked 상태가 유지되지만, working directory에는 변경 사항 유지",
        maxScore: 10,
      },
      {
        id: "step4-q4",
        question:
          "untracked 상태로 변경하려면 어떤 명령을 사용해야 하는가? 어떤 공간이 변경되는가?",
        type: "long",
        correctAnswer:
          "git rm --cached file. stage area에서는 변경사항을 내리되 untracked 상태로 변경하지만, working directory에는 변경 사항을 유지",
        maxScore: 10,
      },
    ],
  },
  {
    id: 5,
    title: "Step 5 — reset?! (커밋 취소)",
    content: `Step 4에서 restore를 했기 때문에, 지금까지 Step 3 처음에 진행했던 단 1건의 커밋만 올라가있다.
그런데 다시 생각해보니 첫 커밋이 후회가 된다. 첫 커밋을 취소하고 싶다.`,
    questions: [
      {
        id: "step5-q1",
        question:
          "왜 reset (--soft, --mixed, --hard)은 에러를 뱉을까? (힌트: 위 3개 명령어는 가장 최신 커밋의 부모 커밋으로 HEAD를 이동시킨다)",
        type: "long",
        correctAnswer:
          "HEAD를 부모 커밋 (직전 커밋)으로 이동시키려고 했는데 지금까지 커밋이 1건 밖에 없어서 최신 커밋의 부모 커밋이 존재하지 않음. 따라서 reset이 불가능.",
        maxScore: 5,
      },
      {
        id: "step5-q2",
        question:
          "커밋을 1번 더 남긴 후 git reset --hard HEAD~1을 입력했다. 왜 restore가 아닌 reset인가?",
        type: "long",
        correctAnswer:
          "restore는 working directory에서 변경사항을 취소하거나 staged에서 변경사항을 내리는 것. restore는 파일 단위로 변경사항을 취소하는 것이지만, reset은 HEAD 단위로 변경 사항 취소.",
        maxScore: 5,
      },
      {
        id: "step5-q3",
        question: "soft vs mixed vs hard의 차이는 무엇인가?",
        type: "long",
        correctAnswer:
          "soft: 브랜치 범위는 바뀌지만 working directory와 staging area에는 아무런 변화도 없음. mixed: 브랜치 범위, staging area가 바뀌지만 working directory에는 아무런 변화도 없음 (최신 커밋을 바꾸고 싶을 때 주로 사용). hard: 브랜치 범위, staging area, working directory 모두 바뀜.",
        maxScore: 5,
      },
    ],
  },
  {
    id: 6,
    title: "Step 6 — reflog",
    content: `Step 5에서 reset을 학습해보았다.
다시 생각해보니 "next change"가 가장 괜찮은 것 같다.
그런데 이미 브랜치의 범위는 축소되었고, HEAD는 더 이상 "next change" 커밋을 가리키지 않는다.
과거 HEAD가 가리켰던 "next change" 커밋으로 되돌릴 수 있을까?`,
    questions: [
      {
        id: "step6-q1",
        question: "git log와 git reflog의 차이점은 무엇인가?",
        type: "long",
        correctAnswer:
          "git log는 현재 브랜치의 커밋 내역을 보여준다. git reflog는 역대 HEAD의 히스토리를 보여준다.",
        maxScore: 5,
      },
      {
        id: "step6-q2",
        question:
          '다시 "next change"가 가장 최신 커밋이 되도록 되돌리려면 어떻게 해야 하는가?',
        type: "long",
        correctAnswer:
          "Step 5에서 학습한 reset을 이용하여 과거 커밋으로 되돌아갈 수 있다. git reset --hard <<커밋 해시>>",
        maxScore: 5,
      },
    ],
  },
  {
    id: 7,
    title: "Step 7 — Fast-Forward merge vs 3-way merge",
    content: `지금까지 master 브랜치에서만 작업을 진행해왔다.
이번에는 새로운 브랜치를 만들어볼 시간이다.

\`git checkout -b dev\`

\`git log\`를 입력하고 아래 질문에 답하라.`,
    questions: [
      {
        id: "step7-q1",
        question:
          "새로운 브랜치가 만들어졌다. 역대 커밋들의 hash는 master에 있는 hash와 동일할까? 아니면 다를까?",
        type: "long",
        correctAnswer:
          "동일하다. dev 브랜치가 만들어지기 전에는 HEAD가 가리키고 있는 브랜치가 master가 유일했지만, 이제 master와 dev 2개를 가리키고 있는 것이다.",
        maxScore: 5,
      },
      {
        id: "step7-q2",
        question:
          "dev 브랜치에서 새로운 커밋을 만든 후 master 브랜치로 이동하여 merge했다. 2개의 브랜치 간 충돌이 발생할까?",
        type: "short",
        correctAnswer:
          "발생하지 않는다. master 브랜치의 범위만 늘어나는 것이다. (Fast-Forward merge)",
        maxScore: 5,
      },
      {
        id: "step7-q3",
        question:
          'master에서 "collision from master"로 커밋하고, dev에서 "collision from dev"로 커밋했다. 2개의 브랜치 간 충돌이 발생할까?',
        type: "short",
        correctAnswer:
          "발생한다. 같은 파일의 같은 부분이 다르게 수정되었기 때문. (3-way merge)",
        maxScore: 5,
      },
    ],
  },
  {
    id: 8,
    title: "Step 8 — revert (운영 사고 시뮬레이션)",
    content: `앞서 dev 브랜치를 머지했다.
그런데 알고보니 "collision"이라는 단어는 치명적인 독극물을 머금은 버그가 있는 단어이므로, main 브랜치에 들어가 있어서는 안된다고 한다.

당신이 다른 사람들과 협업을 하고 있는 개발자라고 가정하자.
만약 github에 지금까지의 commit 내역을 push했고 동료들이 이미 이를 pull 받아간 상태라고 가정해보자.`,
    questions: [
      {
        id: "step8-q1",
        question:
          "reset 요정과 revert 요정이 나타나 양쪽 어깨에서 속삭인다. 두 요정 중 숨어있는 악마를 찾아 이유도 함께 제시하라.",
        type: "long",
        correctAnswer:
          '악마 = reset 요정. reset은 브랜치 포인터를 과거로 이동시킴. 이미 push된 커밋 히스토리를 변경함. 동료의 로컬 히스토리와 충돌 발생. force push 필요 → 협업 지옥 시작. reset은 히스토리를 "지워버리는" 행위다.',
        maxScore: 10,
      },
      {
        id: "step8-q2",
        question: "악마를 찾았으니 대응방안을 제시하라.",
        type: "long",
        correctAnswer:
          '선택 = revert 요정. 기존 커밋은 그대로 둔다. 새로운 "취소 커밋"을 하나 더 만든다. 히스토리 보존. 협업 안전. revert는 기록을 지우지 않고 되돌린다.',
        maxScore: 10,
      },
    ],
  },
];

export function getTotalQuestions(): number {
  return quizSteps.reduce((sum, step) => sum + step.questions.length, 0);
}

export function getMaxTotalScore(): number {
  return quizSteps.reduce(
    (sum, step) =>
      sum + step.questions.reduce((qSum, q) => qSum + q.maxScore, 0),
    0,
  );
}
