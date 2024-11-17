import React from 'react';

const Badge = (props: { children: React.ReactNode }) => (
  <span className="inline-block bg-gray-500 text-white text-xs font-bold py-[3px] px-[7px] mr-2 min-w-[10px] rounded-[10px] text-center align-baseline whitespace-nowrap">
    {props.children}
  </span>
);

export default Badge;
