import React from 'react';

export default ({ color = '#202020', size = 14 }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    height={size}
    width={size}
    viewBox='0 0 3.44 2.728'
  >
    <path
      d='M2.12 1.377l.961.962-.379.38-.964-.963-.962.963-.38-.38.963-.962L.396.413l.38-.38.962.963.964-.962.38.38z'
      fill={color}
    />
  </svg>
);
