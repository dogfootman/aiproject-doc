# 개발 가이드

**버전**: 1.0.0
**최종 수정**: 2025-12-11

## 개요

이 가이드는 서비스 플랫폼 기반 프로젝트 기여를 위한 지침을 제공합니다.

## 저장소 구조

```
aiproject-doc/                    # Spec Repository (현재)
├── .specify/                     # SpecKit 설정
│   ├── memory/constitution.md    # 프로젝트 헌법
│   └── templates/                # 문서 템플릿
├── .claude/commands/             # SpecKit 명령어
├── specs/                        # 기능 명세서
│   └── [###-feature-name]/
│       ├── spec.md               # 영문 명세서
│       ├── spec_kr.md            # 한글 명세서
│       ├── plan.md               # 구현 계획
│       └── tasks.md              # 작업 목록
├── schemas/                      # 스키마 정의
│   ├── database/erd.md           # 데이터베이스 ERD
│   └── api/openapi.yaml          # API 명세
├── decisions/                    # 아키텍처 결정 기록
├── guides/                       # 개발 가이드
└── config/                       # 환경 설정
```

## 개발 워크플로우

### 1. 기능 개발 프로세스

```
1. /speckit.clarify   → 요구사항 명확화
2. /speckit.specify   → spec.md + spec_kr.md 생성
3. /speckit.plan      → plan.md + plan_kr.md 생성
4. /speckit.tasks     → tasks.md + tasks_kr.md 생성
5. /speckit.implement → 구현 실행 (Source Repo에서)
```

### 2. 브랜치 전략

```
main (보호됨)
│
└── 작업 브랜치 (feature/enhancement/bugfix)
    │
    ├── 001-service-platform-base
    ├── 002-improve-auth
    └── 003-fix-login
```

#### 브랜치 유형

| 브랜치 유형 | 명명 규칙 | 용도 |
|-------------|-----------|------|
| main | `main` | 안정화된 릴리스 버전 (보호됨) |
| feature | `NNN-feature-name` | 새 기능 개발 |
| enhancement | `NNN-enhancement-name` | 기존 기능 개선 |
| bugfix | `NNN-bugfix-name` | 버그 수정 |

#### 브랜치 생성 규칙

