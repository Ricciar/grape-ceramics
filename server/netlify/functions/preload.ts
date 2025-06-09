import { Handler } from '@netlify/functions';
import { preloadAllWooData } from '../../src/preload.js';

export const handler: Handler = async () => {
  console.log('[CRON] Running scheduled preload...');
  await preloadAllWooData();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Scheduled preload completed' }),
  };
};
