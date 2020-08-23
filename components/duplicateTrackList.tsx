import React from 'react';

export const DuplicateTrackList = ({ children }) => (
  <ul>
    {children}
    <style jsx>{`
      ul {
        padding: 0;
      }
    `}</style>
  </ul>
);
