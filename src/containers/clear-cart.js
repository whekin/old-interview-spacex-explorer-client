import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/button';
import { useMutation } from '@apollo/react-hooks';
import { GET_CART, CLEAR_CART } from '../pages/cart';
import { GET_LAUNCH_DETAILS } from './action-button';
import { Loading } from '../components';


export default function ClearCart({ launchIds }) {
  const [clearCart, { loading }] = useMutation(
    CLEAR_CART,
    {
      refetchQueries: [{
        query: GET_CART,
      },
      ...launchIds.map((launchId) => (
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId }
        }
      ))
      ]
    }
  );

  return (
    <Button
      onClick={clearCart}>
      { loading
        ? <Loading size={30} />
        : 'Clear All'
      }
    </Button>
  );
}

ClearCart.propTypes = {
  launchIds: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string])
  ).isRequired
};
