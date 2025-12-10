# Cross-Repository Automation Setup Guide

이 가이드는 Source Repo와 Doc Repo 간 자동화 설정 방법을 설명합니다.

## 개요

```
Source Repo (aiproject-src)          Doc Repo (aiproject-doc)
        │                                      │
        │  1. Issue 생성 (bug/feature/enhancement)
        ▼                                      │
   ┌─────────┐                                │
   │  Issue  │                                │
   │ Created │                                │
   └────┬────┘                                │
        │                                      │
        │  2. GitHub Actions 트리거            │
        ▼                                      ▼
   ┌──────────────┐      API 호출      ┌──────────────┐
   │   Workflow   │ ──────────────────▶│ Spec 문서    │
   │  (Actions)   │                    │ 자동 생성    │
   └──────────────┘                    └──────┬───────┘
                                              │
        ┌─────────────────────────────────────┘
        │  3. Spec 완료 후 알림
        ▼
   ┌─────────┐
   │ 구현    │  4. ready-to-implement 라벨
   │ 시작    │
   └─────────┘
```

## 사전 준비

### 1. GitHub Personal Access Token (PAT) 생성

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. 새 토큰 생성:
   - **Token name**: `cross-repo-automation`
   - **Expiration**: 90 days (또는 필요에 따라)
   - **Repository access**: `dogfootman/aiproject-doc`, `dogfootman/aiproject-src` 선택
   - **Permissions**:
     - Contents: Read and Write
     - Issues: Read and Write
     - Pull requests: Read and Write

3. 생성된 토큰 복사 (다시 볼 수 없으므로 안전하게 저장)

### 2. Source Repo에 Secret 등록

1. `dogfootman/aiproject-src` → Settings → Secrets and variables → Actions
2. **New repository secret** 클릭:
   - **Name**: `DOC_REPO_TOKEN`
   - **Value**: 위에서 생성한 PAT

### 3. Doc Repo에 Secret 등록

1. `dogfootman/aiproject-doc` → Settings → Secrets and variables → Actions
2. **New repository secret** 클릭:
   - **Name**: `SOURCE_REPO_TOKEN`
   - **Value**: 동일한 PAT

## 라벨 설정

### Source Repo (aiproject-src) 라벨

| 라벨 | 색상 | 설명 |
|------|------|------|
| `bug` | #d73a4a | 버그 리포트 |
| `feature` | #0e8a16 | 새 기능 요청 |
| `enhancement` | #a2eeef | 기능 개선 |
| `spec-pending` | #fbca04 | Spec 작성 대기중 |
| `ready-to-implement` | #7057ff | 구현 가능 |
| `in-progress` | #f9d0c4 | 구현 진행중 |

### Doc Repo (aiproject-doc) 라벨

| 라벨 | 색상 | 설명 |
|------|------|------|
| `spec` | #1d76db | Spec 문서 |
| `bug` | #d73a4a | 버그 관련 |
| `feature` | #0e8a16 | 기능 관련 |
| `enhancement` | #a2eeef | 개선 관련 |
| `in-review` | #fbca04 | 리뷰중 |
| `completed` | #0e8a16 | 완료됨 |

### 라벨 생성 명령어 (GitHub CLI)

```bash
# Source Repo 라벨
cd aiproject-src
gh label create bug --color d73a4a --description "버그 리포트"
gh label create feature --color 0e8a16 --description "새 기능 요청"
gh label create enhancement --color a2eeef --description "기능 개선"
gh label create spec-pending --color fbca04 --description "Spec 작성 대기중"
gh label create ready-to-implement --color 7057ff --description "구현 가능"
gh label create in-progress --color f9d0c4 --description "구현 진행중"

# Doc Repo 라벨
cd aiproject-doc
gh label create spec --color 1d76db --description "Spec 문서"
gh label create bug --color d73a4a --description "버그 관련"
gh label create feature --color 0e8a16 --description "기능 관련"
gh label create enhancement --color a2eeef --description "개선 관련"
gh label create in-review --color fbca04 --description "리뷰중"
gh label create completed --color 0e8a16 --description "완료됨"
```

## 워크플로우 동작 확인

### 테스트 시나리오

1. **Source Repo에서 버그 이슈 생성**
   - `dogfootman/aiproject-src` → Issues → New Issue
   - "Bug Report" 템플릿 선택
   - 필드 작성 후 Submit

2. **자동화 확인**
   - Source Issue에 `spec-pending` 라벨이 추가됨
   - Doc Repo에 Spec 문서가 생성됨 (`specs/bugs/BUG-{번호}-{제목}.md`)
   - Doc Repo에 연결된 Issue가 생성됨
   - Source Issue에 코멘트가 추가됨

3. **Spec 완료 후**
   - Doc Repo Issue에 `completed` 라벨 추가
   - Doc Repo Issue 닫기
   - Source Issue에 `ready-to-implement` 라벨이 자동 추가됨
   - Source Issue에 구현 가이드 코멘트가 추가됨

## 트러블슈팅

### Actions가 실행되지 않는 경우

1. Repository Settings → Actions → General 에서:
   - "Allow all actions and reusable workflows" 선택
   - "Read and write permissions" 활성화

2. PAT 토큰 만료 여부 확인
   - Settings → Developer settings → Personal access tokens에서 확인

3. 워크플로우 파일 문법 오류 확인
   - Actions 탭에서 실패한 workflow 로그 확인

### Cross-repo 접근 실패

1. PAT에 대상 repo 접근 권한 있는지 확인
2. Fine-grained token의 경우 Repository access 설정 확인
3. Secret이 올바르게 등록되었는지 확인

### Spec 문서가 생성되지 않는 경우

1. `bug`, `feature`, `enhancement` 라벨 중 하나가 있는지 확인
2. Doc Repo의 main 브랜치에 쓰기 권한이 있는지 확인
3. Actions 로그에서 상세 오류 메시지 확인

## 설정 체크리스트

### Source Repo (aiproject-src)
- [ ] PAT 토큰 생성 완료
- [ ] `DOC_REPO_TOKEN` Secret 등록
- [ ] Issue 템플릿 파일 존재 확인
  - [ ] `.github/ISSUE_TEMPLATE/bug_report.yml`
  - [ ] `.github/ISSUE_TEMPLATE/feature_request.yml`
  - [ ] `.github/ISSUE_TEMPLATE/enhancement.yml`
- [ ] 워크플로우 파일 존재 확인
  - [ ] `.github/workflows/sync-to-doc-repo.yml`
- [ ] 라벨 생성 완료

### Doc Repo (aiproject-doc)
- [ ] `SOURCE_REPO_TOKEN` Secret 등록
- [ ] 워크플로우 파일 존재 확인
  - [ ] `.github/workflows/notify-source-repo.yml`
- [ ] specs 디렉토리 구조 생성
  - [ ] `specs/bugs/`
  - [ ] `specs/features/`
  - [ ] `specs/enhancements/`
- [ ] 라벨 생성 완료
