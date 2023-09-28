import { log } from 'console';
import { readdir } from 'node:fs/promises';

log(process.env.PATH);
readdir('./').then(log);
