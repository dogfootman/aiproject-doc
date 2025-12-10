# Development Guide

**Version**: 1.0.0
**Last Updated**: 2025-12-11

## Overview

This guide provides instructions for contributing to the Service Platform Base project.

## Repository Structure

```
aiproject-doc/                    # Spec Repository (Current)
├── .specify/                     # SpecKit configuration
│   ├── memory/constitution.md    # Project constitution
│   └── templates/                # Document templates
├── .claude/commands/             # SpecKit commands
├── specs/                        # Feature specifications
│   └── [###-feature-name]/
│       ├── spec.md               # English specification
│       ├── spec_kr.md            # Korean specification
│       ├── plan.md               # Implementation plan
│       └── tasks.md              # Task list
├── schemas/                      # Schema definitions
│   ├── database/erd.md           # Database ERD
│   └── api/openapi.yaml          # API specification
├── decisions/                    # Architecture Decision Records
├── guides/                       # Development guides
└── config/                       # Environment configurations
```

## Development Workflow

### 1. Feature Development Process

```
1. /speckit.clarify   → Clarify requirements
2. /speckit.specify   → Create spec.md + spec_kr.md
3. /speckit.plan      → Create plan.md + plan_kr.md
4. /speckit.tasks     → Create tasks.md + tasks_kr.md
5. /speckit.implement → Execute implementation (in Source Repo)
```

### 2. Branch Strategy

```
main (protected)
│
└── Working branches (feature/enhancement/bugfix)
    │
    ├── 001-service-platform-base
    ├── 002-improve-auth
    └── 003-fix-login
```

#### Branch Types

| Branch Type | Naming Convention | Purpose |
|-------------|-------------------|---------|
| main | `main` | Stable release version (protected) |
| feature | `NNN-feature-name` | New feature development |
| enhancement | `NNN-enhancement-name` | Existing feature improvements |
| bugfix | `NNN-bugfix-name` | Bug fixes |

#### Branch Creation Rules

