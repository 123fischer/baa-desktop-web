'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import lodash from 'lodash';
import TRANSLATIONS from '../../data/translations.json';
import type { Locales } from '@/types/types';
import { IS_PRODUCTION } from '@/constants/constants';

const TRUNCATE_UNTRANSLATED = IS_PRODUCTION;

type Translations = {
  locale: Locales;
  t: (path: `#i18n.${string}`, vars?: { [key: string]: string }) => string;
};

const defaultValue: Translations = {
  locale: 'de',
  t: () => '',
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

  const t: Translations['t'] = (path, vars = {}) => {
    const originalPath: string = path.replace('#i18n.', '');

    return (
      lodash.get(TRANSLATIONS, originalPath)?.[locale] ??
      (TRUNCATE_UNTRANSLATED
        ? (originalPath.split('.').pop() as string)
        : originalPath)
    ).replace(
      /{(\w+)(?::([^}]+))?}/g,
      (match: string, p1: string, p2: string) => vars[p1] || p2 || match
    );
  };

  return (
    <TranslationsContext.Provider value={{ locale, t }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export default TranslationsProvider;
