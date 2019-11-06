import React from 'react';
import Button from '../components/button';
import { useMutation } from '@apollo/react-hooks';
import { GET_CART, CLEAR_CART } from '../pages/cart';


export default function ClearCart() {
  const [clearCart] = useMutation(
    CLEAR_CART,
    {
      refetchQueries: [{
        query: GET_CART,
      }]
    });

  return (
    <Button
      onClick={clearCart}
    >Clear All</Button>
  );
}