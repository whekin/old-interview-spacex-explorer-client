import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';
import { REMOVE_FROM_CART, ADD_TO_CART } from '../pages/cart';

// export all queries used in this file for testing
export { GET_LAUNCH_DETAILS };

export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function ActionButton({ isBooked, id, isInCart }) {
  const [mutate, { loading, error }] = useMutation(
    isBooked
      ? CANCEL_TRIP
      : isInCart
        ? REMOVE_FROM_CART
        : ADD_TO_CART,
    {
      variables: { launchId: id },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId: id },
        },
      ],
    }
  );

  const handleClick = () => {
    if (loading) return;
    mutate();
  };

  if (error) return <p>An error occurred</p>;

  return (
    <div>
      <Button
        onClick={handleClick}
        isBooked={isBooked}
        data-testid={'action-button'}
      >
        {isBooked
          ? (loading ? 'Canceling This Trip' : 'Cancel This Trip')
          : isInCart
            ? (loading ? 'Removing from Cart' : 'Remove from Cart')
            : (loading ? 'Adding to Cart' : 'Add to Cart') }
      </Button>
    </div>
  );
}

ActionButton.propTypes = {
  isBooked: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isInCart: PropTypes.bool.isRequired
};
