import React from 'react';
import Link from 'next/link';

const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' }
];

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href="/" legacyBehavior>
          <a>Home</a>
        </Link>
      </li>
      {links.map(({ href, label }) => (
        <li key={`nav-link-${href}-${label}`}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        font-size: 13px;
        text-decoration: none;
      }
    `}</style>
  </nav>
);

export default Nav;
