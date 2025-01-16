import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import lodash from 'lodash';

dotenv.config();

const locales = ['de', 'en', 'fr', 'it'] as const;
const translationData: any = {};
const keys: any = {};
const stringIds: string[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const writeFile = (path: string, data: any) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

const fetchAirtableData = async (
  tableId: string,
  {
    offset = '',
    filterFormula = '',
  }: { offset?: string; filterFormula?: string }
) => {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${tableId}?${
      offset && `offset=${offset}`
    }${filterFormula && `&filterByFormula=${filterFormula}`}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    }
  );
  return response.json();
};

const getKeys = async () => {
  const filterFormula = encodeURIComponent(`{Project} = 'CAD2Web'`);
  let offset = '';

  while (true) {
    if (offset) {
      await sleep(200);
    }
    const data = await fetchAirtableData(process.env.AIRTABLE_KEYS!, {
      offset,
      filterFormula,
    });

    data?.records?.map((record: any) => {
      keys[record.id] = record.fields.Name;
      record.fields.MapToStringId?.map((id: string) => stringIds.push(id));
    });

    offset = data.offset;

    if (!offset) {
      break;
    }
  }
};

const getStrings = async () => {
  let count = 0;
  const processChunk = async (chunk: typeof stringIds) => {
    const filterFormula = `OR(${chunk
      .map((id) => `RECORD_ID() = '${id}'`)
      .join(',')})`;
    const data = await fetchAirtableData(process.env.AIRTABLE_STRINGS!, {
      filterFormula,
    });

    count += data?.records.length;
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
  };

  const chunks = lodash.chunk(lodash.uniq(stringIds), 100);

  for (const chunk of chunks) {
    await processChunk(chunk);
    await sleep(200);
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
