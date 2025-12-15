# Data Model: Async Notification System

**Feature**: 002-async-notification
**Date**: 2025-12-12

## Entities

### Notification

Represents a single notification instance to be displayed to the user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier (UUID) |
| type | NotificationType | Yes | success, error, warning, info |
| title | string | No | Optional title/header text |
| message | string | Yes | Main notification message |
| duration | number | No | Auto-dismiss duration in ms (default: 5000) |
| dismissible | boolean | No | Show close button (default: true) |
| timestamp | Date | Yes | When notification was created |
| persistent | boolean | No | If true, never auto-dismiss |

### NotificationQueue

Manages the ordered list of pending and visible notifications.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| visible | Notification[] | Yes | Currently displayed notifications (max 5) |
| pending | Notification[] | Yes | Queued notifications waiting to display |
| maxVisible | number | Yes | Maximum visible notifications (default: 5) |

### AlertAction

Represents an action button in alert dialogs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| label | string | Yes | Button text |
| onClick | () => void | Yes | Action callback |
| variant | ButtonVariant | No | primary, secondary, danger (default: primary) |
| autoFocus | boolean | No | Auto-focus this button on dialog open |

### AlertConfig

Configuration for critical alert dialogs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| title | string | Yes | Alert dialog title |
| message | string | Yes | Alert message content |
| actions | AlertAction[] | Yes | Action buttons |
| type | NotificationType | No | Visual styling type (default: error) |
| dismissible | boolean | No | Allow closing without action (default: false) |

## Type Definitions

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  timestamp: Date;
  persistent?: boolean;
}

interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  autoFocus?: boolean;
}

interface AlertConfig {
  id: string;
  title: string;
  message: string;
  actions: AlertAction[];
  type?: NotificationType;
  dismissible?: boolean;
}

interface NotificationState {
  toasts: Notification[];
  pendingToasts: Notification[];
  alerts: AlertConfig[];
}
```

## State Transitions

### Toast Lifecycle

```
[Created] → [Visible] → [Auto-dismiss/Manual-dismiss] → [Removed]
                ↓
           [Queued] (if max visible reached)
                ↓
           [Visible] (when slot available)
```

### Alert Lifecycle

```
[Created] → [Visible] → [Action Clicked] → [Removed]
                ↓
           [Queued] (if another alert visible)
                ↓
           [Visible] (when previous dismissed)
```

## Validation Rules

### Notification

- `id`: Must be unique, auto-generated UUID
- `type`: Must be one of: success, error, warning, info
- `message`: Required, non-empty string, max 500 characters
- `title`: Optional, max 100 characters
- `duration`: Positive integer, min 1000ms, max 30000ms

### AlertConfig

- `id`: Must be unique, auto-generated UUID
- `title`: Required, non-empty string, max 100 characters
- `message`: Required, non-empty string, max 1000 characters
- `actions`: At least one action required

## Default Values

| Entity | Field | Default Value |
|--------|-------|---------------|
| Notification | duration | 5000 (ms) |
| Notification | dismissible | true |
| Notification | persistent | false |
| AlertConfig | type | 'error' |
| AlertConfig | dismissible | false |
| AlertAction | variant | 'primary' |
| AlertAction | autoFocus | false (first action gets focus) |
| NotificationQueue | maxVisible | 5 |
