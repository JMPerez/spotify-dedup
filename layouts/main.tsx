import Link from "next/link";

const Main = ({ children }) => (
  <>
    <Link className="bg-indigo-900 text-center py-4 lg:px-4 block" href="https://buymeacoffee.com/jmp/dedup-spotify-breaking-changes-api" target="_blank">
      <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Info</span>
        <span className="mr-2 text-left text-sm flex-auto text-balance">We have just fixed an issue that prevented the removal of duplicates in playlists. <span className="text-yellow-400 hover:text-yellow-200">Read more about it</span>.</span>
        <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
      </div>
    </Link>
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
        background: var(--surface-color);
        color: var(--text-color);
        padding-top: 20px;
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
