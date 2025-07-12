export interface ReportElement {
  id: string;
  type: 'chart' | 'widget' | 'table' | 'text';
  title: string;
  comment: string;
  position: {
    row: number;
    col: number;
  };
  size: {
    width: number;
    height: number;
  };
  data?: any;
  config?: any;
}

export interface ReportPage {
  id: string;
  pageNumber: number;
  orientation: 'portrait' | 'landscape';
  size: 'A4' | 'A3' | 'Letter';
  header?: {
    enabled: boolean;
    content: string;
    height: number;
  };
  footer?: {
    enabled: boolean;
    content: string;
    height: number;
    showPageNumber: boolean;
  };
  elements: ReportElement[];
  layout: '1x1' | '1x2' | '2x1' | '2x2';
}

export interface Report {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'generating' | 'ready' | 'error';
  pages: ReportPage[];
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
    ftpConfig?: {
      host: string;
      username: string;
      password: string;
      path: string;
    };
  };
  period: {
    start: Date;
    end: Date;
  };
  documentSettings?: {
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    fonts: {
      title: {
        name: string;
        size: number;
        bold: boolean;
      };
      body: {
        name: string;
        size: number;
      };
      header: {
        name: string;
        size: number;
      };
      footer: {
        name: string;
        size: number;
      };
    };
    spacing: {
      lineHeight: number;
      paragraphSpacing: number;
      sectionSpacing: number;
    };
    colors: {
      primary: string;
      secondary: string;
      text: string;
      accent: string;
    };
  };
}

export interface AlertData {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  value?: number;
  unit?: string;
  acknowledged: boolean;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  dataSource: string;
  xAxis: string;
  yAxis: string[];
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
}

export interface WidgetConfig {
  type: 'kpi' | 'gauge' | 'status' | 'counter';
  title: string;
  dataSource: string;
  metric: string;
  unit?: string;
  thresholds?: {
    min: number;
    max: number;
    colors: string[];
  };
}