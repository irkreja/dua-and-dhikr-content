// scripts/fetch-ayat-content.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'data', 'generated');
const outputFile = path.join(outputDir, `ayat-of-quran.json`);

const config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://apis.quran.foundation/content/api/v4/verses/by_range/?from=2:255&to=2:255&language=bn&words=true&fields=text_indopak_nastaleeq,text_uthmani,text_qpc_hafs,code_v2&word_fields=text_indopak_nastaleeq,text_uthmani,text_qpc_hafs,code_v2,verse_key&translations=161,163,162,213&translation_fields=language_name,verse_key,resource_name,language_id`,
  headers: {
    'x-auth-token': process.env.QF_ACCESS_TOKEN,
    'x-client-id': process.env.QF_CLIENT_ID_PROD,
  },
};

async function fetchAyatContent() {
  try {
    const response = await axios.request(config);
    const verses = response.data.verses ?? [];

    const items = verses.map((verse) => {
      const translation = verse.translations?.find(
        (item) => item.resource_id === 162
      );

      return {
        id: verse.verse_number,
        text: verse.text_uthmani,
        translation: translation?.text ?? '',
        showDivider: true,
        words: (verse.words ?? []).map((word) => ({
          ar: word.text_uthmani,
          bn: word.translation?.text ?? '',
        })),
      };
    });

    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
      outputFile,
      JSON.stringify(items , null, 2),
      'utf8'
    );

    console.log(`Saved ${items.length} verses to ${outputFile}`);
  } catch (error) {
    console.error(
      'Failed to fetch sura content:',
      error.response?.data ?? error.message
    );
    process.exitCode = 1;
  }
}

fetchAyatContent();