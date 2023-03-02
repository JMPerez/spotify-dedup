import Link from 'next/link';
import React from 'react';

const LanguageSelector = () => {
  return (
    <div className="footer">
      <p>
        Change language to{' '}
        <Link prefetch={false} href="/de" legacyBehavior>
          <a>German</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/" legacyBehavior>
          <a>English</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/es" legacyBehavior>
          <a>Spanish</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/fr" legacyBehavior>
          <a>French</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/id" legacyBehavior>
          <a>Indonesian</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/it" legacyBehavior>
          <a>Italian</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/nl" legacyBehavior>
          <a>Dutch</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/pl" legacyBehavior>
          <a>Polish</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/pt" legacyBehavior>
          <a>Portuguese</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/sv" legacyBehavior>
          <a>Swedish</a>
        </Link>
        ,{' '}
        <Link prefetch={false} href="/tr" legacyBehavior>
          <a>Turkish</a>
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
