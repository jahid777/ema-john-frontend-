import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../Product/Product";

const ProductDetail = () => {
  const [product, setProduct] = useState([]);
  const { productKey } = useParams();

  useEffect(() => {
    fetch("http://localhost:5000/product/" + productKey)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [productKey]);

  return (
    <div>
      <h1>{productKey} is your product </h1>

      <Product product={product} showAddToCart={false}></Product>
    </div>
  );
};

export default ProductDetail;
