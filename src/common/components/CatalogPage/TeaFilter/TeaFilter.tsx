import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import styles from './teafilter.module.css';
import { TeaFilterProps } from '../Types/catalogTypes';



const FILTERS = [
  {
    title: 'COLLECTIONS',
    key: 'teaTypes',
    options: [
      'Black tea',
      'Green tea',
      'White tea',
      'Matcha',
      'Herbal tea',
      'Pu’er',
      'Oolong',
      'Rooibos',
    ],
  },
  {
    title: 'ORIGIN',
    key: 'origins',
    options: ['russia', 'sri lanka', 'germany', 'china', 'india', 'japan', 'taiwan'],
  },
  {
    title: 'FLAVOUR',
    key: 'flavors',
    options: [
      'spicy',
      'malty',
      'citrus',
      'marine',
      'fruity',
      'floral',
      'woody',
      'herbal',
      'sweet',
      'smoky',
      'berry',
      'dried fruits',
      'nutty',
      'milky',
      'earthy',
    ],
  },
  {
    title: 'NO CAFFEINE',
    key: 'caffeine',
    options: [],
    isToggle: true,
  },
];

export const TeaFilter: React.FC<TeaFilterProps> = ({
  selectedFlavors,
  selectedOrigins,
  selectedCaffeine,
  selectedTeaTypes,
  onFlavorToggle,
  onOriginToggle,
  onCaffeineToggle,
  onTeaTypeToggle,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isSelected = (key: string, name: string): boolean => {
    switch (key) {
      case 'flavors':
        return selectedFlavors.includes(name);
      case 'origins':
        return selectedOrigins.includes(name);
      case 'teaTypes':
        return selectedTeaTypes.includes(name);
      default:
        return false;
    }
  };

  const handleToggle = (key: string, name: string) => {
    switch (key) {
      case 'flavors':
        onFlavorToggle(name);
        break;
      case 'origins':
        onOriginToggle(name);
        break;
      case 'teaTypes':
        onTeaTypeToggle(name);
        break;
    }
  };

  return (
    <div className={styles.teaFilterContainer}>
      {FILTERS.map((filter) => (
        <div key={filter.title} className={styles.filterCategory}>
          <div
            className={styles.categoryHeader}
            onClick={() => !filter.isToggle && toggleExpanded(filter.title)}
            onKeyDown={(e) => {
              if (!filter.isToggle && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleExpanded(filter.title);
              }
            }}
            tabIndex={0}
            role={filter.isToggle ? undefined : 'button'}
            aria-expanded={filter.isToggle ? undefined : expanded[filter.title]}
          >
            <h3 className={styles.categoryTitle}>{filter.title}</h3>
            {filter.isToggle ? (
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={selectedCaffeine === true}
                  onChange={onCaffeineToggle}
                  aria-label="Contains caffeine"
                />
                <span className={styles.toggleSlider}></span>
              </label>
            ) : (
              <span className={styles.toggleIcon}>
                {expanded[filter.title] ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            )}
          </div>

          {!filter.isToggle && expanded[filter.title] && (
            <div className={styles.categoryOptions}>
              {filter.options.map((option) => (
                <div key={option} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`${filter.title}-${option}`}
                    checked={isSelected(filter.key, option)}
                    onChange={() => handleToggle(filter.key, option)}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={`${filter.title}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
