const LOGO_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 211 169' width='211' height='169' fill='none' preserveAspectRatio='xMidYMin slice' xmlns='http://www.w3.org/2000/svg'%0A%3E%3Cpath d='M207.475 79.414c3.756 2.35 3.756 7.821 0 10.172L82.284 167.952c-3.997 2.501-9.184-.371-9.184-5.086V6.134c0-4.715 5.188-7.587 9.184-5.086l125.191 78.366z' fill='%2393B2C6' /%3E%3Cpath d='M134.475 79.414c3.756 2.35 3.756 7.821 0 10.172L9.284 167.952C5.287 170.453.1 167.581.1 162.866V6.134c0-4.715 5.187-7.587 9.184-5.086l125.191 78.366z' fill='%23325972' /%3E%3C/svg%3E`;

const Head = () => {
  return (
    <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-6 md:pb-12">
      <div className="flex items-center mx-4 md:mx-0">
        <h3 className="flex items-center flex-1 text-2xl leading-10 text-slate-700 dark:text-slate-300">
          <img
            src={LOGO_SVG}
            alt="Spotify Dedup Logo"
            className="h-10 w-12 mr-3"
          />
          <span>Spotify Dedup</span>
        </h3>
      </div>
    </header>
  );
};

export default Head;