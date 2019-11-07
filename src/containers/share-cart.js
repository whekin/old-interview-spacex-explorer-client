import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from '@emotion/styled';
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg';
import { colors } from '../styles';
import Popover, { ArrowContainer } from 'react-tiny-popover';

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

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverContent, setPopoverContent] = useState("");

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
      setIsPopoverOpen(true);
      setPopoverContent(`Link to this shared cart: ${link}`);
    } else {
      setIsPopoverOpen(false);
    }
  };

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        position={['top', 'right', 'left', 'bottom']}
        padding={1}
        onClickOutside={() => setIsPopoverOpen(false)}
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor={colors.accent}
            arrowSize={10}>
            <div
              style={{
                backgroundColor: colors.accent,
                color: 'white',
                padding: 10,
                borderRadius: '5px'
              }}>
              {popoverContent}
            </div>
          </ArrowContainer>
        )}>
        <Container>
          <ShareIcon
            onClick={handleClick}
            style={{
              fill: isShared ? colors.accent : colors.grey
            }} />
        </Container>
      </Popover>
    </>
  );
}

const Container = styled('div')({
  width: 24,
  height: 24,
  marginLeft: 15
});
