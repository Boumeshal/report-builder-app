import React, { useState } from 'react';
import {
  FileText,
  Type,
  Ruler,
  Palette,
  AlignLeft,
  Eye,
  RotateCcw,
  Save
} from 'lucide-react';
import { Report } from '../types/reporting';
import WordDocumentPreview from './WordDocumentPreview';

interface DocumentLayoutConfigProps {
  report: Report;
  onUpdateReport: (report: Report) => void;
}

export const DocumentLayoutConfig: React.FC<DocumentLayoutConfigProps> = ({
  report,
  onUpdateReport
}) => {
  const [activeSection, setActiveSection] = useState<
    'general' | 'planning' | 'header' | 'footer' | 'content'
  >('general');

  const updateDocumentSettings = (updates: any) => {
    onUpdateReport({
      ...report,
      documentSettings: {
        ...report.documentSettings!,
        ...updates
      }
    });
  };

  const updateReport = (updates: Partial<Report>) => {
    onUpdateReport({
      ...report,
      ...updates
    });
  };

  const resetToDefaults = () => {
    onUpdateReport({
      ...report,
      documentSettings: {
        margins: { top: 2.5, bottom: 2.5, left: 2.5, right: 2.5 },
        fonts: {
          title: { name: 'Calibri', size: 16, bold: true },
          body: { name: 'Calibri', size: 11 },
          header: { name: 'Calibri', size: 10 },
          footer: { name: 'Calibri', size: 9 }
        },
        spacing: { lineHeight: 1.15, paragraphSpacing: 6, sectionSpacing: 12 },
        colors: { primary: '#2563EB', secondary: '#64748B', text: '#1F2937', accent: '#059669' }
      }
    });
  };

  const fontOptions = [
    'Calibri',
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Segoe UI'
  ];

  const settings = report.documentSettings!;

  return (
    <div className="h-full bg-gray-50">
      {/* Header with Tabs */}
      <div className="bg-blue-800 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            {[
              { id: 'general', label: 'Général' },
              { id: 'planning', label: 'Planification' },
              { id: 'header', label: 'En-tête' },
              { id: 'footer', label: 'Pied de page' },
              { id: 'content', label: 'Contenu' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeSection === tab.id
                    ? 'bg-white text-blue-800'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded">
              <Eye className="h-5 w-5" />
            </button>
            <button className="p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded">
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - Configuration */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Place your tab content here (as dans ton fichier initial) */}
            {/* Par souci de concision, cette partie reste inchangée */}
            {/* Tu peux la garder telle quelle, car seule l'import était incorrect */}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-gray-100 overflow-y-auto">
          <WordDocumentPreview report={report} />
        </div>
      </div>
    </div>
  );
};
