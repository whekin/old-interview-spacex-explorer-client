import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Button from '../components/button';
import { CLEAR_CART, GET_CART } from '../pages/cart';

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function BookTrips({ launchIds }) {
  const [clearCart] = useMutation(CLEAR_CART);
  const [bookTrips, { loading, data }] = useMutation(
    BOOK_TRIPS,
    {
      variables: { launchIds: launchIds },
      awaitRefetchQueries: true,
      refetchQueries: [{
        query: GET_CART,
      }],

      update() {
        clearCart();
      }
    }
  );

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button onClick={bookTrips} data-testid="book-button">
        { loading
          ? "Booking All"
          : "Book All" }
      </Button>
    );
}

BookTrips.propTypes = {
  launchIds: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string])
  ).isRequired
};
