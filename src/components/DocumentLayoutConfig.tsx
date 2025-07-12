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
import { WordDocumentPreview } from './WordDocumentPreview';

interface DocumentLayoutConfigProps {
  report: Report;
  onUpdateReport: (report: Report) => void;
}

export const DocumentLayoutConfig: React.FC<DocumentLayoutConfigProps> = ({
  report,
  onUpdateReport
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'planning' | 'header' | 'footer' | 'content'>('general');

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
    'Calibri', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Segoe UI'
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
            {/* General Tab */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={report.name}
                    onChange={(e) => updateReport({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre du rapport"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous titre
                  </label>
                  <input
                    type="text"
                    value={report.description}
                    onChange={(e) => updateReport({ description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description du rapport"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du site"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Émetteur
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Émetteur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Complément"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output File name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="nom-du-fichier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Référence du document"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reference-output"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="reference-output" className="ml-2 text-sm text-gray-700">
                    Reference = Output file name
                  </label>
                </div>
              </div>
            )}

            {/* Planning Tab */}
            {activeSection === 'planning' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Planification automatique</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fréquence
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Quotidien</option>
                        <option>Hebdomadaire</option>
                        <option>Mensuel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heure d'envoi
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="09:00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinataires
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email1@exemple.com, email2@exemple.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Header Tab */}
            {activeSection === 'header' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration de l'en-tête</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable-header"
                        checked={report.pages[0]?.header?.enabled || false}
                        onChange={(e) => {
                          const updatedPages = report.pages.map(page => ({
                            ...page,
                            header: {
                              ...page.header,
                              enabled: e.target.checked,
                              content: page.header?.content || 'Rapport IoT - {date}',
                              height: page.header?.height || 2
                            }
                          }));
                          updateReport({ pages: updatedPages });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enable-header" className="ml-2 text-sm font-medium text-gray-700">
                        Activer l'en-tête
                      </label>
                    </div>

                    {report.pages[0]?.header?.enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contenu de l'en-tête
                          </label>
                          <input
                            type="text"
                            value={report.pages[0]?.header?.content || ''}
                            onChange={(e) => {
                              const updatedPages = report.pages.map(page => ({
                                ...page,
                                header: { ...page.header!, content: e.target.value }
                              }));
                              updateReport({ pages: updatedPages });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Titre du rapport - {date}"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Police
                          </label>
                          <select
                            value={settings.fonts.header.name}
                            onChange={(e) => updateDocumentSettings({
                              fonts: {
                                ...settings.fonts,
                                header: { ...settings.fonts.header, name: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fontOptions.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taille de police
                          </label>
                          <input
                            type="number"
                            min="8"
                            max="24"
                            value={settings.fonts.header.size}
                            onChange={(e) => updateDocumentSettings({
                              fonts: {
                                ...settings.fonts,
                                header: { ...settings.fonts.header, size: parseInt(e.target.value) }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Tab */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration du pied de page</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable-footer"
                        checked={report.pages[0]?.footer?.enabled || false}
                        onChange={(e) => {
                          const updatedPages = report.pages.map(page => ({
                            ...page,
                            footer: {
                              ...page.footer,
                              enabled: e.target.checked,
                              content: page.footer?.content || 'Confidentiel - Ne pas diffuser',
                              height: page.footer?.height || 1.5,
                              showPageNumber: page.footer?.showPageNumber || false
                            }
                          }));
                          updateReport({ pages: updatedPages });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enable-footer" className="ml-2 text-sm font-medium text-gray-700">
                        Activer le pied de page
                      </label>
                    </div>

                    {report.pages[0]?.footer?.enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contenu du pied de page
                          </label>
                          <input
                            type="text"
                            value={report.pages[0]?.footer?.content || ''}
                            onChange={(e) => {
                              const updatedPages = report.pages.map(page => ({
                                ...page,
                                footer: { ...page.footer!, content: e.target.value }
                              }));
                              updateReport({ pages: updatedPages });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confidentiel - Ne pas diffuser"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="show-page-number"
                            checked={report.pages[0]?.footer?.showPageNumber || false}
                            onChange={(e) => {
                              const updatedPages = report.pages.map(page => ({
                                ...page,
                                footer: { ...page.footer!, showPageNumber: e.target.checked }
                              }));
                              updateReport({ pages: updatedPages });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="show-page-number" className="ml-2 text-sm text-gray-700">
                            Afficher le numéro de page
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Police
                          </label>
                          <select
                            value={settings.fonts.footer.name}
                            onChange={(e) => updateDocumentSettings({
                              fonts: {
                                ...settings.fonts,
                                footer: { ...settings.fonts.footer, name: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fontOptions.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeSection === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration du contenu</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Police des titres
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={settings.fonts.title.name}
                          onChange={(e) => updateDocumentSettings({
                            fonts: {
                              ...settings.fonts,
                              title: { ...settings.fonts.title, name: e.target.value }
                            }
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {fontOptions.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="8"
                          max="24"
                          value={settings.fonts.title.size}
                          onChange={(e) => updateDocumentSettings({
                            fonts: {
                              ...settings.fonts,
                              title: { ...settings.fonts.title, size: parseInt(e.target.value) }
                            }
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Police du corps de texte
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={settings.fonts.body.name}
                          onChange={(e) => updateDocumentSettings({
                            fonts: {
                              ...settings.fonts,
                              body: { ...settings.fonts.body, name: e.target.value }
                            }
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {fontOptions.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="8"
                          max="24"
                          value={settings.fonts.body.size}
                          onChange={(e) => updateDocumentSettings({
                            fonts: {
                              ...settings.fonts,
                              body: { ...settings.fonts.body, size: parseInt(e.target.value) }
                            }
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marges (cm)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">Haut</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={settings.margins.top}
                            onChange={(e) => updateDocumentSettings({
                              margins: { ...settings.margins, top: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Bas</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={settings.margins.bottom}
                            onChange={(e) => updateDocumentSettings({
                              margins: { ...settings.margins, bottom: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Gauche</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={settings.margins.left}
                            onChange={(e) => updateDocumentSettings({
                              margins: { ...settings.margins, left: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Droite</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={settings.margins.right}
                            onChange={(e) => updateDocumentSettings({
                              margins: { ...settings.margins, right: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur principale
                      </label>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded border border-gray-300"
                          style={{ backgroundColor: settings.colors.primary }}
                        ></div>
                        <input
                          type="color"
                          value={settings.colors.primary}
                          onChange={(e) => updateDocumentSettings({
                            colors: { ...settings.colors, primary: e.target.value }
                          })}
                          className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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