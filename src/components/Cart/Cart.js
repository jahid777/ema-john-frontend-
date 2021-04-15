import React from "react";

const Cart = (props) => {
  const cart = props.cart;

  //const total = cart.reduce((total, prd) => total + prd.price, 0)
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const product = cart[i];
    total = total + product.price * product.quantity || 1;
  }

  let shipping = 0;
  if (total > 35) {
    shipping = 0;
  } else if (total > 15) {
    shipping = 4.99;
  } else if (total > 0) {
    shipping = 12.99;
  }

  const tax = (total / 10).toFixed(2);
  const grandTotal = (total + shipping + Number(tax)).toFixed(2);

  const formatNumber = (num) => {
    const precision = num.toFixed(2);
    return Number(precision);
  };
  return (
    <div>
      <h4>Order Summary</h4>
      <p>Items Order: {cart.length}</p>
      <p>Product Price: {formatNumber(total)}</p>
      <p>
        <small>Shipping Cost: {shipping}</small>
      </p>
      <p>
        <small>Tax + VAT: {tax}</small>
      </p>
      <p>Total Price: {grandTotal}</p>
      <br />

      {
        props.children //ata shop.js a jabe kaorn okhane link soho btn ta children kore disi jar karone jar jar gor theke je butoon dibo detay dhekbe but cart ar upoer sob kisu thik thak thakbe
      }
    </div>
  );
};

export default Cart;
