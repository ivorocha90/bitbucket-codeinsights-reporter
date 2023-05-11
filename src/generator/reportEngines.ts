import { RestInsightReport } from '../bitbucket/types';

export enum SupportedEngine {
  PMD = 'pmd',
  CPD = 'cpd',
  ESLINT_LWC = 'eslint-lwc',
  RETIRE_JS = 'retire-js',
}

interface InsightReportTemplate {
  engine: string;
  reportTemplate: RestInsightReport;
}

const BITBUCKET_REPORT_ENGINE_TEMPLATES: InsightReportTemplate[] = [
  {
    engine: SupportedEngine.PMD,
    reportTemplate: {
      key: 'sfca.pmd.report',
      title: 'PMD report',
      reporter: 'PMD',
      logoUrl: 'https://pmd.github.io/img/pmd-logo-white-600px.png',
    },
  },
  {
    engine: SupportedEngine.CPD,
    reportTemplate: {
      key: 'sfca.cpd.report',
      title: 'Copy/Paste detector report',
      reporter: 'PMD',
      logoUrl: 'https://pmd.github.io/img/pmd-logo-white-600px.png',
    },
  },
  {
    engine: SupportedEngine.ESLINT_LWC,
    reportTemplate: {
      key: 'sfca.eslint.report',
      title: 'ESLint report',
      reporter: 'ESLint',
      logoUrl: 'https://eslint.org/img/logo.svg',
    },
  },
  {
    engine: SupportedEngine.RETIRE_JS,
    reportTemplate: {
      key: 'sfca.retirejs.report',
      title: 'RetireJS report',
      reporter: 'RetireJS',
      logoUrl: '',
    },
  },
];

export default function getReportForEngine(engine: string): RestInsightReport {
  const insightReportTemplate: InsightReportTemplate = BITBUCKET_REPORT_ENGINE_TEMPLATES.find(
    (item) => item.engine === engine
  );
  if (insightReportTemplate != null) {
    return insightReportTemplate.reportTemplate;
  }
}
