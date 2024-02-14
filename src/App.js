import React, { useState, useEffect } from "react";
import "./App.css";

const baseUrl = "https://scmq7n.a.searchspring.io/api/search/search.json";

const App = () => {
  const [searchItem, setsearchItem] = useState("jeans");
  const [CartCount, setCartCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData(searchItem, 1);
  }, []);

  const loadData = (query, pageNumber) => {
    fetch(
      baseUrl +
        "?" +
        new URLSearchParams({
          q: query,
          resultsFormat: "native",
          page: pageNumber,
          siteId: "scmq7n",
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = () => {
    loadData(searchItem, 1);
  };

  const handleAddToCart = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const handlePreviousPage = () => {
    if (data && data.pagination && data.pagination.prevbtn !== 0) {
      loadData(searchItem, data.pagination.previousPage);
    }
  };

  const handleNextPage = () => {
    if (data && data.pagination && data.pagination.nextbtn !== 0) {
      loadData(searchItem, data.pagination.nextPage);
    }
  };

  return (
    <div className="mainContainer">
      {/***Search filter */}
      <div className="search-main-container">
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            value={searchItem}
            onChange={(e) => setsearchItem(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        {/*****  Cart Count *****/}
        <div className="item-count">
          Items in the Basket
          <span>{CartCount}</span>
        </div>
      </div>

      {/***Display Data *****/}

      {data && (
        <div className="product-container">
          {data.results.map((result) => (
            <div key={result.id} className="product-card">
              <img
                className="product-image"
                src={
                  result.thumbnailImageUrl
                    ? result.thumbnailImageUrl
                    : result.imageUrl || "img/img-not-avail.png"
                }
                alt={result.name}
              />
              <div className="product_desc_block">
                <span className="product-name">{result.name}</span>
                <div className="product-price">
                  <span className="mainprice">
                    ${(result.msrp * 1).toFixed(2)}
                  </span>
                </div>
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          {/****  Pagination *****/}

          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="pagination-card">
              <button className=" prevbtn" onClick={handlePreviousPage}>
                Previous Page
              </button>
              <p className="pageNo"> {data.pagination.currentPage}</p>
              <button className="nextbtn" onClick={handleNextPage}>
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
