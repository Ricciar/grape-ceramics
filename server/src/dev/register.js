import { register } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
register('ts-node/esm', pathToFileURL('./'));
