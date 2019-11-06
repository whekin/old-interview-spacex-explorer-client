import React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg';
import { colors } from '../styles';

export default function ShareCart () {
  const [isShared, setIsShared] = useState(false);
  const toggleShare = () => {
    setIsShared(!isShared);
  };

  return (
    <Container>
      <ShareIcon
        onClick={toggleShare}
        style={{
          fill: isShared ? colors.accent : colors.grey
        }} />
    </Container>    
  );
}

const Container = styled('div')({
  width: 24,
  height: 24,
  marginLeft: 15
});
