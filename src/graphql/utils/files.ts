import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { camelCase } from 'lodash/fp';

const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);

const requirer = (target) => {
  try {
    // eslint-disable-next-line
    return require(target).default;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw error;
  }
};

const reader = async (target) => {
  try {
    return await readFile(target, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const fileLoader = (loader) => async (filename) => {
  const basePath = path.resolve(__dirname, '../types');
  const types = await readDir(basePath);
  const files = await Promise.all(types.map((type) => loader(path.resolve(basePath, type, filename))));

  return files.reduce((acc, file, i) => (
    file ? { ...acc, [camelCase(types[i])]: file } : acc
  ), {});
};

type FileRequirer = (filename: string) => Promise<{[s: string]: Function}>;
export const requireTypesFile: FileRequirer = fileLoader(requirer);

type FileReader = (filename: string) => Promise<{[s: string]: string}>;
export const readTypesFile: FileReader = fileLoader(reader);
