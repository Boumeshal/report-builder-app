import React, { useState } from 'react';
import { X, FileText, AlignCenter, Hash } from 'lucide-react';
import { ReportPage } from '../types/reporting';

interface PageConfigurationProps {
  page: ReportPage;
  onUpdate: (updates: Partial<ReportPage>) => void;
  onClose: () => void;
}

export const PageConfiguration: React.FC<PageConfigurationProps> = ({
  page,
  onUpdate,
  onClose
}) => {
  const [config, setConfig] = useState(page);

  const handleSave = () => {
    onUpdate(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Configuration de la Page {page.pageNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Page Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orientation
              </label>
              <select
                value={config.orientation}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  orientation: e.target.value as 'portrait' | 'landscape' 
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Paysage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille de page
              </label>
              <select
                value={config.size}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  size: e.target.value as 'A4' | 'A3' | 'Letter' 
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disposition des éléments
              </label>
              <select
                value={config.layout}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  layout: e.target.value as '1x1' | '1x2' | '2x1' | '2x2' 
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1x1">1 élément (1x1)</option>
                <option value="1x2">2 éléments verticaux (1x2)</option>
                <option value="2x1">2 éléments horizontaux (2x1)</option>
                <option value="2x2">4 éléments (2x2)</option>
              </select>
            </div>
          </div>

          {/* Header Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlignCenter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">En-tête</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.header?.enabled || false}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    header: {
                      ...prev.header,
                      enabled: e.target.checked,
                      content: prev.header?.content || '',
                      height: prev.header?.height || 2
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Activer l'en-tête
                </span>
              </label>

              {config.header?.enabled && (
                <div className="space-y-3 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu de l'en-tête
                    </label>
                    <input
                      type="text"
                      value={config.header.content}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        header: { ...prev.header!, content: e.target.value }
                      }))}
                      placeholder="Titre du rapport - {date}"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Variables disponibles: {'{date}'}, {'{time}'}, {'{page}'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hauteur (cm)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={config.header.height}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        header: { ...prev.header!, height: parseFloat(e.target.value) }
                      }))}
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Hash className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Pied de page</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.footer?.enabled || false}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      enabled: e.target.checked,
                      content: prev.footer?.content || '',
                      height: prev.footer?.height || 1.5,
                      showPageNumber: prev.footer?.showPageNumber || false
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Activer le pied de page
                </span>
              </label>

              {config.footer?.enabled && (
                <div className="space-y-3 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu du pied de page
                    </label>
                    <input
                      type="text"
                      value={config.footer.content}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        footer: { ...prev.footer!, content: e.target.value }
                      }))}
                      placeholder="Confidentiel - Ne pas diffuser"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hauteur (cm)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="3"
                        step="0.5"
                        value={config.footer.height}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          footer: { ...prev.footer!, height: parseFloat(e.target.value) }
                        }))}
                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.footer.showPageNumber}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            footer: { ...prev.footer!, showPageNumber: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Numéro de page
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};