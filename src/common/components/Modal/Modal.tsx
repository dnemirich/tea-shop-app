import s from './modal.module.css';

export const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className={cl['modal-backdrop']}>
    <div className={cl['modal-content']}>
      <p>{message}</p>
      <button onClick={onClose} className={cl['modal-button']}>
        OK
      </button>
    </div>
  </div>
);
