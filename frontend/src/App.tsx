import './App.css';

import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalizeContextProps, withLocalize } from 'react-localize-redux';

import Routers from './components/routers';
import CONSTANTS from './utils/constants';

interface Props extends LocalizeContextProps {}

const App: React.FC<Props> = ({ initialize, addTranslation }) => {
  useEffect(() => {
    if (localStorage.getItem("preferedLanguage")) {
      initialize({
        languages: CONSTANTS.AVAILABLE_LANGUAGES,
        options: {
          renderToStaticMarkup,
          defaultLanguage:
            localStorage.getItem("preferedLanguage") || undefined,
          onMissingTranslation: () => ""
        }
      });
    } else {
      initialize({
        languages: CONSTANTS.AVAILABLE_LANGUAGES,
        options: {
          renderToStaticMarkup,
          defaultLanguage: CONSTANTS.LANGUAGE_ES,
          onMissingTranslation: () => ""
        }
      });
    }
    addTranslation(require("./locales/generic.json"));
    addTranslation(require("./locales/validations.json"));
    addTranslation(require("./locales/nav.json"));
    addTranslation(require("./locales/auth.json"));
    addTranslation(require("./locales/entities.json"));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Layout className="grid-container">
        <Routers />
      </Layout>
    </>
  );
};

export default withLocalize(App);
