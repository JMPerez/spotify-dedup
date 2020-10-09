import React from 'react';
import { useTranslation } from 'react-i18next';

const Bmc = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ paddingTop: '1em' }}>
      <a
        className="bmc-button"
        target="_blank"
        href="https://www.buymeacoffee.com/jmp"
        onClick={() => {
          global['fbq'] && global['fbq']('track', 'InitiateCheckout');
          global['ga'] &&
            global['ga']('send', 'event', 'spotify-dedup', 'bmc-clicked');
        }}
      >
        <img
          src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
          width="25"
          height="35"
          alt=""
        />
        <span style={{ marginLeft: '5px' }}>{t('bmc.button')}</span>
      </a>
      <style jsx>
        {`
          .bmc-button {
            line-height: 36px;
            height: 37px;
            text-decoration: none;
            display: inline-flex;
            color: #fff;
            background-color: #ff813f;
            border-radius: 3px;
            border: 1px solid transparent;
            padding: 0 9px;
          }
        `}
      </style>
    </div>
  );
};

export default Bmc;
