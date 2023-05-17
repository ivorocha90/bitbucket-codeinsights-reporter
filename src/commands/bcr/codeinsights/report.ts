import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import BitbucketServerClient from '../../../bitbucket/client';
import sfcaReader from '../../../sfca/reader';
import { ReportEngineResult } from '../../../sfca/types';
import { SupportedEngine } from '../../../generator/reportEngines';
import Generator from '../../../generator';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('bitbucket-codeinsights-reporter', 'bcr.codeinsights.report');

export type BcrCodeinsightsReportResult = {
  path: string;
};

export default class BcrCodeinsightsReport extends SfCommand<BcrCodeinsightsReportResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'report-file': Flags.file({
      multiple: true,
      // exists: true,
      // eslint-disable-next-line sf-plugin/no-missing-messages
      summary: messages.getMessage('flags.report-file.summary'),
      required: true,
    }),
    'commit-id': Flags.string({
      summary: messages.getMessage('flags.commit-id.summary'),
      required: true,
    }),
    'bitbucket-server-url': Flags.url({
      summary: messages.getMessage('flags.bitbucket-server-url.summary'),
      required: true,
    }),
    'bitbucket-auth-username': Flags.string({
      summary: messages.getMessage('flags.bitbucket-auth-username.summary'),
      required: true,
    }),
    'bitbucket-auth-password': Flags.string({
      summary: messages.getMessage('flags.bitbucket-auth-password.summary'),
      required: true,
    }),
    'bitbucket-project-key': Flags.string({
      summary: messages.getMessage('flags.bitbucket-project-key.summary'),
      required: true,
    }),
    'bitbucket-repository-slug': Flags.string({
      summary: messages.getMessage('flags.bitbucket-repository-slug.summary'),
      required: true,
    }),
    'skip-engine-results': Flags.string({
      summary: messages.getMessage('flags.skip-engine-results.summary'),
      required: false,
      multiple: true,
      options: [SupportedEngine.PMD, SupportedEngine.ESLINT, SupportedEngine.CPD, SupportedEngine.RETIRE_JS],
      default: [],
    }),
  };

  public async run(): Promise<BcrCodeinsightsReportResult> {
    const { flags } = await this.parse(BcrCodeinsightsReport);

    const reportFilePaths = flags['report-file'];
    const bitbucketProjectKey = flags['bitbucket-project-key'];
    const bitbucketRepositorySlug = flags['bitbucket-repository-slug'];
    const commitId = flags['commit-id'];

    const bitbucketClient: BitbucketServerClient = new BitbucketServerClient(
      flags['bitbucket-server-url'],
      flags['bitbucket-auth-username'],
      flags['bitbucket-auth-password']
    );

    const reportResults: ReportEngineResult[] = await sfcaReader(reportFilePaths);

    if (!flags['skip-engine-results'].includes(SupportedEngine.PMD)) {
      this.log('=== Analysing PMD results ===');

      const pmdGenerator = new Generator(reportResults, [SupportedEngine.PMD, SupportedEngine.PMD_CUSTOM]);
      const reportData = pmdGenerator.getData();

      await bitbucketClient.publishFullCodeInsightsReport(
        bitbucketProjectKey,
        bitbucketRepositorySlug,
        commitId,
        reportData.report,
        reportData.annotations
      );
    }

    if (!flags['skip-engine-results'].includes(SupportedEngine.ESLINT)) {
      this.log('=== Analysing ESLint results ===');

      const eslintLwcGenerator = new Generator(reportResults, [
        SupportedEngine.ESLINT_LWC,
        SupportedEngine.ESLINT,
        SupportedEngine.ESLINT_LWC_CUSTOM,
        SupportedEngine.ESLINT_CUSTOM,
      ]);
      const reportData = eslintLwcGenerator.getData();
      // this.log(JSON.stringify(reportData));
      await bitbucketClient.publishFullCodeInsightsReport(
        bitbucketProjectKey,
        bitbucketRepositorySlug,
        commitId,
        reportData.report,
        reportData.annotations
      );
    }

    if (!flags['skip-engine-results'].includes(SupportedEngine.CPD)) {
      this.log('=== Analysing CPD results ===');

      const cpdGenerator = new Generator(reportResults, [SupportedEngine.CPD]);
      const reportData = cpdGenerator.getData();
      // this.log(JSON.stringify(reportData));
      await bitbucketClient.publishFullCodeInsightsReport(
        bitbucketProjectKey,
        bitbucketRepositorySlug,
        commitId,
        reportData.report,
        reportData.annotations
      );
    }

    if (!flags['skip-engine-results'].includes(SupportedEngine.RETIRE_JS)) {
      this.log('=== Analysing RetireJS results ===');

      const retireJsGenerator = new Generator(reportResults, [SupportedEngine.RETIRE_JS]);
      const reportData = retireJsGenerator.getData();
      // this.log(JSON.stringify(reportData));
      await bitbucketClient.publishFullCodeInsightsReport(
        bitbucketProjectKey,
        bitbucketRepositorySlug,
        commitId,
        reportData.report,
        reportData.annotations
      );
    }

    return {
      path: '/Users/ivo.rocha/sf-development/bitbucket-codeinsights-reporter/src/commands/bcr/codeinsights/report.ts',
    };
  }
}
