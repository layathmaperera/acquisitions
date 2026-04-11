import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const isProduction = process.env.NODE_ENV === 'production';

const rules = [
  shield({ mode: 'LIVE' }),
  slidingWindow({
    mode: 'LIVE',
    interval: '2s',
    max: 5,
  }),
];

if (isProduction) {
  rules.push(
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    })
  );
}

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules,
});
export default aj;
