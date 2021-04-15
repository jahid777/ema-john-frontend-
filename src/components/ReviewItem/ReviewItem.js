import React from 'react';

const ReviewItem = (props) => {
       const {name, quantity, key, price} = props.product
        // const {increment} = props.increment;
        
       const reviewItemStyle = {
          // width: "70%",
          borderBottom: "1px solid lightgray",
          marginBottom: "5px",
          paddingBottom: "5px",
          marginLeft: "200px"

       }
return (
<div style={reviewItemStyle}>
  <h1 className="product-name">{name}</h1> 
  <p>Quantity: {quantity}</p>
  <button onClick={()=>props.increment(key)}> increase product</button>
  <button onClick={()=>props.decrease(key)}> decrease product</button>
  <p><small>${price}</small></p> 
  <br/>
  <button className="main-button" onClick={() =>props.removeProduct(key)}>Remove</button>                     
</div>
);
};

export default ReviewItem;