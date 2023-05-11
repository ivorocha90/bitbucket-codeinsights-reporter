export type RestAPISuccessResponse = {
  values: object[];
  size: number;
  isLastPage: boolean;
  start: number;
  limit: number;
  nextPageStart: number;
};

export type RestAPIErrorResponse = {
  errors: [
    {
      context: string;
      message: string;
      exceptionName: string;
    }
  ];
};

export type RestAPIResponse = RestAPISuccessResponse | RestAPIErrorResponse;

/** Insight Report  */

export enum RestInsightReportResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export enum RestInsightReportDataType {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DURATION = 'DURATION',
  LINK = 'LINK',
  NUMBER = 'NUMBER',
  PERCENTAGE = 'PERCENTAGE',
  TEXT = 'TEXT',
}

export type RestInsightReportData = {
  title: string;
  value: boolean | number | string;
  type?: RestInsightReportDataType;
};

export interface RestInsightReport {
  key: string;
  title: string;
  reporter: string;
  logoUrl?: string;
  details?: string;
  result?: RestInsightReportResult;
  data?: RestInsightReportData[];
  link?: string;
}

/** Annotations */

// for the GET
export type RestInsightAnnotation = {
  path: string;
  line: string;
  message: string;
  severity: string;
  link: string;
  type: string;
  externalId: string;
  reportKey: string;
};

export enum RestSingleAddInsightAnnotationRequestSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RestSingleAddInsightAnnotationRequestType {
  VULNERABILITY = 'VULNERABILITY',
  CODE_SMELL = 'CODE_SMELL',
  BUG = 'BUG',
}

// for the POST
export type RestSingleAddInsightAnnotationRequest = {
  path: string;
  line: string;
  message: string;
  severity: RestSingleAddInsightAnnotationRequestSeverity;
  link: string;
  type?: RestSingleAddInsightAnnotationRequestType;
  externalId?: string;
};

export type RestBulkAddInsightAnnotationsRequest = {
  annotations: RestSingleAddInsightAnnotationRequest[];
};
