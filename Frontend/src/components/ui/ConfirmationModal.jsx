import { FiAlertTriangle } from 'react-icons/fi';

function ConfirmationModal({
  show,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1055,
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header border-0 pb-0">
              <div className="d-flex align-items-center gap-2">
                <div className="text-warning fs-4">
                  <FiAlertTriangle />
                </div>
                <h5 className="modal-title fw-bold mb-0">{title}</h5>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                disabled={loading}
              ></button>
            </div>

            <div className="modal-body py-3">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </button>

              <button
                type="button"
                className="btn btn-danger px-4 d-flex align-items-center gap-2"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {loading ? 'Deleting...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop show"
        style={{ zIndex: 1050 }}
      ></div>
    </>
  );
}

export default ConfirmationModal;