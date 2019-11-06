import React from 'react';
import styled from '@emotion/styled';
import { useApolloClient } from '@apollo/react-hooks';
import { Link } from '@reach/router';
import { menuItemClassName } from '../components/menu-item';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';

export default function LogoutButton() {
  const client = useApolloClient();
  return (
    <StyledButton
      to="/"
      onClick={async () => {
        localStorage.clear();
        await client.resetStore();
        await client.writeData({ data: { isLoggedIn: false } });

      }}
    >
      <ExitIcon />
      Logout
    </StyledButton>
  );
}

const StyledButton = styled(Link)(menuItemClassName, {
  background: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'none'
});
