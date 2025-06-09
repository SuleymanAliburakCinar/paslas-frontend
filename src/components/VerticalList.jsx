import React, { useState, useMemo } from "react";
import styles from "./VerticalList.module.css";

export function VerticalList({
  items,
  renderItem,
  title,
  onItemClick,
  sortOptions = [],
  defaultSort = null,
  dropdownVisible = true,
}) {
  const [selectedSort, setSelectedSort] = useState(defaultSort);

  const sortedItems = useMemo(() => {
    if (!selectedSort || sortOptions.length === 0) return items;

    const sortOption = sortOptions.find(opt => opt.value === selectedSort);
    if (!sortOption || typeof sortOption.sortFn !== "function") return items;

    return [...items].sort(sortOption.sortFn);
  }, [items, selectedSort, sortOptions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}

        {sortOptions.length > 0 && dropdownVisible && (
          <select
            className={styles.sortSelect}
            value={selectedSort || ""}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="">Sırala</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.list}>
        {sortedItems.map((item, index) => (
          <div
            key={index}
            className={styles.listItem}
            onClick={() => onItemClick?.(item.id)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}