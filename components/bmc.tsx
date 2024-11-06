import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Bmc = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-4">
      <Link
        className="inline-flex items-center h-9 px-2 text-white bg-orange-500 rounded border border-transparent no-underline"
        target="_blank"
        rel="noreferrer"
        href="https://www.buymeacoffee.com/jmp"
        onClick={() => {
          if (global.sa_event) {
            global.sa_event('bmc_clicked');
          }
        }}
      >
        <img
          src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
          width="25"
          height="35"
          alt=""
        />
        <span className="ml-1">{t('bmc.button')}</span>
      </Link>
    </div>
  );
};

export default Bmc;