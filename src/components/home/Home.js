import { useState, useEffect, useContext, useRef } from "react";
import Layout from "../Layout";
import Card from "./Card";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import { prices } from "../../utils/prices";
import { showError, showSuccess, alertRemove } from "../../utils/messages";
import {
  getCategories,
  getProducts,
  getFilteredProducts,
} from "../../api/apiProduct";
import { addToCart } from "../../api/apiOrder";
import { isAuthenticated, userInfo } from "../../utils/auth";
import Dropdown from "./Dropdown";
import { orders } from "../../utils/orders";
import { sorts } from "../../utils/sorts";
import DropdownSort from "./DropdownSort";
import { StateContext } from "../../StateProvider";
import Loading from "../Loading";

const Home = () => {
  const { searchedProducts, required, reloadAll, setReloadAll } = useContext(StateContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [loadAll, setLoadAll] = useState(false);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });
  const [loading, setLoading] = useState(true);
  const categoryCheckboxSelected = useRef(false);
  const priceRadioSelected = useRef(false);
  const [clearFilter, setClearFilter] = useState(false)
 
  useEffect(() => {

    loadProducts()
    loadCategories()
  }, []);

  useEffect(() => {
    if (skip !== 0) {
      getProducts(sortBy, order, limit, skip)
        .then((response) => {
          if (response.data.length !== 0) {
            Object.values(response.data).forEach((product) => {
              setProducts((current) => [...current, product]);
            });
            setLoadAll(false);
          } else {
            setLoadAll(true);
            alert("Loaded all products");
          }
        })
        .catch((err) => setError("Failed to load products!"));
    }
  }, [skip]);


  const loadCategories = () => {
    getCategories()
    .then((response) => setCategories(response.data))
    .catch((err) => setError("Failed to load categories! ", err));
  }


  const loadProducts = () => {
    getProducts(sortBy, order, limit, skip)
    .then((response) => {
      if (response.data.length !== 0) {
        setProducts(response.data);
        setLoading(false);
      } else {
        setLoadAll(true);
        setLoading(false);
      }
    })
    .catch((err) => setError("Failed to load products!"));
  }

  const handleAddToCart = (product) => () => {
    if (isAuthenticated()) {
      setError(false);
      setSuccess(false);
      const user = userInfo();
      const cartItem = {
        user: user._id,
        product: product._id,
        price: product.price,
      };
      addToCart(user.token, cartItem)
        .then((reponse) => {
          setSuccess(true)
          alertRemove();
        })
        .catch((err) => {
          if (err.response) setError(err.response.data);
          else setError("Adding to cart failed!");
        });
    } else {
      setSuccess(false);
      setError("Please Login First!");
    }
  };

  const handleFilters = (myfilters, filterBy) => {
    const newFilters = { ...filters };
    if (filterBy === "category") {
      newFilters[filterBy] = myfilters;
    }

    if (filterBy === "price") {
      const data = prices;
      let arr = [];
      for (let i in data) {
        if (data[i].id === parseInt(myfilters)) {
          arr = data[i].arr;
        }
      }
      newFilters[filterBy] = arr;
    }

    setFilters(newFilters);
    getFilteredProducts(skip, limit, newFilters, order, sortBy)
      .then((response) => setProducts(response.data))
      .catch((err) => setError("Failed to load products!"));
  };

  const handleSortOrders = (value, name) => {
    if (!categoryCheckboxSelected.current && !priceRadioSelected.current && searchedProducts.length === 0) {
      if (name === "order") {
        getProducts(sortBy, value, limit)
          .then((response) => {
            setOrder(value);
            setProducts(response.data);
          })
          .catch((err) => setError("Failed to load products!"));
      } else {
        getProducts(value, order, limit)
          .then((response) => {
            setSortBy(value);
            setProducts(response.data);
          })
          .catch((err) => setError("Failed to load products!"));
      }
    } else {
      let sortedProducts = null;
      if (name === "order") {
        switch (sortBy) {
            case "sold":
              if (value === "desc") {
                // sort by sold on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.sold < p2.sold ? 1 : p1.sold > p2.sold ? -1 : 0
                );
              } else {
                // sort by sold on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.sold > p2.sold ? 1 : p1.sold < p2.sold ? -1 : 0
                );
              }
              break;
            case "price":
              if (value === "desc") {
                // sort by price on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.price < p2.price ? 1 : p1.price > p2.price ? -1 : 0
                );
              } else {
                // sort by price on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.price > p2.price ? 1 : p1.price < p2.price ? -1 : 0
                );
              }
              break;
            case "rating":
              if (value === "desc") {
                // sort by rating on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.rating < p2.rating ? 1 : p1.rating > p2.rating ? -1 : 0
                );
              } else {
                // sort by rating on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.rating > p2.rating ? 1 : p1.rating < p2.rating ? -1 : 0
                );
              }
              break;
            case "createdAt":
              if (value === "desc") {
                // sort by createdAt on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.createdAt < p2.createdAt
                    ? 1
                    : p1.createdAt > p2.createdAt
                    ? -1
                    : 0
                );
              } else {
                // sort by createdAt on asc
                sortedProducts = products.sort((p1, p2) =>
                  p1.createdAt > p2.createdAt
                    ? 1
                    : p1.createdAt < p2.createdAt
                    ? -1
                    : 0
                );
              }
              break
            default:
              sortedProducts = [];
          }
          setOrder(value)
          setProducts(sortedProducts)
      } else {
        switch (value) {
            case "sold":
              if (order === "desc") {
                // sort by sold on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.sold < p2.sold ? 1 : p1.sold > p2.sold ? -1 : 0
                );
              } else {
                // sort by sold on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.sold > p2.sold ? 1 : p1.sold < p2.sold ? -1 : 0
                );
              }
              break;
            case "price":
              if (order === "desc") {
                // sort by price on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.price < p2.price ? 1 : p1.price > p2.price ? -1 : 0
                );
              } else {
                // sort by price on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.price > p2.price ? 1 : p1.price < p2.price ? -1 : 0
                );
              }
              break;
            case "rating":
              if (order === "desc") {
                // sort by rating on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.rating < p2.rating ? 1 : p1.rating > p2.rating ? -1 : 0
                );
              } else {
                // sort by rating on asc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.rating > p2.rating ? 1 : p1.rating < p2.rating ? -1 : 0
                );
              }
              break;
            case "createdAt":
              if (order === "desc") {
                // sort by createdAt on desc order
                sortedProducts = products.sort((p1, p2) =>
                  p1.createdAt < p2.createdAt
                    ? 1
                    : p1.createdAt > p2.createdAt
                    ? -1
                    : 0
                );
              } else {
                // sort by createdAt on asc
                sortedProducts = products.sort((p1, p2) =>
                  p1.createdAt > p2.createdAt
                    ? 1
                    : p1.createdAt < p2.createdAt
                    ? -1
                    : 0
                );
              }
              break
            default:
              sortedProducts = [];
          }
          setSortBy(value)
          setProducts(sortedProducts)
      }      
    }
  }

  const showFilters = () => {
    return (
      <>
        <div className="row">
          <div className="col-sm-3">
            <h5>Filter By Categories:</h5>
            <ul id="category_checkbox">
              <CheckBox key={clearFilter ? 2 : 1}
                categories={categories}
                handleFilters={(myfilters, isChecked) => {
                  handleFilters(myfilters, "category");
                  categoryCheckboxSelected.current = isChecked;
                }}
              />
            </ul>
          </div>
          <div className="col-sm-4">
            <h5>Filter By Price:</h5>
            <div className="row" id="price_radio">
              <RadioBox
                prices={prices}
                handleFilters={(myfilters, isChecked) => {
                  handleFilters(myfilters, "price");
                  priceRadioSelected.current = isChecked;
                }}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <h5>Order By:</h5>
            <div>
              <Dropdown
                orders={orders}
                handleOrders={(order) => handleSortOrders(order, "order")}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <h5>Sort By:</h5>
            <div>
              <DropdownSort
                sorts={sorts}
                handleSorts={(sort) => handleSortOrders(sort, "sort")}               
              />
            </div>
          </div>
          <div className="col-sm-1">
            <span style={{color:"red", fontSize:"14px", fontWeight:"bold", fontStyle:"oblique", cursor:"context-menu"}} 
            onClick={() => {
              if (filters.category.length > 0 || filters.price.length > 0) {
                let priceRadio = document.getElementById("price_radio")
                let radios = priceRadio.querySelectorAll('input[type="radio"]')
                for (let i = 0; i < radios.length; i++) {
                    radios[i].checked = false;
                }
                let categoryCheckbox = document.getElementById("category_checkbox")
                let checkboxes = categoryCheckbox.querySelectorAll('input[type="checkbox"]') 
                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
                loadProducts()
                setClearFilter(!clearFilter)
                setFilters({
                  category: [],
                  price: []
                })
                console.log("clear filter")
              }
            }}>Clear Filters</span>
          </div>
        </div>
      </>
    );
  }

  const loadMore = () => {
    if (!loadAll) {
      setSkip(skip + limit);
    } else {
      alert("Loaded All Products");
    }
  };

  if (required.current && searchedProducts.length !== 0) {
    // console.log("home ", searchedProducts);
    // console.log("req ", required.current);
    setProducts(searchedProducts);
    required.current = false;
  }

  if (reloadAll) {
    loadProducts()
    setReloadAll(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Loading />
      </div>
    );
  } else {
    return (
      <Layout title="Home Page" className="container-fluid">
        {showFilters()}
        <div style={{ width: "100%" }}>
          {showError(error, error)}
          {showSuccess(success, "Added to cart successfully!")}
          
        </div>
        <div className="row">
          {products &&
            products.map((product) => (
              <Card
                product={product}
                key={product._id}
                handleAddToCart={handleAddToCart(product)}
              />
            ))}
        </div>
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={loadMore}>
            Load More
          </button>
        </div>
      </Layout>
    );
  }
};

export default Home;
