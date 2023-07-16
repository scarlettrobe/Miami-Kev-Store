import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";

import ProductComponent from './components/Product/ProductComponent';
import ProductList from './components/Product/ProductList';
import ProductCreate from './components/Product/ProductCreate'; // make sure you import ProductCreate
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/products/:id">
            <ProductComponent />
          </Route>
          <Route path="/products">
            <ProductList />
          </Route>
          <Route path="/create-product">
            <ProductCreate />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
