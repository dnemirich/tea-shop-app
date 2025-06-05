import type { FC, PropsWithChildren } from 'react';
import { Button } from '@/common/components/Button/Button.tsx';
import s from './Modal.module.scss';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';

type Props = {
  onClose: () => void;
};

export const Modal: FC<PropsWithChildren<Props>> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className={s.modalBackdrop}>
      <div className={s.modalContent}>
        <Button onClick={onClose} className={s.closeBtn}>
          <X />
        </Button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
