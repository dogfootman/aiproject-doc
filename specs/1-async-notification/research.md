# Research: Async Notification System

**Feature**: 002-async-notification
**Date**: 2025-12-12

## 1. State Management Approach

### Decision: React Context API

**Rationale**:
- Notification state is simple (array of notifications + queue)
- No complex state derivations or middleware needs
- Built into React, no additional dependencies
- Sufficient for cross-component access pattern needed

**Alternatives Considered**:

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Redux | Predictable state, devtools | Overkill for simple notification state | Added complexity without benefit |
| Zustand | Lightweight, simple API | Extra dependency | Context API sufficient |
| Jotai/Recoil | Atomic state management | Learning curve, extra dependency | Notification is single concern |

## 2. Toast Positioning Strategy

### Decision: Fixed positioning with CSS, bottom-right default

**Rationale**:
- Fixed position ensures visibility regardless of scroll position
- Bottom-right is standard convention (least intrusive to main content)
- CSS-only solution, no JS calculations needed
- Stacking handled with flexbox/grid

**Implementation**:
```css
.notification-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  z-index: 9999;
}
```

## 3. Animation Approach

### Decision: CSS transitions with transform/opacity

**Rationale**:
- Hardware-accelerated (GPU) for smooth 60fps
- Simple implementation, no animation library needed
- Entrance: slide-in from right with fade-in
- Exit: fade-out

**Alternatives Considered**:

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Framer Motion | Powerful, declarative | Large bundle size (~30kb) | Simple animations don't justify size |
| React Spring | Physics-based | Learning curve | Overkill for fade/slide |
| CSS @keyframes | Full control | More complex to manage | Transitions simpler for this case |

## 4. Notification Queue Management

### Decision: In-memory array with max visible limit

**Rationale**:
- Simple array push/shift operations
- Max 5 visible toasts at once
- FIFO (First In, First Out) for auto-dismissible toasts
- Error toasts exempt from auto-removal

**Algorithm**:
1. New notification arrives → add to queue
2. If visible count < 5 → display immediately
3. If visible count >= 5 → queue notification, remove oldest auto-dismissible
4. On dismiss → remove from visible, promote next from queue

## 5. Accessibility Implementation

### Decision: ARIA live regions with role="alert"

**Rationale**:
- Screen readers announce notifications automatically
- `role="alert"` for important messages
- `aria-live="polite"` for non-critical notifications
- Focus management not required (non-modal toasts)

**Implementation**:
```tsx
// Success/Info: polite
<div role="status" aria-live="polite">
  {message}
</div>

// Error/Warning: assertive
<div role="alert" aria-live="assertive">
  {message}
</div>
```

## 6. Modal Alert Implementation

### Decision: Portal-based modal with focus trap

**Rationale**:
- Portal ensures modal renders outside normal DOM hierarchy
- Focus trap required for accessibility (critical alerts)
- Backdrop prevents background interaction
- ESC key handling for dismissal

**Implementation**:
- Use React Portal to render at document.body
- Implement focus trap on mount
- Return focus to trigger element on unmount

## 7. Design Token Integration

### Decision: Use existing design system tokens

**Rationale**:
- Maintain visual consistency with application
- Leverage existing color palette (success/error/warning/info)
- Follow established spacing and typography scales

**Token Mapping**:

| Type | Background | Border | Icon |
|------|------------|--------|------|
| Success | `--color-success-light` | `--color-success` | checkmark |
| Error | `--color-error-light` | `--color-error` | x-circle |
| Warning | `--color-warning-light` | `--color-warning` | alert-triangle |
| Info | `--color-info-light` | `--color-info` | info-circle |

## 8. Auto-Dismiss Timing

### Decision: 5 seconds default, configurable per notification

**Rationale**:
- 5 seconds is industry standard for toast duration
- Long enough to read, short enough not to clutter
- Error toasts require manual dismiss (persist until closed)
- API allows custom duration per notification

**Implementation**:
```typescript
interface NotificationOptions {
  duration?: number; // ms, default 5000
  persistent?: boolean; // overrides duration
}
```

## 9. Mobile Responsiveness

### Decision: Full-width toasts on mobile, centered positioning

**Rationale**:
- Bottom-right positioning doesn't work well on narrow screens
- Full-width provides better touch targets
- Center-bottom positioning on mobile

**Breakpoint**:
```css
@media (max-width: 480px) {
  .notification-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
  .toast {
    width: 100%;
  }
}
```

## Summary

All technical decisions favor simplicity and leverage existing React/CSS capabilities:

- **No additional dependencies** for state, animation, or modal management
- **CSS-first approach** for positioning and animations
- **Accessibility built-in** with ARIA live regions
- **Mobile-responsive** with minimal CSS changes
- **Extensible API** for future enhancements without breaking changes
