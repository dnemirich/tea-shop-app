import React from 'react';
import s from './stepper.module.scss';

export const Stepper = () => {
  const steps = ['1. my bag', '2. delivery', '3. review & payment'];

  return (
    <div className={s.stepperWrapper}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={s.stepperItem}>
            <p className={s.step}>{step}</p>
            {index < steps.length - 1 && <span className={s.line} />}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
