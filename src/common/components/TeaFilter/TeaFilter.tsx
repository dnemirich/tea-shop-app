import React, { useState } from 'react';

type FilterOption = {
  name: string;
  selected: boolean;
};

type FilterCategory = {
  title: string;
  options: FilterOption[];
};

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
      options: [], // Можно добавить опции позже
    },
    {
      title: 'CAFFEINE',
      options: [], // Можно добавить опции позже
    },
  ]);

  // Обработчик изменения состояния чекбокса
  const handleFilterChange = (categoryIndex: number, optionIndex: number) => {
    const updatedFilters = [...filters];
    updatedFilters[categoryIndex].options[optionIndex].selected =
      !updatedFilters[categoryIndex].options[optionIndex].selected;
    setFilters(updatedFilters);
  };

  // Обработчик сброса всех фильтров
  const resetFilters = () => {
    const resetFilters = filters.map((category) => ({
      ...category,
      options: category.options.map((option) => ({ ...option, selected: false })),
    }));
    setFilters(resetFilters);
  };
  return (
    <div className="tea-filter-container">
      <div className="filter-header">
        <h2>Filters</h2>
        <button onClick={resetFilters} className="reset-button">
          Reset all
        </button>
      </div>

      {filters.map((category, categoryIndex) => (
        <div key={category.title} className="filter-category">
          <h3 className="category-title">{category.title}</h3>
          <div className="category-options">
            {category.options.map((option, optionIndex) => (
              <div key={option.name} className="filter-option">
                <input
                  type="checkbox"
                  id={`${category.title}-${option.name}`}
                  checked={option.selected}
                  onChange={() => handleFilterChange(categoryIndex, optionIndex)}
                />
                <label htmlFor={`${category.title}-${option.name}`}>{option.name}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeaFilter;
