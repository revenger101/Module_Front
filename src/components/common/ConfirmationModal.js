function ConfirmationModal({ open, title, message, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
