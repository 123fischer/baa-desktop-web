import fetch from 'cross-fetch';
import fs from 'fs';
import lodash from 'lodash';

const locales = ['de', 'en', 'fr', 'it'] as const;
const translationData: any = {};
const keys: any = {};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const writeFile = (path: string, data: any) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

const fetchAirtableData = async (tableId: string, offset = '') => {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${tableId}?offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    }
  );
  return response.json();
};

const getKeys = async () => {
  let offset = '';
  while (true) {
    if (offset) {
      await sleep(200);
    }
    const data = await fetchAirtableData(process.env.AIRTABLE_KEYS!, offset);
    data?.records?.map((record: any) => {
      keys[record.id] = record.fields.Name;
    });

    offset = data.offset;

    if (!offset) {
      break;
    }
  }
};

const getStrings = async () => {
  let offset = '';
  while (true) {
    if (offset) {
      await sleep(200);
    }
    const data = await fetchAirtableData(process.env.AIRTABLE_STRINGS!, offset);
    data?.records?.map(({ fields }: { fields: any }) => {
      if (fields.Keys?.length) {
        fields?.Keys?.map((key: string) => {
          const value: any = {};
          locales?.map((locale) => (value[locale] = fields[locale]));
          lodash.set(translationData, keys[key], {
            ...lodash.get(translationData, keys[key]),
            ...value,
          });
        });
      }
    });

    offset = data.offset;

    if (!offset) {
      break;
    }
  }
};

const init = async () => {
  try {
    await getKeys();
    await getStrings();

    writeFile('./data/translations.json', translationData);
  } catch (err) {
    writeFile('./data/translations.json', {});
    console.log(err);
  }
};

init();
