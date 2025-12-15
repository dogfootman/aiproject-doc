/**
 * Notification System API Contract
 *
 * This file defines the public API for the notification system.
 * Components use these interfaces to interact with notifications.
 */

// ============================================================================
// Types
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

// ============================================================================
// Notification Interfaces
// ============================================================================

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  /** Optional title displayed above the message */
  title?: string;
  /** Duration in ms before auto-dismiss (default: 5000) */
  duration?: number;
  /** Show close button (default: true) */
  dismissible?: boolean;
  /** If true, notification persists until manually closed */
  persistent?: boolean;
}

/**
 * Full notification object with all properties
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration: number;
  dismissible: boolean;
  persistent: boolean;
  timestamp: Date;
}

// ============================================================================
// Alert Interfaces
// ============================================================================

/**
 * Action button configuration for alert dialogs
 */
export interface AlertAction {
  /** Button label text */
  label: string;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Auto-focus this button when dialog opens */
  autoFocus?: boolean;
}

/**
 * Options for creating an alert dialog
 */
export interface AlertOptions {
  /** Alert title (required) */
  title: string;
  /** Alert message content (required) */
  message: string;
  /** Action buttons (at least one required) */
  actions: AlertAction[];
  /** Visual styling type (default: error) */
  type?: NotificationType;
  /** Allow closing without clicking an action (default: false) */
  dismissible?: boolean;
}

/**
 * Full alert configuration with all properties
 */
export interface AlertConfig extends AlertOptions {
  id: string;
}

// ============================================================================
// Hook API
// ============================================================================

/**
 * Notification hook return type
 *
 * @example
 * ```tsx
 * const { toast, alert, dismiss, dismissAll } = useNotification();
 *
 * // Show success toast
 * toast.success('Data saved successfully');
 *
 * // Show error toast with title
 * toast.error('Failed to save data', { title: 'Save Error' });
 *
 * // Show persistent warning
 * toast.warning('Session expiring soon', { persistent: true });
 *
 * // Show critical alert
 * alert({
 *   title: 'Session Expired',
 *   message: 'Your session has expired. Please log in again.',
 *   actions: [
 *     { label: 'Log In', onClick: () => navigate('/login') }
 *   ]
 * });
 * ```
 */
export interface UseNotificationReturn {
  /** Toast notification methods */
  toast: {
    /** Show success notification */
    success: (message: string, options?: ToastOptions) => string;
    /** Show error notification */
    error: (message: string, options?: ToastOptions) => string;
    /** Show warning notification */
    warning: (message: string, options?: ToastOptions) => string;
    /** Show info notification */
    info: (message: string, options?: ToastOptions) => string;
  };

  /** Show critical alert dialog */
  alert: (options: AlertOptions) => string;

  /** Dismiss specific notification by ID */
  dismiss: (id: string) => void;

  /** Dismiss all notifications */
  dismissAll: () => void;
}

// ============================================================================
// Context API
// ============================================================================

/**
 * Notification context state
 */
export interface NotificationState {
  /** Currently visible toasts */
  toasts: Notification[];
  /** Queued toasts waiting to display */
  pendingToasts: Notification[];
  /** Currently visible/queued alerts */
  alerts: AlertConfig[];
}

/**
 * Notification context actions
 */
export interface NotificationActions {
  /** Add a toast notification */
  addToast: (type: NotificationType, message: string, options?: ToastOptions) => string;
  /** Add an alert dialog */
  addAlert: (options: AlertOptions) => string;
  /** Remove a notification by ID */
  removeNotification: (id: string) => void;
  /** Remove all notifications */
  clearAll: () => void;
}

/**
 * Full notification context value
 */
export interface NotificationContextValue extends NotificationState, NotificationActions {}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Toast component props
 */
export interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

/**
 * AlertDialog component props
 */
export interface AlertDialogProps {
  alert: AlertConfig;
  onDismiss: (id: string) => void;
}

/**
 * NotificationContainer component props
 */
export interface NotificationContainerProps {
  /** Position on screen */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Maximum visible toasts */
  maxVisible?: number;
}
