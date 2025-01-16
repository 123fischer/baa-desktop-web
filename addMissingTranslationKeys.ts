import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import lodash from 'lodash';
import fetch from 'cross-fetch';
import { format } from 'date-fns';
import { OpenAI } from 'openai';

dotenv.config();

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const translationTextRegex = /['`]#i18n\.([^'`]*)['`]/g;
const allTranslationKeys: string[] = [];
const airtableKeys: string[] = [];
let missingTranslationKeys: string[] = [];
let newRecordIds: string[] = [];
let invalidTranslationKeys: string[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const findAllTranslations = (dirPath: string) => {
  // Get a list of all files and subdirectories in the directory
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    // Check if the item is a file or a directory
    if (fs.statSync(fullPath).isFile()) {
      // If it's a file, read the contents and rewrite the text
      let contents = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = translationTextRegex.exec(contents)) !== null) {
        // Get the string value without the quotes and add it to the list
        const stringValue = match[1];
        // Adjustment for TS type definition
        if (stringValue !== '' && stringValue !== '${string}') {
          allTranslationKeys.push(stringValue);
        }
      }
    } else if (fs.statSync(fullPath).isDirectory()) {
      // If it's a directory, recursively call this function
      findAllTranslations(fullPath);
    }
  }
};

const fillEnumOptions = () => {
  const enumTranslationKeyPairs: { [key: string]: Object } = {};
  const keysToIgnore: string[] = [];
  const keysToInclude: string[] = [];
  const generatedTranslationKeys: string[] = [];

  Object.entries(enumTranslationKeyPairs).map(([key, enumeration]) =>
    enumToTranslationKeys(enumeration, key).map((el) =>
      generatedTranslationKeys.push(el)
    )
  );

  const completeTranslationKeysList = [
    ...allTranslationKeys.filter(
      (key) =>
        ![...Object.keys(enumTranslationKeyPairs), ...keysToIgnore].includes(
          key
        )
    ),
    ...keysToInclude,
    ...generatedTranslationKeys,
  ];

  missingTranslationKeys = lodash.uniq(
    completeTranslationKeysList.filter((key) => !airtableKeys.includes(key))
  );
  invalidTranslationKeys = lodash.uniq(
    airtableKeys.filter((el) => !completeTranslationKeysList.includes(el))
  );
};

const enumToTranslationKeys = (enumeration: Object, prefix: string) =>
  Object.values(enumeration)
    .filter((el: string) => isNaN(Number(el)))
    .map((el: string) => `${prefix}.${lodash.camelCase(el)}` || '');

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

const getAirtableKeys = async () => {
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

    data.records.map((record: any) => airtableKeys.push(record.fields.Name));

    offset = data.offset;

    if (!offset) {
      break;
    }
  }
};

const saveMissingKeys = async () => {
  if (!missingTranslationKeys.length) {
    return;
  }

  const date = format(new Date(), 'dd.MM.yyyy H:mm:ss');

  return Promise.all(
    lodash.chunk(missingTranslationKeys, 10).map((chunk, index) =>
      fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${process.env
          .AIRTABLE_KEYS!}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          },
          method: 'POST',
          body: JSON.stringify({
            records: chunk.map((key) => ({
              fields: { Name: key, CreatedAt: date, Project: 'CAD2Web' },
            })),
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          newRecordIds[index] = res.records.map((record: any) => record.id);
        })
    )
  );
};

const autoTranslate = async () => {
  const chunkedAutoTranslations: {
    translationKey: string;
    de: string;
    en: string;
    fr: string;
    it: string;
  }[][] = [];
  const chunkedNewRecordIds = lodash.chunk(lodash.flatten(newRecordIds), 10);

  const translateKeys = async () => {
    const results: typeof chunkedAutoTranslations = [];

    await Promise.all(
      lodash.chunk(missingTranslationKeys, 50).map(async (chunk, i) => {
        const res = await openAI.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `
            You will be provided with a list of translationKeys, which are structured like Java paths. These keys are identifiers used within a software project to locate and apply the correct text in various languages - German, English, French, and Italian. Your task is to analyze each translationKey and generate the best possible translation for the given texts in these four languages.
            The translationKey often contains English words and hints at the context or the UI location where the text is used. For instance, a key like "headerAuthed.my.submenu.administration.items.currentVehicles" suggests that the translation is for an item labeled "Current vehicles" under some administration submenu, possibly in a project related to vehicles.
            Here is how you should approach this task:
                Analyze the translationKey to understand the context and the specific UI element it refers to.
                Based on the context, provide translations in German, English, French, and Italian. If the translationKey does not provide enough context to infer a meaningful translation, use "###NO_TRANSLATION###" as the placeholder text for all languages.
                Your output should be in JSON format, with a structure that includes the translationKey and the translations for each language. Use the following key names within the JSON object:
                    translationKey: The original translation key.
                    de: The German translation.
                    en: The English translation.
                    fr: The French translation.
                    it: The Italian translation.
            Here is an example of the expected JSON output format:
            [
              {
                "translationKey": "headerAuthed.my.submenu.administration.items.currentVehicles",
                "de": "Aktuelle Fahrzeuge",
                "en": "Current vehicles",
                "fr": "Véhicules actuels",
                "it": "Veicoli attuali"
              }
            ]
            Ensure that your translations are contextually appropriate and accurate. When in doubt or lacking context, remember to use the placeholder "###NO_TRANSLATION###" for all languages to maintain consistency and predictability in the output format. Please reply just with pure array of data without markdown.
            The list of translationKeys is: ${chunk}`,
            },
          ],
        });

        results[i] = JSON.parse(
          res.choices[0].message.content
            ?.replace(/```json/g, '')
            .replace(/```/g, '')
            .trim() as string
        );
      })
    );

    lodash
      .chunk(lodash.flatten(results), 10)
      .map((chunk, index) => (chunkedAutoTranslations[index] = chunk));

    return results;
  };

  await translateKeys();

  return Promise.all(
    lodash.chunk(missingTranslationKeys, 10).map((chunk, index) =>
      fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${process.env
          .AIRTABLE_STRINGS!}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          },
          method: 'POST',
          body: JSON.stringify({
            records: chunk.map((_, i) => ({
              fields: {
                Keys: [chunkedNewRecordIds[index][i]],
                keys_old: 'Translated by ChatGPT',
                de: chunkedAutoTranslations[index][i].de,
                en: chunkedAutoTranslations[index][i].en,
                fr: chunkedAutoTranslations[index][i].fr,
                it: chunkedAutoTranslations[index][i].it,
              },
            })),
          }),
        }
      )
    )
  );
};

const init = async () => {
  try {
    if (process.env.VERCEL_GIT_COMMIT_REF !== 'stage') {
      return;
    }

    findAllTranslations('src/');
    await getAirtableKeys();
    fillEnumOptions();
    await saveMissingKeys();
    await autoTranslate();

    // console.log(missingTranslationKeys);
    // console.log(invalidTranslationKeys);
  } catch (err) {
    console.log(err);
  }
};

init();
