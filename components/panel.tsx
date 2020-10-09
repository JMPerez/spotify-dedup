import React from 'react';

const Panel = (props: { children: React.ReactNode }) => <div className="panel">
  <div className="panel-body">{props.children}</div>
  <style jsx>
    {`
      .panel {
        border: 1px solid var(--accent-color);
        border-radius: 4px;
        margin-bottom: 20px;
      }

      .panel-body {
        padding: 15px;
      }
    `}
  </style>
</div>;

export default Panel;
