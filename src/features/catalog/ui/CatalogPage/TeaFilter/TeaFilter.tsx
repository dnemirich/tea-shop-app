import React, { useEffect, useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import styles from './teaFilter.module.css';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';

type TeaFilterProps = {
  selectedFlavors: string[];
  selectedOrigins: string[];
  selectedCaffeine: boolean | null;
  selectedTeaTypes: string[];
  onFlavorToggle: (name: string) => void;
  onOriginToggle: (name: string) => void;
  onCaffeineToggle: (checked: boolean) => void;
  onTeaTypeToggle: (name: string) => void;
};

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
      'Puer',
      'Oolong',
      'Rooibos',
      'Fruit tea',
    ],
  },
  {
    title: 'ORIGIN',
    key: 'origins',
    options: ['Russia', 'Sri Lanka', 'Germany', 'China', 'India', 'Japan', 'Taiwan'],
  },
  {
    title: 'FLAVOR',
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
    title: 'CAFFEINE',
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

  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryName) return;
    const normalized = categoryName.replace(/-/g, ' ').toLowerCase();

    const matchingOption = FILTERS[0].options.find((opt) => opt.toLowerCase() === normalized);

    if (matchingOption) {
      setExpanded((prev) => ({ ...prev, [FILTERS[0].title]: true }));

      if (!selectedTeaTypes.includes(matchingOption)) {
        onTeaTypeToggle(matchingOption);
      }
    }
  }, [categoryName, onTeaTypeToggle, selectedTeaTypes]);

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

  const hasActiveFilters =
    selectedFlavors.length > 0 ||
    selectedOrigins.length > 0 ||
    selectedTeaTypes.length > 0 ||
    selectedCaffeine;

  const resetFilters = () => {
    // Clear all selected flavors
    selectedFlavors.forEach((flavor) => onFlavorToggle(flavor));
    // Clear all selected origins
    selectedOrigins.forEach((origin) => onOriginToggle(origin));
    // Clear all selected tea types
    selectedTeaTypes.forEach((type) => onTeaTypeToggle(type));
    // Reset caffeine toggle if it's active
    if (selectedCaffeine) {
      onCaffeineToggle(false);
    }

    navigate(ROUTES.SHOP);
  };

  return (
    <div className={styles.teaFilterContainer}>
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className={styles.resetButton}
          aria-label="Reset all filters"
        >
          <X size={16} />
          Reset filters
        </button>
      )}

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
                  onChange={(e) => onCaffeineToggle(e.target.checked)}
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
