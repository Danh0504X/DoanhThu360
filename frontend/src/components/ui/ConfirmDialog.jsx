import { Button } from './Button.jsx';
import { FormError } from './FormError.jsx';
import { Modal } from './Modal.jsx';

const toneIconClasses = {
  danger: 'bg-accent-red-bg text-accent-red',
  primary: 'bg-primary-50 text-primary-700',
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  description,
  note,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  tone = 'danger',
  isSubmitting = false,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-md ${toneIconClasses[tone]}`}>
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-xl font-semibold text-bone-800">{title}</h3>
        {description ? <p className="mt-3 text-sm leading-6 text-bone-500">{description}</p> : null}
        {note ? <p className="mt-3 rounded-md bg-accent-red-bg px-4 py-3 text-sm text-accent-red">{note}</p> : null}
      </div>

      <FormError message={errorMessage} className="mt-4" />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