1. **Working branches fork directly from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b 001-service-platform-base
   ```

2. **Branch naming**: Use `[###]-[short-name]` format
   - Numbers are 3-digit padded (001, 002, ...)
   - Use lowercase and hyphens only
   - Examples: `001-service-platform-base`, `002-user-auth`

### 3. Main Branch Integration Strategy

#### Integration Conditions

Working branches must meet the following conditions to be merged into main:

| Condition | Description |
|-----------|-------------|
| ✅ Spec Complete | spec.md, spec_kr.md completed |
| ✅ Plan Complete | plan.md, plan_kr.md completed |
| ✅ Tasks Complete | tasks.md, tasks_kr.md completed |
| ✅ Review Approved | At least 1 PR review approval |
| ✅ Constitution Compliance | Project constitution principles verified |

#### Integration Process

```
1. Complete work on working branch
       │
       ▼
2. Create PR (working branch → main)
       │
       ▼
3. Request review and get approval
       │
       ▼
4. Squash and Merge
       │
       ▼
5. Delete working branch (optional)
```

#### PR Creation Method

```bash
# 1. Rebase working branch on latest main
git checkout 001-service-platform-base
git fetch origin
git rebase origin/main

# 2. Push after resolving conflicts
git push origin 001-service-platform-base --force-with-lease

# 3. Create PR via GitHub UI or CLI
gh pr create --base main --head 001-service-platform-base \
  --title "feat: Service platform base application spec complete" \
  --body "## Summary
- Feature specification completed
- Implementation plan established
- Task list generated

## Checklist
- [x] spec.md / spec_kr.md
- [x] plan.md / plan_kr.md
- [x] tasks.md / tasks_kr.md
- [x] Constitution compliance verified"
```

#### Merge Strategy

| Strategy | When to Use |
|----------|-------------|
| **Squash and Merge** (Recommended) | Combine multiple commits from working branch into one for main |
| Rebase and Merge | When you want to keep commit history linear |
| Merge Commit | When you want to preserve branch history as-is |

#### Main Branch Protection Rules (Recommended)

GitHub Repository Settings → Branches → Branch protection rules:

- [x] Require a pull request before merging
- [x] Require approvals (1 or more)
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging

### 4. Commit Message Convention

```
<type>: <description>

Types:
- feat:     New feature
- enhance:  Enhancement to existing feature
- fix:      Bug fix
- docs:     Documentation
- refactor: Code refactoring
```

## Getting Started

### Prerequisites

- Git
- GitHub CLI (gh)
- Claude Code (for SpecKit commands)

### Setup

```bash
# Clone the spec repository
git clone https://github.com/dogfootman/aiproject-doc.git
cd aiproject-doc

# Create a new feature
/speckit.specify <feature description>
```

## Working with Specifications

### Creating a New Specification

1. Use the `/speckit.specify` command with your feature description:
   ```
   /speckit.specify Add user profile management
   ```

2. The command will:
   - Create a new branch (e.g., `002-user-profile`)
   - Generate `spec.md` (English) and `spec_kr.md` (Korean)
   - Create a quality checklist

### Specification Structure

```markdown
# Feature Specification: [Feature Name]

## User Scenarios & Testing
- User stories with priorities (P1, P2, P3...)
- Acceptance scenarios (Given/When/Then)
- Edge cases

## Requirements
- Functional requirements (FR-001, FR-002...)
- Key entities

## Success Criteria
- Measurable outcomes (SC-001, SC-002...)

## Assumptions
```

### Bilingual Documentation

All specifications must be created in both languages:

| English (Primary) | Korean |
|-------------------|--------|
| spec.md | spec_kr.md |
| plan.md | plan_kr.md |
| tasks.md | tasks_kr.md |

## Working with Schemas

### Database Schema (ERD)

- Location: `schemas/database/erd.md`
- Format: Mermaid ERD diagram
- Update when: Adding new entities or modifying relationships

### API Specification

- Location: `schemas/api/openapi.yaml`
- Format: OpenAPI 3.1
- Update when: Adding/modifying API endpoints

## Architecture Decision Records (ADR)

### When to Create an ADR

- Significant technology choices
- Architectural patterns adoption
- Major workflow changes

### ADR Template

```markdown
# ADR-XXX: [Title]

**Status**: Proposed | Accepted | Deprecated | Superseded
**Date**: YYYY-MM-DD

## Context
[Background and problem statement]

## Decision
[What was decided]

## Consequences
### Positive
### Negative
### Risks

## Alternatives Considered
```

## Environment Configuration

### Configuration Files

| Environment | File | Purpose |
|-------------|------|---------|
| PoC | `config/poc.yaml` | Mock data, local development |
| Dev | `config/dev.yaml` | Development database |
| Prod | `config/prod.yaml` | Production settings |

### Stage Comparison

| Aspect | PoC | Dev | Production |
|--------|-----|-----|------------|
| Data | Mock/File | Real DB | Real DB |
| Auth | Bypass | Test accounts | Real auth |
| Logging | INFO | DEBUG | WARN/ERROR |

## Code Review Guidelines

### Spec Review Checklist

- [ ] All mandatory sections completed
- [ ] No implementation details in spec
- [ ] Requirements are testable
- [ ] Success criteria are measurable
- [ ] Both English and Korean versions exist
- [ ] Versions are synchronized

### PR Requirements

1. Link to related spec document
2. Constitution check passed
3. All tests passing
4. Documentation updated

## Troubleshooting

### Common Issues

**SpecKit commands not working**
- Ensure `.claude/commands/` directory exists
- Check command file syntax

**Branch naming issues**
- Follow pattern: `[###]-[short-name]`
- Use lowercase with hyphens

## References

- [Project Constitution](../.specify/memory/constitution.md)
- [ADR-001: SpecKit Adoption](../decisions/ADR-001-speckit-adoption.md)
- [ADR-002: Dual Repository Strategy](../decisions/ADR-002-dual-repository-strategy.md)
- [Project Structure Guide](../project-structure-guide.md)
