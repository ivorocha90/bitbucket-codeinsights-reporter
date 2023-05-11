import axios from 'axios';
import {
  RestAPIResponse,
  RestAPIErrorResponse,
  RestInsightReport,
  RestSingleAddInsightAnnotationRequest,
  RestBulkAddInsightAnnotationsRequest,
} from './types';

export default class BitbucketServerClient {
  private serverUrl: URL;
  private authUsername: string;
  private authPassword: string;

  public constructor(url: URL, username: string, password: string) {
    this.serverUrl = url;
    this.authUsername = username;
    this.authPassword = password;
  }

  public async getCollection(path: string, options: object): Promise<RestAPIResponse> {
    return this.get(path, { limit: 1000, ...options });
  }

  public async get(path: string, options?: object): Promise<RestAPIResponse> {
    try {
      const { data } = await axios.get<RestAPIResponse>(this.serverUrl.toString() + path, {
        auth: {
          username: this.authUsername,
          password: this.authPassword,
        },
        params: options,
      });
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const response: RestAPIErrorResponse = error.response?.data;
      throw new Error(`GET ${path}: ${JSON.stringify(response)}`);
    }
  }

  public async post(path: string, data: object): Promise<RestAPIResponse> {
    try {
      const { data: response } = await axios.post<RestAPIResponse>(this.serverUrl.toString() + path, data, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: this.authUsername,
          password: this.authPassword,
        },
      });
      return response;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const response: RestAPIErrorResponse = error.response?.data;
      throw new Error(`POST ${path}: ${JSON.stringify(response)}`);
    }
  }

  public async put(path: string, data: object): Promise<RestAPIResponse> {
    try {
      const { data: response } = await axios.put<RestAPIResponse>(this.serverUrl.toString() + path, data, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: this.authUsername,
          password: this.authPassword,
        },
      });
      return response;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const response: RestAPIErrorResponse = error.response?.data;
      throw new Error(`PUT ${path}: ${JSON.stringify(response)}`);
    }
  }

  public async delete(path: string): Promise<RestAPIResponse> {
    try {
      const { data: response } = await axios.delete<RestAPIResponse>(this.serverUrl.toString() + path, {
        auth: {
          username: this.authUsername,
          password: this.authPassword,
        },
      });
      return response;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const response: RestAPIErrorResponse = error.response?.data;
      throw new Error(`DELETE ${path}: ${JSON.stringify(response)}`);
    }
  }

  public async createInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    reportKey: string,
    reportData: RestInsightReport
  ): Promise<RestAPIResponse> {
    return this.put(
      `rest/insights/latest/projects/${projectKey}/repos/${repositorySlug}/commits/${commitId}/reports/${reportKey}`,
      reportData
    );
  }

  public async getInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    reportKey: string
  ): Promise<RestAPIResponse> {
    return this.get(
      `rest/insights/latest/projects/${projectKey}/repos/${repositorySlug}/commits/${commitId}/reports/${reportKey}`
    );
  }

  public async deleteInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    reportKey: string
  ): Promise<RestAPIResponse> {
    return this.delete(
      `rest/insights/latest/projects/${projectKey}/repos/${repositorySlug}/commits/${commitId}/reports/${reportKey}`
    );
  }

  public async addAnnotationsToInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    reportKey: string,
    annotations: RestBulkAddInsightAnnotationsRequest
  ): Promise<RestAPIResponse> {
    return this.post(
      `rest/insights/latest/projects/${projectKey}/repos/${repositorySlug}/commits/${commitId}/reports/${reportKey}/annotations`,
      annotations
    );
  }

  public async deleteAnnotationsFromInsightReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    reportKey: string
  ): Promise<RestAPIResponse> {
    return this.delete(
      `rest/insights/latest/projects/${projectKey}/repos/${repositorySlug}/commits/${commitId}/reports/${reportKey}/annotations`
    );
  }

  public async publishFullCodeInsightsReport(
    projectKey: string,
    repositorySlug: string,
    commitId: string,
    report: RestInsightReport,
    annotations: RestSingleAddInsightAnnotationRequest[]
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('  - Creating/Updating insight report of commit on Bitbucket');
    await this.createInsightReport(projectKey, repositorySlug, commitId, report.key, report);

    // eslint-disable-next-line no-console
    console.log('  - Deleting existing insight report annotation of commit on Bitbucket');
    await this.deleteAnnotationsFromInsightReport(projectKey, repositorySlug, commitId, report.key);
    if (annotations.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`  - Publishing ${annotations.length} annotations on insight report`);
      const bulkAnnotationsBody: RestBulkAddInsightAnnotationsRequest = {
        annotations,
      };
      await this.addAnnotationsToInsightReport(projectKey, repositorySlug, commitId, report.key, bulkAnnotationsBody);
    } else {
      // eslint-disable-next-line no-console
      console.log('  - No annotations to publish');
    }
  }
}
