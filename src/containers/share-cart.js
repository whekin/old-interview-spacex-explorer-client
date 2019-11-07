import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg';
import { colors } from '../styles';

export const TOGGLE_IS_CART_SHARED = gql`
  mutation ToggleIsCartShared {
    toggleIsCartShared {
      success
      cart {
        id
        isShared
      }
    }
  }
`;

export const IS_CART_SHARED = gql`
  query IsCartShared {
    cart {
      id
      isShared
    }
  }
`;

export const GET_USER_ID = gql`
  query MyID {
    me {
      id
    }
  }
`;

export default function ShareCart () {
  const { loading, data, error, client } = useQuery(IS_CART_SHARED);
  const [toggleIsCartShared] = useMutation(TOGGLE_IS_CART_SHARED);
    
  if (loading) return '';
  if (error) return 'An error occured in ShareCart';

  const { cart: { isShared, id: cartId } } = data;

  const handleClick = async () => {
    await toggleIsCartShared({
      optimisticResponse: {
        __typename: 'Mutation',
        toggleIsCartShared: {
          success: true,
          cart: {
            id: cartId,
            isShared: !isShared,
            __typename: 'Cart'
          },
          __typename: 'CartUpdateResponse'
        }
      },
      update(cache, { data: { toggleIsCartShared: { cart } } }) {
        const data = cache.readQuery({ query: IS_CART_SHARED });
        cache.writeQuery({
          query: IS_CART_SHARED,
          data: {
            ...data,
            cart: {
              ...data.cart,
              ...cart
            }
          }
        });
      }
    });
    if (!isShared) {
      const { data: { me: { id: userId } } } = await client.query({ query: GET_USER_ID });
      const link = `${window.location.href}/${userId}`;
      alert(`Share cart link: ${link}`);
    }
  }; 

  return (
    <Container>
      <ShareIcon
        onClick={handleClick}
        style={{
          fill: isShared ? colors.accent : colors.grey
        }} />
    </Container>    
  );
}

const Container = styled('div')({
  width: 24,
  height: 24,
  marginLeft: 15
});
