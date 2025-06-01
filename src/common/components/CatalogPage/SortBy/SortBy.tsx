import { useState } from 'react';
import styles from './sortby.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SortOption, SortByProps } from '../Types/catalogTypes';


const sortOptions: SortOption[] = [
  { value: 'price-asc', label: 'By price: lower' },
  { value: 'price-desc', label: 'By price: upper' },
  { value: 'name-asc', label: 'By alphabet: A-Z' },
  { value: 'name-desc', label: 'By alphabet: Z-A' },
];

export const SortBy = ({ onSortChange }: SortByProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(sortOptions[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: SortOption) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onSortChange) {
      onSortChange(option.value);
    }
  };

  return (
    <div className={styles.sortDropdown}>
      <button className={styles.toggleButton} onClick={toggleDropdown}>
        {selectedOption.label} {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {sortOptions.map((option) => (
            <li key={option.value} className={styles.menuItem} role="none">
              <button className={styles.menuButton} onClick={() => handleSelect(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
