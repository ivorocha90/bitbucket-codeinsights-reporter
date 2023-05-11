import { promises as fs } from 'fs';

export async function fileOrFolderExists(fileOrDirPath: string): Promise<boolean> {
  try {
    await fs.access(fileOrDirPath);
    return true;
  } catch {
    return false;
  }
}

export async function getFileContents(filePath: string): Promise<string> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return fileContent;
}
