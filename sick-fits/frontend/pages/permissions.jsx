import React from 'react';

import Permissions from '../components/permissions';
import PleaseSignIn from '../components/please-sign-in';

const PermissionsPage = () => (
  <div>
    <PleaseSignIn>
      <Permissions />
    </PleaseSignIn>
  </div>
);

export default PermissionsPage;
