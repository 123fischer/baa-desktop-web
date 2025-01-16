'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import lodash from 'lodash';
import TRANSLATIONS from '../../data/translations.json';
import type { Locales } from '@/types/types';
import { IS_PRODUCTION } from '@/constants/constants';

const TRUNCATE_UNTRANSLATED = IS_PRODUCTION;

type Translations = {
  locale: Locales;
  t: (path: string) => string;
  getTranslationObject: (path: string) => any;
};

const defaultValue: Translations = {
  locale: 'de',
  t: () => '',
  getTranslationObject: () => ({}),
};

const TranslationsContext = createContext(defaultValue);

export const useTranslations = () => useContext(TranslationsContext);

export const TranslationsProvider = ({
  locale,
  children,
}: {
  locale: Locales;
  children: React.ReactNode;
}) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  }, []);

  const t: Translations['t'] = (path) =>
    lodash.get(TRANSLATIONS, path)?.[locale] ??
    (TRUNCATE_UNTRANSLATED ? (path.split('.').pop() as string) : path);

  const getTranslationObject: Translations['getTranslationObject'] = (path) => {
    const value = lodash.get(TRANSLATIONS, path);
    return value !== undefined ? value : {};
  };

  return (
    <TranslationsContext.Provider value={{ locale, t, getTranslationObject }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export default TranslationsProvider;
