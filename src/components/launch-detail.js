import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { unit } from '../styles';
import { cardClassName, getBackgroundImage } from './launch-tile';

const LaunchDetail = ({ id, site, rocket }) => (
  <Card
    style={{
      backgroundImage: getBackgroundImage(id),
    }}
  >
    <h3>
      {rocket.name} ({rocket.type})
    </h3>
    <h5>{site}</h5>
  </Card>
);

LaunchDetail.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string]).isRequired,
  site: PropTypes.string.isRequired,
  rocket: PropTypes.object.isRequired
};

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Card = styled('div')(cardClassName, {
  height: 365,
  marginBottom: unit * 4,
});

export default LaunchDetail;
