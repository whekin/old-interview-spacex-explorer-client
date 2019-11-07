import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LAUNCH_TILE_DATA } from './launches';
import { Loading, LaunchTile, PageContainer } from '../components';

export const GET_SHARED_CART = gql`
  query GetSharedCart($userId: ID!) {
    sharedCart(userId: $userId) {
      id
      launches {
        ...LaunchTile
      }
    }
  }

  ${LAUNCH_TILE_DATA}
`;

export default function SharedCart ({ userId }) {
  const { loading, data, error } = useQuery(
    GET_SHARED_CART,
    {
      variables: {
        userId
      }
    }
  );
  
  if (loading) return <Loading />;
  if (error) return <p>Sorry, an error occured {error.message}</p>;
  if (data.sharedCart === null) return <p>The cart is not shared</p>;

  const { sharedCart: { launches } } = data;

  return (
    <PageContainer>
      {!launches || !launches.length
        ? <p>The cart is empty</p>
        : launches.map((launch) => <LaunchTile key={launch.id} launch={launch} />)
      }
    </PageContainer>
  );
}

SharedCart.propTypes = {
  userId: PropTypes.string
};
