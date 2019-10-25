import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Header, Button, LaunchTile, Loading } from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
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
`;

const GET_LAUNCHES = gql`
  query LaunchesList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launches() {
  const { loading, data, error, fetchMore } = useQuery(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  const handleClick = () => {
    fetchMore({
      variables: {
        after: data.launches.cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...fetchMoreResult,
          launches: {
            ...fetchMoreResult.launches,
            launches: [ 
              ...prev.launches.launches,
              ...fetchMoreResult.launches.launches
            ]
          }
        };
      }
    }); 
  };


  return (
    <>
      <Header />
      { data.launches && data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile
            key={launch.id}
            launch={launch} />
        ))}
      <Button
        onClick={handleClick}   
      >Load More</Button>
    </>
  );
}
