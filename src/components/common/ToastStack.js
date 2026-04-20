function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <span>{toast.message}</span>
          <button type="button" className="toast-close" onClick={() => onDismiss(toast.id)}>x</button>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
