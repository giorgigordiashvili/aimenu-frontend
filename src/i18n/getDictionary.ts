import { Locale } from './config';
import en from './dictionaries/en.json';
import ka from './dictionaries/ka.json';
import ru from './dictionaries/ru.json';

export type Dictionary = typeof ka;

const dictionaries: Record<Locale, Dictionary> = {
  ka,
  en,
  ru,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.ka;
}
