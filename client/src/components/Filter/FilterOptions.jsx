import React from 'react';
import styles from '../Filter/Filter.module.css'

const FilterOptions = ({ onFilter, selectedFilter }) => {
  const filterNames = {
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month'
  };

  return (
    <div className={styles.filterOptions}>
      {Object.entries(filterNames).map(([filterKey, filterName]) => (
        <p key={filterKey} className={selectedFilter === filterKey ? styles.selected : ''} onClick={() => onFilter(filterKey)}>{filterName}</p>
      ))}
    </div>
  );
};

export default FilterOptions;