import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';
import { FilterCategory } from '../../types/catalog-types';

const TeaFilter: React.FC = () => {
  const [filters, setFilters] = useState<FilterCategory[]>([
    {
      title: 'COLLECTIONS',
      options: [
        { name: 'Black teas', selected: false },
        { name: 'Green teas', selected: false },
        { name: 'White teas', selected: false },
        { name: 'Matcha', selected: false },
        { name: 'Herbal teas', selected: false },
        { name: 'Pu’er', selected: false },
        { name: 'Oolong', selected: false },
        { name: 'Rooibos', selected: false },
        { name: 'Teaware', selected: false },
      ],
    },
    {
      title: 'ORIGIN',
      options: [
        { name: 'Russia', selected: false },
        { name: 'Sri Lanka', selected: false },
        { name: 'Germany', selected: false },
        { name: 'China', selected: false },
        { name: 'India', selected: false },
        { name: 'Japan', selected: false },
        { name: 'Taiwan', selected: false },
      ],
    },
    {
      title: 'FLAVOUR',
      options: [
        { name: 'Spicy', selected: false },
        { name: 'Malty', selected: false },
        { name: 'Citrus', selected: false },
        { name: 'Marine', selected: false },
        { name: 'Fruity', selected: false },
        { name: 'Floral', selected: false },
        { name: 'Woody', selected: false },
        { name: 'Herbal', selected: false },
        { name: 'Sweet', selected: false },
        { name: 'Smoky', selected: false },
        { name: 'Berry', selected: false },
        { name: 'Dried fruits', selected: false },
        { name: 'Nutty', selected: false },
        { name: 'Milky', selected: false },
        { name: 'Earthy', selected: false },
      ],
    },
    {
      title: 'INGREDIENTS',
      options: [],
    },
    {
      title: 'CAFFEINE',
      options: [
        { name: 'With caffeine', selected: false },
        { name: 'Caffeine-free', selected: false },
      ],
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
  };

  const handleCaffeineToggle = () => {
    const newState = !caffeineToggle;
    setCaffeineToggle(newState);

    const updatedFilters = [...filters];
    const caffeineCategoryIndex = updatedFilters.findIndex((f) => f.title === 'CAFFEINE');

    if (caffeineCategoryIndex !== -1) {
      updatedFilters[caffeineCategoryIndex].options = [
        { name: 'With caffeine', selected: newState },
        { name: 'Caffeine-free', selected: !newState },
      ];
      setFilters(updatedFilters);
    }
  };

  return (
    <div className="tea-filter-container">
      {filters.map((category, categoryIndex) => (
        <div key={category.title} className="filter-category">
          <div
            className="category-header"
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
            <h3 className="category-title">{category.title}</h3>
            {category.isToggle ? (
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={caffeineToggle}
                  onChange={handleCaffeineToggle}
                  aria-label="Toggle caffeine filter"
                />
                <span className="toggle-slider"></span>
              </label>
            ) : (
              <span className="toggle-icon" aria-hidden="true">
                {expandedCategories[category.title] ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            )}
          </div>

          {!category.isToggle && expandedCategories[category.title] && (
            <div
              id={`${category.title}-options`}
              className="category-options"
              aria-labelledby={`${category.title}-header`}
            >
              {category.options.map((option, optionIndex) => (
                <div key={option.name} className="filter-option">
                  <input
                    type="checkbox"
                    id={`${category.title}-${option.name}`}
                    checked={option.selected}
                    onChange={() => handleFilterChange(categoryIndex, optionIndex)}
                    className="filter-checkbox"
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

export default TeaFilter;
