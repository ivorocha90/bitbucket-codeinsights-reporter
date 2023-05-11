import { getFileContents, fileOrFolderExists } from '../utils';
import { ReportEngineResult } from './types';

// move to utils

export default async (fileLocation: string): Promise<ReportEngineResult[]> => {
  if (!fileLocation.endsWith('.json')) {
    throw new Error('SF Code Analiser report file must be a JSON file');
  }

  if (!(await fileOrFolderExists(fileLocation))) {
    return []; // If file does not exist, assume we got an empty file (no violations)
  }
  const fileContent = await getFileContents(fileLocation);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reportResult: ReportEngineResult[] = JSON.parse(fileContent); // TODO validate if file actually contains proper data in expected format
    return reportResult;
  } catch (ex) {
    throw new Error('Invalid JSON file provided');
  }
};
