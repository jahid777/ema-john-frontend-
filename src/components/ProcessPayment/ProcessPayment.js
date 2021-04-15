import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SimplePaymentForm from "./SimplePaymentForm";
import SplitCardForm from "./SplitCardForm";
// import { CardElement } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51Ha2sSGVpSRiDhBykgGafAJxoDyWmA5WuIRkdmrbBu6IOWKuVtf9BR8CvYLtjthGinYgHEQwdSYOOba3qI5IVRaX00el5Xv3YK"
);

const ProcessPayment = ({ handlePayment }) => {
  return (
    <>
      <Elements stripe={stripePromise}>
        <SimplePaymentForm handlePayment={handlePayment}></SimplePaymentForm>
        {/* <SplitCardForm></SplitCardForm> */}
      </Elements>
      ;
    </>
  );
};

export default ProcessPayment;
