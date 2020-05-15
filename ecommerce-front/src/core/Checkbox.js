import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);
  // the category id is being passed into handleToggle
  const handleToggle = (c) => () => {
    //return the first index or -1
    const currentCategoryId = checked.indexOf(c);
    //the newCheckedCategoryId is whatever categoryId is in the state
    const newCheckedCategoryId = [...checked];
    /*if currently checked category was not already in the checked state, 
    then add it to the state. Else take it out of the state */
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      <input
        onChange={handleToggle(c._id)}
        type="checkbox"
        className="form-check-input"
        value={checked.indexOf(c._id === -1)}
      />
      <label className="form-check-label">{c.name}</label>
    </li>
  ));
};

export default Checkbox;
