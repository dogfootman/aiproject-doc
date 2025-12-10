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
└── develop
    │
    ├── feature/001-service-platform-base
    ├── enhancement/002-improve-auth
    └── bugfix/003-fix-login
```

### 3. Commit Message Convention

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
