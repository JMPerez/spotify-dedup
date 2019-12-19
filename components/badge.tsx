import React from 'react';

export default (props: { children: React.ReactNode }) => (
  <span>
    {props.children}
    <style jsx>
      {`
        span {
          display: inline-block;
          min-width: 10px;
          padding: 3px 7px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          background-color: #999;
          border-radius: 10px;
          margin-right: 0.5em;
        }
      `}
    </style>
  </span>
);
