import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Header, Button, LaunchTile, Loading } from '../components';

const GET_LAUNCHES = gql`
  query LaunchesList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

export default function Launches() {
  const { loading, data, error } = useQuery(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  return (
    <>
      <Header />
      { data.launches && data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile
            key={launch.id}
            launch={launch} />
        ))}
    </>
  );
}
