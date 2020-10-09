import React from 'react';

const Badge = (props: { children: React.ReactNode }) => <span>
  {props.children}
  <style jsx>
    {`
      span {
        background-color: #999;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        margin-right: 0.5em;
        min-width: 10px;
        padding: 3px 7px;
        text-align: center;
        vertical-align: baseline;
        white-space: nowrap;
      }
    `}
  </style>
</span>;

export default Badge;
