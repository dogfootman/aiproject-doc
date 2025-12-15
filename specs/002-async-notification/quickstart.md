# Quickstart: Async Notification System

**Feature**: 002-async-notification
**Date**: 2025-12-12

## Installation

The notification system is built into the application. No additional packages required.

## Setup

### 1. Add NotificationProvider to App Root

Wrap your application with the `NotificationProvider` component:

```tsx
// App.tsx
import { NotificationProvider } from '@/contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <YourAppContent />
    </NotificationProvider>
  );
}
```

### 2. Add NotificationContainer

Place the `NotificationContainer` component at the root level (inside the provider):

```tsx
// App.tsx
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationContainer } from '@/components/organisms/NotificationContainer';

function App() {
  return (
    <NotificationProvider>
      <YourAppContent />
      <NotificationContainer />
    </NotificationProvider>
  );
}
```

## Basic Usage

### Show Toast Notifications

```tsx
import { useNotification } from '@/hooks/useNotification';

function MyComponent() {
  const { toast } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Data saved successfully');
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Toast Types

```tsx
const { toast } = useNotification();

// Success - green, checkmark icon, auto-dismiss 5s
toast.success('Operation completed');

// Error - red, X icon, persists until closed
toast.error('Something went wrong');

// Warning - yellow, alert icon, auto-dismiss 5s
toast.warning('Please review your input');

// Info - blue, info icon, auto-dismiss 5s
toast.info('New updates available');
```

### Custom Options

```tsx
// With title
toast.success('Your changes have been saved', {
  title: 'Success'
});

// Custom duration (10 seconds)
toast.info('Processing...', {
  duration: 10000
});

// Persistent (no auto-dismiss)
toast.warning('Action required', {
  persistent: true
});

// Non-dismissible (no close button)
toast.info('Please wait...', {
  dismissible: false,
  persistent: true
});
```

### Show Alert Dialogs

For critical messages requiring user acknowledgment:

```tsx
import { useNotification } from '@/hooks/useNotification';

function MyComponent() {
  const { alert } = useNotification();

  const handleLogout = () => {
    alert({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      type: 'warning',
      actions: [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => console.log('Cancelled')
        },
        {
          label: 'Log Out',
          variant: 'danger',
          onClick: () => performLogout()
        }
      ]
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Dismiss Notifications

```tsx
const { toast, dismiss, dismissAll } = useNotification();

// Store notification ID
const id = toast.info('Processing...');

// Dismiss specific notification
dismiss(id);

// Dismiss all notifications
dismissAll();
```

## Common Patterns

### API Call with Notification

```tsx
async function handleSubmit() {
  const { toast } = useNotification();

  try {
    await api.submitForm(data);
    toast.success('Form submitted successfully');
  } catch (error) {
    if (error.status === 401) {
      toast.error('Please log in to continue');
    } else {
      toast.error(error.message || 'Failed to submit form');
    }
  }
}
```

### Loading State with Notification

```tsx
async function handleUpload(file: File) {
  const { toast, dismiss } = useNotification();

  const loadingId = toast.info('Uploading...', {
    persistent: true,
    dismissible: false
  });

  try {
    await uploadFile(file);
    dismiss(loadingId);
    toast.success('File uploaded successfully');
  } catch (error) {
    dismiss(loadingId);
    toast.error('Upload failed');
  }
}
```

### Session Expiry Alert

```tsx
function SessionManager() {
  const { alert } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpiry = () => {
      alert({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again to continue.',
        type: 'error',
        dismissible: false,
        actions: [
          {
            label: 'Log In',
            variant: 'primary',
            autoFocus: true,
            onClick: () => navigate('/login')
          }
        ]
      });
    };

    authService.onSessionExpiry(handleSessionExpiry);
  }, []);
}
```

## Configuration

### Container Position

```tsx
<NotificationContainer position="bottom-right" /> // default
<NotificationContainer position="top-right" />
<NotificationContainer position="top-center" />
```

### Max Visible Toasts

```tsx
<NotificationContainer maxVisible={3} /> // default is 5
```

## Accessibility

- Toasts use `role="status"` or `role="alert"` for screen readers
- Error/warning use `aria-live="assertive"`
- Success/info use `aria-live="polite"`
- Alert dialogs trap focus and return focus on close
- All interactive elements are keyboard accessible
