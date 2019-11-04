import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Header, Button, LaunchTile, Loading } from '../components';
import { NetworkStatus } from 'apollo-client';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
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

export const GET_LAUNCHES = gql`
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
  const { loading, data, error, fetchMore, networkStatus } = useQuery(
    GET_LAUNCHES,
    {
      notifyOnNetworkStatusChange: true
    });

  if (loading && networkStatus !== NetworkStatus.fetchMore) return <Loading />;
  if (error) return <p>ERROR</p>;

  const handleClick = () => {
    if (!data.launches.hasMore || networkStatus === NetworkStatus.fetchMore) return;

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
      { data.launches.hasMore &&
        <Button
          onClick={handleClick}   
        >
          {networkStatus === NetworkStatus.fetchMore
            ? "Loading..."
            : "Load More"
          }
        </Button>
      }
    </>
  );
}
