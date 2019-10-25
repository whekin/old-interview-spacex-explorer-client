import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LAUNCH_TILE_DATA } from './launches';

import { Loading, Header, LaunchTile } from '../components';

const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Profile() {
  const { loading, data, error } = useQuery(
    GET_MY_TRIPS,
    { fetchPolicy: "network-only" });

  if (loading) return <Loading />;
  if (error) return <p>error</p>;
<<<<<<< HEAD

=======
  console.log(data);
>>>>>>> 117e1bde440b795c5ea8af55d8e9efb7bd877fba
  return (
    <>
      <Header>My Trips</Header>
      { data.me && data.me.trips.length
        ? data.me.trips.map(launch => <LaunchTile key={launch.id} launch={launch} />)
        : <p>You have not booked any trips yet</p>
      }
      <LaunchTile />
    </>
  );
}
