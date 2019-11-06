import React, { Fragment } from 'react';
import { Router, Redirect } from '@reach/router';

import Launch from './launch';
import Launches from './launches';
import Cart from './cart';
import Profile from './profile';
import { Footer, PageContainer } from '../components';

const NotFound = () => <Redirect to="/" noThrow />;

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
          <Launches path="/" />
          <Launch path="launch/:launchId" />
          <Cart path="cart" />
          <Cart path="cart/:userId" />
          <Profile path="profile" />
          <NotFound default />
        </Router>
      </PageContainer>
      <Footer />
    </Fragment>
  );
}
