import React from 'react';

export default (props: { children: React.ReactNode }) => (
  <div className="panel">
    <div className="panel-body">{props.children}</div>
    <style jsx>
      {`
        .panel {
          margin-bottom: 20px;
          border: 1px solid var(--accent-color);
          border-radius: 4px;
        }

        .panel-body {
          padding: 15px;
        }
      `}
    </style>
  </div>
);
