import React from 'react';

const Main = ({ children }) => (
  <>
    {children}
    <style jsx global>{`
      :root {
        --link-color: #3977ad;
        --surface-color: #fff;
        --text-color: #333;
        --secondary-text-color: #65676b;
        --card-bg-color: #f9f9f9;
        --accent-color: #ccc;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --link-color: #599af8;
          --surface-color: #232526;
          --text-color: #e3e6eb;
          --secondary-text-color: #b0b3b8;
          --card-bg-color: #313436;
          --accent-color: #46484a;
        }
      }

      *,
      :after,
      :before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      body {
        font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        line-height: 1.428571429;
        background: var(--surface-color);
        color: var(--text-color);
        padding-top: 20px;
        padding-bottom: 20px;
      }
      a {
        color: var(--link-color);
        text-decoration: none;
      }

      .container {
        margin: 0 auto;
        max-width: 730px;
      }
    `}</style>
  </>
);

export default Main;