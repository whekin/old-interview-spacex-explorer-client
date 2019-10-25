import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Loading, LoginForm } from '../components';
import gql from 'graphql-tag';

const LOGIN_USER = gql`
  mutation LoginUser($login: String!) {
    login(login: $login)
  }
`;

export default function Login() {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted: ({ login }) => {
        localStorage.set("toket", login);
        client.writeData({ data: { isLoggedIn: true } }); 
      }
    });
  
  if (loading) return <Loading />;
  if (error) return <p>An error occerred</p>;

  return (
    <>
      <LoginForm login={login} />
    </>
  );
}
