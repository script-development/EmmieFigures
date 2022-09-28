import fs from 'fs/promises';

/** @param {string} path */
export const fileExists = async path => {
    let filehandle;
    try {
        filehandle = await fs.open(path, 'r');
    } catch (/** @type {any} */ err) {
        if (err.code === 'ENOENT') return false;
    } finally {
        await filehandle?.close();
    }
    return true;
};
