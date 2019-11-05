import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';

// export const _GET_CART_ITEMS = gql`
//   query GetCartItems {
//     cartItems @client
//   }
// `;

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cart {
      launches
    }
  }
`;

export default function Cart() {
  const { loading, data, error } = useQuery(GET_CART_ITEMS);
  if (loading) return <Loading />;
  if (error) return <p>error</p>;

  const { cart: { launches: cartItems } } = data;

  return (
    <>
      <Header>My Cart</Header>
      { !cartItems || !cartItems.length
        ? <p data-testid="empty-message">No items in your cart</p>
        : (
          <>
            { cartItems.map(launchId => (
              <CartItem key={launchId} launchId={launchId} />
            ))}
            <BookTrips cartItems={cartItems} />
          </>
        )}
    </>
  );
}
