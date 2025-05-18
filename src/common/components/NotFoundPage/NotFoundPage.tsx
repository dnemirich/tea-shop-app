import React from 'react';
import s from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={s.container}>
      <h1 className={s.heading}>404</h1>
      <div className={s.message}>Sorry, we could not find this page.</div>
      <div className={s.subtext}>
        But do not worry, you can find plenty of other things on our homepage.
      </div>
      <Link className={s.linkAsBtn} to={ROUTES.HOME}>
        Back to homepage
      </Link>
    </div>
  );
};
