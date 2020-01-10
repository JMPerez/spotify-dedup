import React from 'react';
import { useTranslation } from 'react-i18next';

export default props => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <div className="jumbotron">
        <h1>{t('home.title')}</h1>
        <p className="lead">{t('home.description')}</p>
        <p>
          <button
            className="btn btn-jumbotron btn-success"
            onClick={props.onLoginClick}
          >
            {t('home.login-button')}
          </button>
        </p>
      </div>
      <style jsx>
        {`
          .lead {
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 200;
            line-height: 1.4;
          }
          .jumbotron {
            padding: 30px;
            margin-bottom: 16px;
            font-size: 21px;
            font-weight: 200;
            line-height: 2.1428571435;
            text-align: center;
          }
          h1 {
            line-height: 1;
            margin-top: 20px;
            margin-bottom: 10px;
          }

          @media (min-width: 768px) {
            h1 {
              font-size: 63px;
            }
            .lead {
              font-size: 21px;
            }
            .jumbotron {
              padding: 30px;
              margin-bottom: 30px;
            }
          }

          .jumbotron p {
            line-height: 1.4;
          }

          .btn {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.428571429;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            background-image: none;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 21px;
            padding: 14px 24px;
            cursor: pointer;
          }
          .btn-jumbotron {
            font-size: 21px;
            padding: 14px 24px;
            line-height: 1.33;
            border-radius: 6px;
          }
          .btn-success {
            color: #fff;
            background-color: #5cb85c;
            border-color: #4cae4c;
          }
          .btn-success:hover {
            background-color: hsl(120, 39%, 59%);
            border-color: #fff;
          }
        `}
      </style>
    </div>
  );
};
