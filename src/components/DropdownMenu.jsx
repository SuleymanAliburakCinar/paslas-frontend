import React, { useState, useRef, useEffect } from "react";
import styles from "./DropdownMenu.module.css";

export function DropdownMenu({
  options,
  onSelect
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <div
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        ...
      </div>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
