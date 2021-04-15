import React, { useState } from "react";
import fakeData from "../../fakeData";
import "./Shop.css";
import Product from "../Product/Product";
import Cart from "../Cart/Cart";
import {
  addToDatabaseCart,
  getDatabaseCart,
} from "../Utilities/databaseManager";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products?search=" + search)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [search]);
  console.log("this is ", search);

  useEffect(() => {
    const savedCart = getDatabaseCart();
    const productKeys = Object.keys(savedCart);
    fetch("http://localhost:5000/productsByKeys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productKeys),
    })
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const handleAddProduct = (product) => {
    // console.log('Product added', product);
    const toBeAddedKey = product.key; //je product take add korte click korsilam setar key ta toBeAddedKey te raksi.
    const sameProduct = cart.find((pd) => pd.key === toBeAddedKey); //key mile gele product r value ta sameproduct e add hbe..na mille undefined hbe.

    let count = 1; //same product na thkle count 1
    let newCart;
    if (sameProduct) {
      //product ta jdi thke thake thle body te dhkbe
      count = product.quantity + 1; //product same find kre pele quantity 1 add hbe
      sameProduct.quantity = count; //new count amra quantity r value hisebe product r feature e add kore dilam
      const others = cart.filter((pd) => pd.key !== toBeAddedKey); //cart e already thaka product gulor sathe je product gulor key ekbarer beshi milbe na ,like egulo single e ache
      newCart = [...others, sameProduct];
    } else {
      //jdi if false hy ,like same product na thake
      product.quantity = 1; //same product na thkle prretktir quantity 1
      newCart = [...cart, product]; //then cart r sathe shudhu product ta add kre daw..jhtu same nai
    }
    setCart(newCart); //setcart diye noya product add hye jcche cart e
    addToDatabaseCart(product.key, count); //ekhane key gulor sthe ekta quantity achee
  };

  return (
    <div className="twin-container">
      <div className="product-container">
        <div>
          <h5>Search Your Product</h5>
          <input
            // className="form-control"
            name="name"
            type="text"
            onBlur={handleSearch}
            placeholder="search product"
            style={{ width: "500px", border: "2px solid gray" }}
          />
        </div>
        {products.map((pd) => (
          <Product
            handleAddProduct={handleAddProduct}
            showAddToCart={true}
            product={pd}
            key={pd.key}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart}>
          <Link to="/review">
            <button className="main-button">Review your order</button>
          </Link>{" "}
          {/*ata shudhu shop.js dhekabe cart.js a props.childern daoate ager btn ta shoraya*/}
        </Cart>
      </div>
    </div>
  );
};

export default Shop;
