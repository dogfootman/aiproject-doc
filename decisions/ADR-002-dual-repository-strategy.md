# ADR-002: Dual Repository Strategy (Spec + Source)

**Status**: Accepted
**Date**: 2025-12-11
**Decision Makers**: Project Team

## Context

프로젝트의 설계 문서와 구현 코드를 효과적으로 관리하기 위한 저장소 전략이 필요합니다.

### 요구사항
- 설계와 구현의 명확한 분리
- 독립적인 버전 관리
- 설계 문서의 재사용성
- 이슈 추적 및 연계

## Decision

**Spec Repository와 Source Repository를 분리하여 운영한다.**

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Organization                     │
├─────────────────────────┬───────────────────────────────────┤
│   aiproject-doc (Spec)  │   aiproject-source (Source)       │
├─────────────────────────┼───────────────────────────────────┤
│  • 기능 명세서           │  • Spec Repo 참조                 │
│  • API 설계서           │  • 실제 구현 코드                  │
│  • DB 스키마 설계        │  • 테스트 코드                    │
│  • 아키텍처 결정 기록     │  • 배포 설정                      │
└─────────────────────────┴───────────────────────────────────┘
```

### Repository 역할

| Repository | 역할 | 주요 콘텐츠 |
|------------|------|------------|
| **aiproject-doc** | 설계 & 문서 | specs/, schemas/, decisions/, guides/ |
| **aiproject-source** | 구현 & 실행 | src/, tests/, config/, docker/ |

### 연결 방식

1. **Issue 연결**: Source Repo Issue → Spec Repo 문서 링크
2. **Git Submodule** (선택): Source Repo에서 Spec Repo 참조
3. **Cross-Reference**: 문서 내 상호 링크

## Consequences

### Positive
- 관심사 분리로 명확한 책임
- 설계 문서 독립적 관리 가능
- Spec 재사용 (여러 Source Repo에서 참조 가능)
- 문서 전용 권한 관리 가능

### Negative
- 두 저장소 동기화 필요
- Cross-repository 이슈 추적 복잡성
- 초기 설정 작업 필요

### Mitigations
- GitHub Projects로 통합 관리
- 명확한 브랜치 명명 규칙 (동일 번호 체계)
- 자동화 스크립트로 동기화 지원

## Implementation

### Spec Repository (aiproject-doc)
```
aiproject-doc/
├── .specify/           # SpecKit 설정
├── specs/              # 기능 명세서
├── schemas/            # DB, API 스키마
├── decisions/          # ADR 문서
├── guides/             # 개발 가이드
└── config/             # 환경 설정 템플릿
```

### Source Repository (aiproject-source) - 향후 생성
```
aiproject-source/
├── src/modules/        # 구현 코드
├── tests/              # 테스트
├── config/             # 환경 설정
├── data/mock/          # Mock 데이터
├── docker/             # 컨테이너 설정
└── .github/            # Issue 템플릿, CI/CD
```

## Alternatives Considered

| 대안 | 장점 | 단점 | 결정 |
|------|------|------|------|
| Monorepo | 단일 저장소 | 규모 커지면 복잡, 권한 분리 어려움 | 기각 |
| **Dual Repo** | 관심사 분리, 독립 관리 | 동기화 필요 | **채택** |
| Multiple Repos (micro) | 세분화 | 관리 복잡성 | 기각 |

## References

- [ADR-001: SpecKit Adoption](./ADR-001-speckit-adoption.md)
- [Project Structure Guide](../project-structure-guide.md)
