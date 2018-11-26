import React from 'react';

import Reset from '../components/reset';

const ResetPassword = ({ query }) => {
  const { resetToken } = query;
  return (
    <div>
      <Reset resetToken={resetToken} />
    </div>
  );
};

export default ResetPassword;
