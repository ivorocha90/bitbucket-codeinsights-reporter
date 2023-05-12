import * as path from 'path';
import { RestSingleAddInsightAnnotationRequestSeverity } from '../bitbucket/types';
import {
  RestSingleAddInsightAnnotationRequest,
  RestInsightReport,
  RestInsightReportDataType,
} from '../bitbucket/types';
import { ReportEngineResult, Violation } from '../sfca/types';
import getReportForEngine, { SupportedEngine } from './reportEngines';

function getNormalizedSeverity(severity: number): RestSingleAddInsightAnnotationRequestSeverity {
  switch (severity) {
    case 1:
      return RestSingleAddInsightAnnotationRequestSeverity.HIGH;
    case 2:
      return RestSingleAddInsightAnnotationRequestSeverity.MEDIUM;
    case 3:
      return RestSingleAddInsightAnnotationRequestSeverity.LOW;
    default:
      return RestSingleAddInsightAnnotationRequestSeverity.LOW;
  }
}

function createAnnotation(filePath: string, violation: Violation): RestSingleAddInsightAnnotationRequest {
  const relativePath = path.relative(process.cwd(), filePath);
  const annotation: RestSingleAddInsightAnnotationRequest = {
    path: relativePath,
    line: violation.line,
    message: violation.message,
    severity: getNormalizedSeverity(violation.normalizedSeverity),
    link: violation.url,
  };
  return annotation;
}

export default class Generator {
  private sfcaReportEngineResults: ReportEngineResult[];
  private engine: SupportedEngine;

  private annotations: RestSingleAddInsightAnnotationRequest[];
  private report: RestInsightReport;

  public constructor(sfcaReportResults: ReportEngineResult[], engine: SupportedEngine) {
    this.engine = engine;

    // extract from the report results only those that belong to this engine (eg. 'pmd' or 'pmd-custom')
    this.sfcaReportEngineResults = sfcaReportResults.filter(
      (reportFile) => reportFile.engine === this.engine || reportFile.engine === this.engine + '-custom'
    );

    this.generateReport();
  }

  public getData(): { report: RestInsightReport; annotations: RestSingleAddInsightAnnotationRequest[] } {
    return {
      report: this.report,
      annotations: this.annotations,
    };
  }

  public hasData(): boolean {
    return this.annotations.length > 0;
  }

  private generateReport(): void {
    this.annotations = [];

    let numFilesWithViolations = 0;
    let highViolations = 0;
    let mediumViolations = 0;
    let lowViolations = 0;
    let violations = 0;

    for (const file of this.sfcaReportEngineResults) {
      numFilesWithViolations++;
      for (const violation of file.violations) {
        violations++;
        const annotation = createAnnotation(file.fileName, violation);
        this.annotations.push(annotation);

        switch (annotation.severity) {
          case RestSingleAddInsightAnnotationRequestSeverity.HIGH:
            highViolations++;
            break;
          case RestSingleAddInsightAnnotationRequestSeverity.MEDIUM:
            mediumViolations++;
            break;
          case RestSingleAddInsightAnnotationRequestSeverity.LOW:
            lowViolations++;
            break;
        }

        if (violations === 1000) {
          // hard-limit
          break;
        }
      }

      if (violations === 1000) {
        // hard-limit
        break;
      }
    }

    this.report = getReportForEngine(this.engine);
    this.report.data = [
      { title: 'Files with violations', value: numFilesWithViolations, type: RestInsightReportDataType.NUMBER },
      { title: 'Total violations', value: violations, type: RestInsightReportDataType.NUMBER },
      { title: 'High priority violations', value: highViolations, type: RestInsightReportDataType.NUMBER },
      { title: 'Medium priority violations', value: mediumViolations, type: RestInsightReportDataType.NUMBER },
      { title: 'Low priority violations', value: lowViolations, type: RestInsightReportDataType.NUMBER },
    ];
    this.report.details = this.annotations.length === 0 ? 'No violations found' : 'Violations found';
  }
}
