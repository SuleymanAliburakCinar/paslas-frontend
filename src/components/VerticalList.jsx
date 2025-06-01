import React from "react";
import styles from "./VerticalList.module.css";

export function VerticalList({ items, renderItem, title, onItemClick }) {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.list}>
        {items.map((item, index) => (
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