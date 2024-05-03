
const DuplicateTrackList = ({ children }) => (
  <ul>
    {children}
    <style jsx>{`
      ul {
        padding: 0;
      }
    `}</style>
  </ul>
);

export default DuplicateTrackList;