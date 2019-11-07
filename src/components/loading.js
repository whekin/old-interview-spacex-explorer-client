import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { size } from 'polished';

import { ReactComponent as Logo } from '../assets/logo.svg';
import { colors } from '../styles';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Loading = styled(Logo)(({ size: sizeVal = 60 }) => size(sizeVal), {
  display: 'block',
  margin: 'auto',
  fill: colors.grey,
  path: {
    transformOrigin: 'center',
    animation: `${spin} 1s linear infinite`,
  },
});

export default Loading;
