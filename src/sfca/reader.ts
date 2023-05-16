import { getFileContents, fileOrFolderExists } from '../utils';
import { ReportEngineResult } from './types';

// move to utils

async function readAndParseFile(fileLocation: string): Promise<ReportEngineResult[]> {
  if (!fileLocation.endsWith('.json')) {
    throw new Error('SF Code Analiser report file must be a JSON file');
  }

  if (!(await fileOrFolderExists(fileLocation))) {
    return [];
  }

  const fileContent = await getFileContents(fileLocation);
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reportResult: ReportEngineResult[] = JSON.parse(fileContent); // TODO validate if file actually contains proper data in expected format
    return [...reportResult];
  } catch (ex) {
    throw new Error('Invalid JSON file provided');
  }
}

export default async (fileLocations: string[]): Promise<ReportEngineResult[]> => {
  const results = [];

  for (const fileLocation of fileLocations) {
    results.push(readAndParseFile(fileLocation));
  }

  const parsedResults = await Promise.all(results);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parsedResults.flat();
};
