import React from 'react';

export default ({ color = '#a1a1a1', size = 14 }) => (
  <svg className='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'
        width={size} height={size} fill={color}>
    <path d='M512 0a512 512 0 0 1 512 512h-64a448 448 0 0 0-448-448V0z'  />
  </svg>
);
