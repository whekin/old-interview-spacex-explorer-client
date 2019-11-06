import gql from 'graphql-tag';
import { GET_CART_ITEMS, REMOVE_FROM_CART, ADD_TO_CART } from './pages/cart';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    }
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache, client }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      
      const isInCart = cartItems.includes(id);
      client.mutate({ mutation: isInCart ? REMOVE_FROM_CART : ADD_TO_CART, variables: { launchId: id } });
      
      const data = {
        cartItems: isInCart
          ? cartItems.filter(item => item !== id)
          : [...cartItems, id]
      };

      cache.writeQuery({ query: GET_CART_ITEMS, data });

      return data.cartItems;
    },
  }
};