1. **작업 브랜치는 main에서 직접 분기**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b 001-service-platform-base
   ```

2. **브랜치 명명**: `[###]-[short-name]` 형식 사용
   - 번호는 3자리로 패딩 (001, 002, ...)
   - 소문자와 하이픈만 사용
   - 예: `001-service-platform-base`, `002-user-auth`

### 3. Main 브랜치 통합 전략

#### 통합 조건

작업 브랜치가 main에 통합되려면 다음 조건을 충족해야 합니다:

| 조건 | 설명 |
|------|------|
| ✅ 명세서 완료 | spec.md, spec_kr.md 작성 완료 |
| ✅ 계획서 완료 | plan.md, plan_kr.md 작성 완료 |
| ✅ 작업 목록 완료 | tasks.md, tasks_kr.md 작성 완료 |
| ✅ 리뷰 승인 | PR 리뷰 최소 1명 승인 |
| ✅ Constitution 준수 | 프로젝트 헌법 원칙 준수 확인 |

#### 통합 프로세스

```
1. 작업 브랜치에서 작업 완료
       │
       ▼
2. PR 생성 (작업 브랜치 → main)
       │
       ▼
3. 리뷰 요청 및 승인
       │
       ▼
4. Squash and Merge
       │
       ▼
5. 작업 브랜치 삭제 (선택)
```

#### PR 생성 방법

```bash
# 1. 작업 브랜치에서 최신 main 반영
git checkout 001-service-platform-base
git fetch origin
git rebase origin/main

# 2. 충돌 해결 후 push
git push origin 001-service-platform-base --force-with-lease

# 3. GitHub에서 PR 생성 또는 CLI 사용
gh pr create --base main --head 001-service-platform-base \
  --title "feat: 서비스 플랫폼 기반 어플리케이션 명세 완료" \
  --body "## Summary
- 기능 명세서 작성 완료
- 구현 계획 수립 완료
- 작업 목록 생성 완료

## Checklist
- [x] spec.md / spec_kr.md
- [x] plan.md / plan_kr.md
- [x] tasks.md / tasks_kr.md
- [x] Constitution 준수 확인"
```

#### Merge 전략

| 전략 | 사용 시점 |
|------|-----------|
| **Squash and Merge** (권장) | 작업 브랜치의 여러 커밋을 하나로 합쳐 main에 통합 |
| Rebase and Merge | 커밋 히스토리를 선형으로 유지하고 싶을 때 |
| Merge Commit | 브랜치 히스토리를 그대로 보존하고 싶을 때 |

#### main 브랜치 보호 규칙 (권장)

GitHub Repository Settings → Branches → Branch protection rules:

- [x] Require a pull request before merging
- [x] Require approvals (1명 이상)
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging

### 4. 커밋 메시지 규칙

```
<유형>: <설명>

유형:
- feat:     신규 기능
- enhance:  기존 기능 개선
- fix:      버그 수정
- docs:     문서화
- refactor: 코드 리팩토링
```

## 시작하기

### 사전 요구사항

- Git
- GitHub CLI (gh)
- Claude Code (SpecKit 명령어용)

### 설정

```bash
# Spec 저장소 클론
git clone https://github.com/dogfootman/aiproject-doc.git
cd aiproject-doc

# 새 기능 생성
/speckit.specify <기능 설명>
```

## 명세서 작업

### 새 명세서 생성

1. `/speckit.specify` 명령어와 기능 설명 사용:
   ```
   /speckit.specify 사용자 프로필 관리 추가
   ```

2. 명령어 실행 결과:
   - 새 브랜치 생성 (예: `002-user-profile`)
   - `spec.md` (영문)와 `spec_kr.md` (한글) 생성
   - 품질 체크리스트 생성

### 명세서 구조

```markdown
# 기능 명세서: [기능명]

## 사용자 시나리오 및 테스트
- 우선순위가 있는 사용자 스토리 (P1, P2, P3...)
- 수락 시나리오 (Given/When/Then)
- 엣지 케이스

## 요구사항
- 기능 요구사항 (FR-001, FR-002...)
- 핵심 엔티티

## 성공 기준
- 측정 가능한 결과 (SC-001, SC-002...)

## 가정사항
```

### 다국어 문서화

모든 명세서는 두 언어로 작성해야 합니다:

| 영문 (Primary) | 한글 |
|----------------|------|
| spec.md | spec_kr.md |
| plan.md | plan_kr.md |
| tasks.md | tasks_kr.md |

## 스키마 작업

### 데이터베이스 스키마 (ERD)

- 위치: `schemas/database/erd.md`
- 형식: Mermaid ERD 다이어그램
- 업데이트 시점: 새 엔티티 추가 또는 관계 수정 시

### API 명세

- 위치: `schemas/api/openapi.yaml`
- 형식: OpenAPI 3.1
- 업데이트 시점: API 엔드포인트 추가/수정 시

## 아키텍처 결정 기록 (ADR)

### ADR 작성 시점

- 중요한 기술 선택
- 아키텍처 패턴 도입
- 주요 워크플로우 변경

### ADR 템플릿

```markdown
# ADR-XXX: [제목]

**상태**: Proposed | Accepted | Deprecated | Superseded
**날짜**: YYYY-MM-DD

## 컨텍스트
[배경 및 문제 상황]

## 결정
[결정된 내용]

## 결과
### 긍정적
### 부정적
### 위험 요소

## 고려된 대안
```

## 환경 설정

### 설정 파일

| 환경 | 파일 | 용도 |
|------|------|------|
| PoC | `config/poc.yaml` | Mock 데이터, 로컬 개발 |
| Dev | `config/dev.yaml` | 개발 데이터베이스 |
| Prod | `config/prod.yaml` | 운영 설정 |

### 단계별 비교

| 항목 | PoC | Dev | Production |
|------|-----|-----|------------|
| 데이터 | Mock/File | 실제 DB | 실제 DB |
| 인증 | 우회 | 테스트 계정 | 실제 인증 |
| 로깅 | INFO | DEBUG | WARN/ERROR |

## 코드 리뷰 가이드

### 명세서 리뷰 체크리스트

- [ ] 모든 필수 섹션 완료
- [ ] 명세서에 구현 세부사항 없음
- [ ] 요구사항이 테스트 가능함
- [ ] 성공 기준이 측정 가능함
- [ ] 영문/한글 버전 모두 존재
- [ ] 버전이 동기화됨

### PR 요구사항

1. 관련 명세서 문서 링크
2. Constitution check 통과
3. 모든 테스트 통과
4. 문서 업데이트 완료

## 문제 해결

### 일반적인 문제

**SpecKit 명령어 작동 안 함**
- `.claude/commands/` 디렉토리 존재 확인
- 명령어 파일 문법 확인

**브랜치 명명 문제**
- 패턴 준수: `[###]-[short-name]`
- 소문자와 하이픈 사용

## 참고 자료

- [프로젝트 헌법](../.specify/memory/constitution.md)
- [ADR-001: SpecKit 도입](../decisions/ADR-001-speckit-adoption.md)
- [ADR-002: Dual Repository 전략](../decisions/ADR-002-dual-repository-strategy.md)
- [프로젝트 구조 가이드](../project-structure-guide.md)
