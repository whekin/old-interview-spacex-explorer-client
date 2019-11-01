import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LAUNCH_TILE_DATA } from './launches';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launch({ launchId }) {
  const { loading, data, error } = useQuery(
    GET_LAUNCH_DETAILS,
    {
      variables: {
        launchId
      }
    });
  if (loading) return <Loading />;
  if (error) return <p>ERROR {error.message}</p>;

  return (
    <>
      <Header image={data.launch.mission.missionPatch}>
        {data.launch.mission.name}
      </Header>
      <LaunchDetail { ...data.launch } />
      <ActionButton { ...data.launch } />
    </>
  );
}

Launch.propTypes = {
  launchId: PropTypes.string
};
