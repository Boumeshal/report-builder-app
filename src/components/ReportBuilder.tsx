import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Download, 
  Send, 
  Calendar, 
  FileText,
  Grid,
  Layout,
  Monitor,
  BarChart3,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Report, ReportPage, ReportElement } from '../types/reporting';
import { PageConfiguration } from './PageConfiguration';
import { ElementSelector } from './ElementSelector';
import { ReportPreview } from './ReportPreview';
import { ScheduleConfig } from './ScheduleConfig';
import { DocumentLayoutConfig } from './DocumentLayoutConfig';

export const ReportBuilder: React.FC = () => {
  const [report, setReport] = useState<Report>({
    id: '1',
    name: 'Rapport IoT Mensuel',
    description: 'Rapport automatique des données IoT',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    pages: [],
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    documentSettings: {
      margins: {
        top: 2.5,
        bottom: 2.5,
        left: 2.5,
        right: 2.5
      },
      fonts: {
        title: {
          name: 'Calibri',
          size: 16,
          bold: true
        },
        body: {
          name: 'Calibri',
          size: 11
        },
        header: {
          name: 'Calibri',
          size: 10
        },
        footer: {
          name: 'Calibri',
          size: 9
        }
      },
      spacing: {
        lineHeight: 1.15,
        paragraphSpacing: 6,
        sectionSpacing: 12
      },
      colors: {
        primary: '#2563EB',
        secondary: '#64748B',
        text: '#1F2937',
        accent: '#059669'
      }
    }
  });

  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'schedule'>('builder');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showPageConfig, setShowPageConfig] = useState(false);
  const [showElementSelector, setShowElementSelector] = useState(false);

  useEffect(() => {
    // Initialize with default page
    if (report.pages.length === 0) {
      addNewPage();
    }
  }, []);

  const addNewPage = () => {
    const newPage: ReportPage = {
      id: `page-${Date.now()}`,
      pageNumber: report.pages.length + 1,
      orientation: 'portrait',
      size: 'A4',
      header: {
        enabled: true,
        content: 'Rapport IoT - {date}',
        height: 2
      },
      footer: {
        enabled: true,
        content: 'Confidentiel - Ne pas diffuser',
        height: 1.5,
        showPageNumber: true
      },
      elements: [],
      layout: '1x2'
    };

    setReport(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      updatedAt: new Date()
    }));

    setSelectedPageId(newPage.id);
  };

  const updatePage = (pageId: string, updates: Partial<ReportPage>) => {
    setReport(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === pageId ? { ...page, ...updates } : page
      ),
      updatedAt: new Date()
    }));
  };

  const addElementToPage = (pageId: string, element: Omit<ReportElement, 'id'>) => {
    const newElement: ReportElement = {
      ...element,
      id: `element-${Date.now()}`
    };

    updatePage(pageId, {
      elements: [...(report.pages.find(p => p.id === pageId)?.elements || []), newElement]
    });
  };

  const generateReport = async () => {
    setReport(prev => ({ ...prev, status: 'generating' }));
    
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.name}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setReport(prev => ({ ...prev, status: 'ready' }));
      } else {
        throw new Error('Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setReport(prev => ({ ...prev, status: 'error' }));
    }
  };

  const selectedPage = report.pages.find(p => p.id === selectedPageId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{report.name}</h1>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Dernière modification: {report.updatedAt.toLocaleString()}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                report.status === 'ready' ? 'bg-green-100 text-green-800' :
                report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {report.status === 'ready' ? 'Prêt' :
                 report.status === 'generating' ? 'Génération...' :
                 report.status === 'error' ? 'Erreur' : 'Brouillon'}
              </div>

              <button
                onClick={generateReport}
                disabled={report.status === 'generating'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Générer Word
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'builder', label: 'Constructeur', icon: Layout },
              { id: 'layout', label: 'Mise en page', icon: FileText },
              { id: 'preview', label: 'Aperçu', icon: Monitor },
              { id: 'schedule', label: 'Planification', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pages List */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Pages</h3>
                  <button
                    onClick={addNewPage}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </button>
                </div>
                
                <div className="space-y-2">
                  {report.pages.map((page, index) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPageId === page.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Page {index + 1}</span>
                        <span className="text-xs text-gray-500">
                          {page.elements.length} élément(s)
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {page.orientation} • {page.size}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Configuration */}
              {selectedPage && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Configuration</h3>
                    <button
                      onClick={() => setShowPageConfig(true)}
                      className="inline-flex items-center px-3 py-1 text-gray-600 text-sm hover:text-gray-900 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Modifier
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Orientation:</span>
                      <span className="ml-2 font-medium">{selectedPage.orientation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taille:</span>
                      <span className="ml-2 font-medium">{selectedPage.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Disposition:</span>
                      <span className="ml-2 font-medium">{selectedPage.layout}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowElementSelector(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ajouter Graphique
                  </button>
                  
                  <button
                    onClick={() => {
                      if (selectedPageId) {
                        addElementToPage(selectedPageId, {
                          type: 'table',
                          title: 'Tableau des Alertes',
                          comment: 'Alertes de la période sélectionnée',
                          position: { row: 0, col: 0 },
                          size: { width: 100, height: 300 }
                        });
                      }
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Ajouter Alertes
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {selectedPage ? (
                <div className="bg-white rounded-lg shadow-sm border">
                  {/* Page Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Page {selectedPage.pageNumber}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Grid className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Disposition: {selectedPage.layout}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Page Content */}
                  <div className="p-6">
                    <div className={`grid gap-4 ${
                      selectedPage.layout === '1x1' ? 'grid-cols-1 grid-rows-1' :
                      selectedPage.layout === '1x2' ? 'grid-cols-1 grid-rows-2' :
                      selectedPage.layout === '2x1' ? 'grid-cols-2 grid-rows-1' :
                      'grid-cols-2 grid-rows-2'
                    }`} style={{ minHeight: '400px' }}>
                      {Array.from({ length: 
                        selectedPage.layout === '1x1' ? 1 :
                        selectedPage.layout === '1x2' || selectedPage.layout === '2x1' ? 2 : 4
                      }).map((_, index) => {
                        const element = selectedPage.elements[index];
                        return (
                          <div
                            key={index}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[180px] hover:border-blue-400 transition-colors"
                          >
                            {element ? (
                              <div className="w-full">
                                <h4 className="font-medium text-gray-900 mb-2">{element.title}</h4>
                                <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center mb-2">
                                  <span className="text-gray-500 capitalize">{element.type}</span>
                                </div>
                                <p className="text-sm text-gray-600">{element.comment}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowElementSelector(true)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Plus className="h-8 w-8 mb-2" />
                                <div className="text-sm">Ajouter un élément</div>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez une page
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une page dans la liste pour commencer l'édition
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <DocumentLayoutConfig 
            report={report} 
            onUpdateReport={setReport}
          />
        )}

        {activeTab === 'preview' && (
          <ReportPreview report={report} />
        )}

        {activeTab === 'schedule' && (
          <ScheduleConfig 
            report={report} 
            onUpdateReport={setReport}
          />
        )}
      </div>

      {/* Modals */}
      {showPageConfig && selectedPage && (
        <PageConfiguration
          page={selectedPage}
          onUpdate={(updates) => updatePage(selectedPage.id, updates)}
          onClose={() => setShowPageConfig(false)}
        />
      )}

      {showElementSelector && selectedPageId && (
        <ElementSelector
          onSelect={(element) => {
            addElementToPage(selectedPageId, element);
            setShowElementSelector(false);
          }}
          onClose={() => setShowElementSelector(false)}
        />
      )}
    </div>
  );
};