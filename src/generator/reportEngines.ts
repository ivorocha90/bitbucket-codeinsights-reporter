import { RestInsightReport } from '../bitbucket/types';

export enum SupportedEngine {
  PMD = 'pmd',
  PMD_CUSTOM = 'pmd-custom',
  CPD = 'cpd',
  ESLINT_LWC = 'eslint-lwc',
  ESLINT_LWC_CUSTOM = 'eslint-lwc-custom',
  ESLINT = 'eslint',
  ESLINT_CUSTOM = 'eslint-custom',
  RETIRE_JS = 'retire-js',
}

interface InsightReportTemplate {
  engines: string[];
  reportTemplate: RestInsightReport;
}

const BITBUCKET_REPORT_ENGINE_TEMPLATES: InsightReportTemplate[] = [
  {
    engines: [SupportedEngine.PMD, SupportedEngine.PMD_CUSTOM],
    reportTemplate: {
      key: 'sfca.pmd.report',
      title: 'PMD report',
      reporter: 'PMD',
      logoUrl: 'https://pmd.github.io/img/pmd-logo-white-600px.png',
    },
  },
  {
    engines: [SupportedEngine.CPD],
    reportTemplate: {
      key: 'sfca.cpd.report',
      title: 'Copy/Paste detector report',
      reporter: 'PMD',
      logoUrl: 'https://pmd.github.io/img/pmd-logo-white-600px.png',
    },
  },
  {
    engines: [
      SupportedEngine.ESLINT_LWC,
      SupportedEngine.ESLINT_LWC_CUSTOM,
      SupportedEngine.ESLINT,
      SupportedEngine.ESLINT_CUSTOM,
    ],
    reportTemplate: {
      key: 'sfca.eslint.report',
      title: 'ESLint report',
      reporter: 'ESLint',
      logoUrl: 'https://eslint.org/img/logo.svg',
    },
  },
  {
    engines: [SupportedEngine.RETIRE_JS],
    reportTemplate: {
      key: 'sfca.retirejs.report',
      title: 'RetireJS report',
      reporter: 'RetireJS',
    },
  },
];

export default function getReportForEngine(engine: string): RestInsightReport {
  const insightReportTemplate: InsightReportTemplate = BITBUCKET_REPORT_ENGINE_TEMPLATES.find((item) =>
    item.engines.includes(engine)
  );
  if (insightReportTemplate != null) {
    return insightReportTemplate.reportTemplate;
  }
}
