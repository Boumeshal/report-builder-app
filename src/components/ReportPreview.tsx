import React from 'react';
import { FileText, Download, Eye, AlertTriangle } from 'lucide-react';
import { Report } from '../types/reporting';

interface ReportPreviewProps {
  report: Report;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  const getTotalElements = () => {
    return report.pages.reduce((total, page) => total + page.elements.length, 0);
  };

  const getElementTypeCount = (type: string) => {
    return report.pages.reduce((total, page) => 
      total + page.elements.filter(el => el.type === type).length, 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Report Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.name}</h2>
            <p className="text-gray-600 mt-1">{report.description}</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu PDF
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Télécharger Word
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{report.pages.length}</div>
            <div className="text-sm text-blue-800">Pages</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{getTotalElements()}</div>
            <div className="text-sm text-green-800">Éléments total</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{getElementTypeCount('chart')}</div>
            <div className="text-sm text-purple-800">Graphiques</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{getElementTypeCount('table')}</div>
            <div className="text-sm text-orange-800">Tableaux</div>
          </div>
        </div>
      </div>

      {/* Period Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Période du rapport</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Du: {report.period.start.toLocaleDateString()}</span>
          <span>•</span>
          <span>Au: {report.period.end.toLocaleDateString()}</span>
          <span>•</span>
          <span>Durée: {Math.ceil((report.period.end.getTime() - report.period.start.getTime()) / (1000 * 60 * 60 * 24))} jours</span>
        </div>
      </div>

      {/* Pages Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Aperçu des pages</h3>
        
        {report.pages.map((page, index) => (
          <div key={page.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Page {index + 1} • {page.orientation} • {page.size}
                </h4>
                <div className="text-sm text-gray-600">
                  {page.elements.length} élément(s) • Disposition {page.layout}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Page Header Preview */}
              {page.header?.enabled && (
                <div className="bg-gray-100 border-b p-3 mb-4 text-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 inline mr-1" />
                  En-tête: {page.header.content}
                </div>
              )}

              {/* Elements Grid Preview */}
              <div className={`grid gap-4 ${
                page.layout === '1x1' ? 'grid-cols-1 grid-rows-1' :
                page.layout === '1x2' ? 'grid-cols-1 grid-rows-2' :
                page.layout === '2x1' ? 'grid-cols-2 grid-rows-1' :
                'grid-cols-2 grid-rows-2'
              }`}>
                {Array.from({ length: 
                  page.layout === '1x1' ? 1 :
                  page.layout === '1x2' || page.layout === '2x1' ? 2 : 4
                }).map((_, elementIndex) => {
                  const element = page.elements[elementIndex];
                  return (
                    <div
                      key={elementIndex}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-center"
                    >
                      {element ? (
                        <div className="text-center">
                          <div className="font-medium text-gray-900 mb-2">{element.title}</div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            element.type === 'chart' ? 'bg-blue-100 text-blue-800' :
                            element.type === 'widget' ? 'bg-green-100 text-green-800' :
                            element.type === 'table' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {element.type === 'chart' ? 'Graphique' :
                             element.type === 'widget' ? 'Widget' :
                             element.type === 'table' ? 'Tableau' : 'Texte'}
                          </div>
                          {element.comment !== 'RAS' && (
                            <div className="text-xs text-gray-500 mt-2">{element.comment}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <div className="text-sm">Emplacement libre</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Page Footer Preview */}
              {page.footer?.enabled && (
                <div className="bg-gray-100 border-t p-3 mt-4 text-center text-sm text-gray-600 flex justify-between">
                  <span>{page.footer.content}</span>
                  {page.footer.showPageNumber && (
                    <span>Page {index + 1}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Validation Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation du rapport</h3>
        
        <div className="space-y-3">
          {report.pages.length === 0 && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Aucune page définie</span>
            </div>
          )}
          
          {report.pages.some(page => page.elements.length === 0) && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Certaines pages sont vides</span>
            </div>
          )}
          
          {getTotalElements() > 0 && report.pages.every(page => page.elements.length > 0) && (
            <div className="flex items-center space-x-2 text-green-600">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Rapport prêt à être généré</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};