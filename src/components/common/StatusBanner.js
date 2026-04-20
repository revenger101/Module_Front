function StatusBanner({ loading, message }) {
  return (
    <span className="status-chip" aria-live="polite">
      {loading ? 'Syncing...' : message}
    </span>
  );
}

export default StatusBanner;
