import { resolve } from 'path';

export const pathResolve = (dir: string) => resolve(__dirname, '../../', dir);
