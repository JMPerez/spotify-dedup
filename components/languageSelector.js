import React from 'react';
import Link from 'next/link';

const LanguageSelector = () => {
  return (
    <div className="footer">
      <p>
        Change language to{' '}
        <Link prefetch={false} href="/de/">
          <a>German</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/">
          <a>English</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/es/">
          <a>Spanish</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/fr/">
          <a>French</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/it/">
          <a>Italian</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/nl/">
          <a>Dutch</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/pt/">
          <a>Portuguese</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/sv/">
          <a>Swedish</a>
        </Link>
      </p>
      <style jsx>
        {`
          .footer {
            color: var(--secondary-text-color);
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 15px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default LanguageSelector;
