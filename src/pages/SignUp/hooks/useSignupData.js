import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";

import Route from "../../../routes/state/types";
import { signupUser } from "../../../api/signupUser";
import { createOrder, captureOrder } from "../../../api/payment";

const memberships = [
  { label: "Free", value: "0" },
  { label: "$15", value: "15" },
  { label: "$45", value: "45" },
];

export const useSignupData = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pricing, setPricing] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!username || !password || !email)
      return { error: "Please enter Username, Email and Password" };

    const usernamePattern =
      /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (!usernamePattern.test(String(username).toLowerCase()))
      return { error: "Invalid username" };

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(String(email).toLowerCase()))
      return { error: "Invalid email" };

    if (password && password.length < 6)
      return { error: "Password should be 6 symbols at least" };

    if (!pricing) return { error: "Please select one of pricing plans" };

    return { error: null };
  }, [username, email, password, pricing]);

  const signup = useCallback(
    async (credentials) => {
      setError(validation.error);
      if (validation.error) {
        return;
      }

      setLoading(true);

      const { error: resError } = await signupUser(credentials);

      setLoading(false);

      if (resError) {
        setError(resError);
      } else {
        history.push(Route.LOGIN);
      }
    },
    [validation, history]
  );

  const createPayment = useCallback(async () => {
    console.log("[CREATE PAYMENT] -> email: ", email);
    console.log("[CREATE PAYMENT] -> pricing: ", pricing);
    setError(validation.error);
    if (validation.error) {
      return;
    }

    const {
      data: { order },
      error: resError,
    } = await createOrder({ email, price: pricing });

    console.log("[CREATE PAYMENT] ->  resError: ", resError);
    setError(resError);
    console.log("[CREATE PAYMENT] ->  order: ", order);

    return order.id;
  }, [email, pricing, validation.error]);

  const approvePayment = useCallback(
    async (order) => {
      console.log("[APPROVE PAYMENT] -> order: ", order);

      const { data: resData, error: resError } = await captureOrder({
        username,
        email,
        password,
        pricing,
        order,
      });

      console.log("[APPROVE PAYMENT] ->  resError: ", resError);
      console.log("[APPROVE PAYMENT] ->  resData: ", resData);

      if (resError) {
        setError(resError);
      } else {
        history.push(Route.LOGIN);
      }
    },
    [email, password, username, pricing, history]
  );

  const reset = useCallback(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPricing("");
    setLoading(false);
    setError(null);
  }, []);

  return {
    username,
    email,
    password,
    pricing,
    memberships,
    loading,
    error,

    signup,
    createPayment,
    approvePayment,
    setUsername,
    setEmail,
    setPassword,
    setPricing,
    reset,
  };
};
