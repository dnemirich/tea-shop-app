import Kettle from '@/assets/icons/kettle-icon.svg';
import Water from '@/assets/icons/water-temp-icon.svg';
import Timer from '@/assets/icons/timer-icon.svg';
import s from './TeaInfoBox.module.scss';

type Props = {
    servingSize: string,
    waterTemp: string,
    steepingTime: string,
    teaColor: string,
    flavor: string[],
    hasCaffeine: string,
    ingredients: string[]
  }

export const TeaInfoBox = ({servingSize, waterTemp, steepingTime,teaColor, hasCaffeine, flavor, ingredients}:Props)=> {
  return <div className={s.lowerContent}>
    <div className={s.leftColumn}>
      <h3 className={s.sectionTitle}>Steeping instructions</h3>
      <ul className={s.attributesList}>
        <li className={s.attributesListItem}>
          <img src={Kettle} alt={'Kettle'} className={s.imgIcon} />
          <span className={s.attributeName}>Serving size:</span>
          <span>{servingSize}</span>
        </li>
        <li className={s.attributesListItem}>
          <img src={Water} alt={'water temp'} className={s.imgIcon} />
          <span className={s.attributeName}>Water temperature:</span>
          <span>{waterTemp}</span>
        </li>
        <li className={s.attributesListItem}>
          <img src={Timer} alt={'Timer'} className={s.imgIcon} />
          <span className={s.attributeName}>Steeping time:</span>
          <span>{steepingTime}</span>
        </li>
        <li className={s.attributesListItem}>
          <span className={s.teaColor} style={{ backgroundColor: teaColor }}></span>
          <span className={s.attributeName}>Tea color</span>
        </li>
      </ul>
    </div>
    <div>
      <div className={s.rightColumn}>
        <h3 className={s.sectionTitle}>About this tea</h3>
        <div className={s.qualitiesContainer}>
          <div className={s.quality}>
            <h4 className={s.attributeName}>Flavor</h4>
            <p>{flavor.join(', ')}</p>
          </div>
          <div className={s.quality}>
            <h4 className={s.attributeName}>Caffeine</h4>
            <p>{hasCaffeine}</p>
          </div>
        </div>
        {ingredients.length > 0 && <>
          <h3 className={s.sectionTitle}>Ingredients</h3>
          <p className={s.ingredientsList}>{ingredients.join(', ')}</p>
        </>}
      </div>
    </div>
  </div>;
}