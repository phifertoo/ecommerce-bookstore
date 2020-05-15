import React, { useState, useEffect, Fragment } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event) => {
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  return prices.map((p, i) => (
    <div key={i}>
      <input
        onChange={handleChange}
        type="radio"
        className="mr-2 ml-4"
        /*${p._id} is the value that is passed into 
        event.target.value when handleChange is called*/
        value={`${p._id}`}
        /* radio buttons by nature are mutually exclusive
        so when you set the "name" to a dynamimc value and another
        "name" is chosen, the other "name" automatically be deslected.*/
        name={p}
      />
      <label className="form-check-label">{p.name}</label>
    </div>
  ));
};

export default RadioBox;
