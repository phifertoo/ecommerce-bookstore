import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  //load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        /*the data returned from getFilteredProducts is stored 
          in the state */
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  //This function creates a new filter object then sets the state with it.
  //filters = specific criteria
  // filterBy = type of filter (i.e. category, price, etc)

  const handleFilters = (filters, filterBy) => {
    //newFilters are the current filters in the state
    const newFilters = { ...myFilters };
    /*setting the filter propertes in the state to the filters that
    are passed into handleFilters [filterBy] is the filter
    that the user selects and is passed into the function*/
    newFilters.filters[filterBy] = filters;

    //if we filter by price, we want to use an array that specifies the range
    if (filterBy == "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    /*myFilters.filters are the filters that were selected
    using setMyFilters*/
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    //prices object from the fixed prices file
    const data = prices;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <Layout
      className="container-fluid"
      title="Shop Page"
      description="Shop and find books of your choice"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by Categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              /*we pass in the handleFilters function as a prop into Checkbox
              by passing in the parameters and calling handleFilters.
              Since handleFilters is being called, handleFilters needs to 
              be a higher order function otherwise, it will keep rerendering*/
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>
          <h4>Filter by Price Range</h4>
          <div>
            <RadioBox
              prices={prices}
              /*we pass in the handleFilters function as a prop into Checkbox
              by passing in the parameters and calling handleFilters.
              Since handleFilters is being called, handleFilters needs to 
              be a higher order function otherwise, it will keep rerendering*/
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>
        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row col-12 mr-3">
            {filteredResults.map((product, i) => (
              <Card key={i} product={product} />
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
