import {config} from 'dotenv';
import {IS_SSR} from '../constants.js';

if (IS_SSR) {
    config();
}

/** @param {string} key */
export const getEnv = key => {
    const metaEnv = import.meta.env ? import.meta.env[key] : undefined;
    if (metaEnv) return metaEnv.toString();

    const processEnv = process.env[key];
    if (processEnv) return processEnv;

    throw new Error(`Unknown env key ${key}`);
};
