import React from "react";
import "./FormField.css"; // CSS dosyasını içe aktarmayı unutma

const FormField = ({ label, type = "text", value, onChange, error }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? "error" : ""}`}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormField;
