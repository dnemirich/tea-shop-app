import s from './MyDetails.module.scss';

export const MyDetails = () => {
  return (
    <div className={s.myDetailsWrapper}>
      <div>
        <span>First name</span>
        <input type="text" value="Bubu" />
      </div>
      <div>
        <span>Last name</span>
        <input type="text" value="Bebe" />
      </div>
      <div>
        <span>Date of birth</span>
        <input type="text" value="Bubu" />
      </div>
    </div>
  );
};
