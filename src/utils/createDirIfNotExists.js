import fs from 'fs';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.promises.mkdir(url, { recursive: true });
  } catch (error) {
    console.error(`❌ Failed to create directory: ${url}`, error);
    throw error;
  }
};
