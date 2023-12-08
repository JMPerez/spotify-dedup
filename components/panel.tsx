import React from 'react';

const Panel = (props: { children: React.ReactNode }) => <div className="panel">
  <div className="panel-body text-sm text-muted-foreground border p-4 my-4 flex flex-col gap-2">{props.children}</div>
</div>;

export default Panel;
