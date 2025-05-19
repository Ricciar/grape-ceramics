import server from '../../src/app';
import serverless from 'serverless-http';

export const handler = serverless(server);
