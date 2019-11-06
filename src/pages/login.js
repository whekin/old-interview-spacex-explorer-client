import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { GET_CART } from './cart';
import { Loading, LoginForm } from '../components';
import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted: async ({ login }) => {
        localStorage.setItem("token", login);
        const { data: { cart: { launches: cartItems } } } = await client.query({ query: GET_CART });
        client.writeData({ data: { isLoggedIn: true, cartItems } }); 
      }
    });
  
  if (loading) return <Loading />;
  if (error) return <p>An error occerred</p>;

  return <LoginForm login={login} />;
}
