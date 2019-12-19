import Link from 'next/link';

// Fixes links by prepending linkPrefix when in deployed on Github
const PrefixedLink = ({ href, as = href, children }) => (
  <Link href={href} as={`${process.env.linkPrefix}${as}`}>
    {children}
  </Link>
);

export default PrefixedLink;
