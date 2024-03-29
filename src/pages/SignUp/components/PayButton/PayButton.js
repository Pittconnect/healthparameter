import React from "react";
import { PayPalButton } from "react-paypal-button-v2";

import "./PayButton.css";

const PayButton = ({ createOrder, approveOrder }) => {
  return (
    <div className="paypal-button uk-flex-column">
      <PayPalButton
        style={{ shape: "pill", tagline: false, layout: "horizontal" }}
        createOrder={createOrder}
        onApprove={approveOrder}
        options={{
          clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
        }}
      />
    </div>
  );
};

export default PayButton;
