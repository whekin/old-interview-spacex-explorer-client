import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Header, Loading, LaunchTile } from '../components';
import { BookTrips } from '../containers';
import { ClearCart, ShareCart } from '../containers';
import { LAUNCH_TILE_DATA } from './launches';

import styled from '@emotion/styled';

export const GET_CART = gql`
  query GetCart {
    cart {
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($launchId: ID!) {
    addToCart(launchId: $launchId) {
      success
      message
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($launchId: ID!) {
    removeFromCart(launchId: $launchId) {
      success
      message
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      success
      message
      cart {
        launches {
          id
        }
      }
    }
  }
`;

export default function Cart() {
  const { loading, data, error } = useQuery(
    GET_CART,
    { fetchPolicy: 'network-only' });
  if (loading) return <Loading />;
  if (error) return <p>error</p>;

  const { cart: { launches } } = data;

  return (
    <>
      <Header>
        <FlexContainer>
          My Cart
          <ShareCart style={{ width: 60, height: 60 }} />
        </FlexContainer>
      </Header>
      { !launches || !launches.length
        ? <p data-testid="empty-message">No items in your cart</p>
        : (
          <>
            { launches.map((launch) => (
              <LaunchTile key={launch.id} launch={launch} />
            ))}
            <FlexContainer>
              <ClearCart />
              <BookTrips launchIds={launches.map((launch) => launch.id)} />
            </FlexContainer>
          </>
        )}
    </>
  );
}

const FlexContainer = styled("div")({
  display: 'flex',
  flexAlign: 'center',
  userSelect: 'none'
});
