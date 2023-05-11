export type ReportEngineResult = {
  engine: string;
  fileName: string;
  violations: Violation[];
};

export type Violation = {
  line: string;
  column: string;
  endLine: string;
  endColumn: string;
  ruleName: string;
  category: string;
  url: string;
  message: string;
  severity: number;
  normalizedSeverity: number;
};
