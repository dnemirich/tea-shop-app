import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';
import styles from './teafilter.module.css';

export type FilterOption = {
  name: string;
  selected: boolean;
};

export type FilterCategory = {
  title: string;
  options: FilterOption[];
  isToggle?: boolean;
};

type TeaFilterProps = {
  onFlavorChange?: (selected: string[]) => void;
  onOriginChange?: (selected: string[]) => void;
  onCaffeineChange?: (selected: boolean | null) => void;
  onIngredientsChange?: (selected: string[]) => void;
  onTeaTypeChange?: (selected: string[]) => void;
};

export const TeaFilter: React.FC<TeaFilterProps> = ({
  onFlavorChange,
  onOriginChange,
  onCaffeineChange,
  onIngredientsChange,
  onTeaTypeChange,
}) => {
  const [filters, setFilters] = useState<FilterCategory[]>([
    {
      title: 'COLLECTIONS',
      options: [
        { name: 'Black tea', selected: false },
        { name: 'Green tea', selected: false },
        { name: 'White tea', selected: false },
        { name: 'Matcha', selected: false },
        { name: 'Herbal tea', selected: false },
        { name: 'Pu’er', selected: false },
        { name: 'Oolong', selected: false },
        { name: 'Rooibos', selected: false },
      ],
    },
    {
      title: 'ORIGIN',
      options: [
        { name: 'russia', selected: false },
        { name: 'sri lanka', selected: false },
        { name: 'germany', selected: false },
        { name: 'china', selected: false },
        { name: 'india', selected: false },
        { name: 'japan', selected: false },
        { name: 'taiwan', selected: false },
      ],
    },
    {
      title: 'FLAVOUR',
      options: [
        { name: 'spicy', selected: false },
        { name: 'malty', selected: false },
        { name: 'citrus', selected: false },
        { name: 'marine', selected: false },
        { name: 'fruity', selected: false },
        { name: 'floral', selected: false },
        { name: 'woody', selected: false },
        { name: 'herbal', selected: false },
        { name: 'sweet', selected: false },
        { name: 'smoky', selected: false },
        { name: 'berry', selected: false },
        { name: 'dried fruits', selected: false },
        { name: 'nutty', selected: false },
        { name: 'milky', selected: false },
        { name: 'earthy', selected: false },
      ],
    },
    {
      title: 'INGREDIENTS',
      options: [],
    },
    {
      title: 'NO CAFFEINE',
      options: [],
      isToggle: true,
    },
  ]);

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [caffeineToggle, setCaffeineToggle] = useState(false);

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleFilterChange = (categoryIndex: number, optionIndex: number) => {
    const updatedFilters = [...filters];
    updatedFilters[categoryIndex].options[optionIndex].selected =
      !updatedFilters[categoryIndex].options[optionIndex].selected;
    setFilters(updatedFilters);

    const title = updatedFilters[categoryIndex].title;
    const selectedOptions = updatedFilters[categoryIndex].options
      .filter((opt) => opt.selected)
      .map((opt) => opt.name);

    if (title === 'FLAVOUR' && onFlavorChange) {
      onFlavorChange(selectedOptions);
    } else if (title === 'ORIGIN' && onOriginChange) {
      onOriginChange(selectedOptions);
    } else if (title === 'INGREDIENTS' && onIngredientsChange) {
      onIngredientsChange(selectedOptions);
    } else if (title === 'COLLECTIONS' && onTeaTypeChange) {
      onTeaTypeChange(selectedOptions);
    }
  };

  const handleCaffeineToggle = () => {
    const newState = !caffeineToggle;
    setCaffeineToggle(newState);

    if (onCaffeineChange) {
      onCaffeineChange(newState);
    }
  };
  return (
    <div className={styles.teaFilterContainer}>
      {filters.map((category, categoryIndex) => (
        <div key={category.title} className={styles.filterCategory}>
          <div
            className={styles.categoryHeader}
            onClick={() => !category.isToggle && toggleCategory(category.title)}
            onKeyDown={(e) => {
              if (!category.isToggle && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleCategory(category.title);
              }
            }}
            tabIndex={0}
            role={category.isToggle ? undefined : 'button'}
            aria-expanded={category.isToggle ? undefined : expandedCategories[category.title]}
            aria-controls={category.isToggle ? undefined : `${category.title}-options`}
            id={`${category.title}-header`}
          >
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            {category.isToggle ? (
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={caffeineToggle}
                  onChange={handleCaffeineToggle}
                  aria-label="Toggle caffeine filter"
                />
                <span className={styles.toggleSlider}></span>
              </label>
            ) : (
              <span className={styles.toggleIcon} aria-hidden="true">
                {expandedCategories[category.title] ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            )}
          </div>

          {!category.isToggle && expandedCategories[category.title] && (
            <div
              id={`${category.title}-options`}
              className={styles.categoryOptions}
              aria-labelledby={`${category.title}-header`}
            >
              {category.options.map((option, optionIndex) => (
                <div key={option.name} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`${category.title}-${option.name}`}
                    checked={option.selected}
                    onChange={() => handleFilterChange(categoryIndex, optionIndex)}
                    className={styles.filterCheckbox}
                  />
                  <label htmlFor={`${category.title}-${option.name}`}>{option.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
