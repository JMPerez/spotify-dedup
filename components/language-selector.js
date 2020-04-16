import React from 'react';
import PrefixedLink from './prefixedLink';

export default () => {
  return (
    <div className="footer">
      <p>
        Change language to{' '}
        <PrefixedLink prefetch={false} href="/de/">
          <a>German</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/">
          <a>English</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/es/">
          <a>Spanish</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/fr/">
          <a>French</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/it/">
          <a>Italian</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/pt/">
          <a>Portuguese</a>
        </PrefixedLink>
        ,{' '}
        <PrefixedLink prefetch={false} href="/sv/">
          <a>Swedish</a>
        </PrefixedLink>
      </p>
      <style jsx>
        {`
          .footer {
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 15px;
            color: var(--secondary-text-color);
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};
