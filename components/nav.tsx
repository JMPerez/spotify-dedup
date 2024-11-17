import Link from 'next/link';

const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' }
];

const Nav = () => (
  <nav className="text-center">
    <ul className="flex justify-between px-4 py-4">
      <li className="flex px-2 py-1.5">
        <Link href="/" legacyBehavior>
          <a className="text-[#067df7] text-sm no-underline">Home</a>
        </Link>
      </li>
      {links.map(({ href, label }) => (
        <li key={`nav-link-${href}-${label}`} className="flex px-2 py-1.5">
          <a href={href} className="text-[#067df7] text-sm no-underline">
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
