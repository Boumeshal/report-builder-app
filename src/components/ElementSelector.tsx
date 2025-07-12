import React, { useState } from 'react';
import { X, BarChart3, Gauge, Table, FileText, TrendingUp, PieChart, Activity } from 'lucide-react';
import { ReportElement } from '../types/reporting';

interface ElementSelectorProps {
  onSelect: (element: Omit<ReportElement, 'id'>) => void;
  onClose: () => void;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({
  onSelect,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<'chart' | 'widget' | 'table' | 'text'>('chart');
  const [elementConfig, setElementConfig] = useState({
    title: '',
    comment: 'RAS',
    position: { row: 0, col: 0 },
    size: { width: 100, height: 300 }
  });

  const elementTypes = [
    {
      type: 'chart' as const,
      icon: BarChart3,
      label: 'Graphique',
      description: 'Graphiques en ligne, barres, aires...',
      examples: ['Tendance température', 'Consommation énergétique', 'Données capteurs']
    },
    {
      type: 'widget' as const,
      icon: Gauge,
      label: 'Widget KPI',
      description: 'Indicateurs de performance',
      examples: ['Jauge température', 'Compteur énergie', 'Status système']
    },
    {
      type: 'table' as const,
      icon: Table,
      label: 'Tableau',
      description: 'Tableaux de données',
      examples: ['Alertes période', 'Logs système', 'Résumé données']
    },
    {
      type: 'text' as const,
      icon: FileText,
      label: 'Texte libre',
      description: 'Commentaires et notes',
      examples: ['Analyse', 'Observations', 'Recommandations']
    }
  ];

  const chartTypes = [
    { type: 'line', icon: TrendingUp, label: 'Ligne', color: 'bg-blue-100 text-blue-600' },
    { type: 'bar', icon: BarChart3, label: 'Barres', color: 'bg-green-100 text-green-600' },
    { type: 'pie', icon: PieChart, label: 'Secteurs', color: 'bg-purple-100 text-purple-600' },
    { type: 'area', icon: Activity, label: 'Aires', color: 'bg-orange-100 text-orange-600' }
  ];

  const widgetTypes = [
    { type: 'kpi', label: 'KPI Simple', description: 'Valeur avec tendance' },
    { type: 'gauge', label: 'Jauge', description: 'Indicateur circulaire' },
    { type: 'status', label: 'Status', description: 'État système' },
    { type: 'counter', label: 'Compteur', description: 'Valeur numérique' }
  ];

  const dataSources = [
    { id: 'temp_sensors', label: 'Capteurs de température', category: 'Environnement' },
    { id: 'energy_meters', label: 'Compteurs énergie', category: 'Énergie' },
    { id: 'pressure_sensors', label: 'Capteurs de pression', category: 'Environnement' },
    { id: 'flow_meters', label: 'Débitmètres', category: 'Fluides' },
    { id: 'vibration_sensors', label: 'Capteurs vibration', category: 'Mécanique' },
    { id: 'alerts_log', label: 'Journal des alertes', category: 'Système' }
  ];

  const handleCreate = () => {
    const element: Omit<ReportElement, 'id'> = {
      type: selectedType,
      title: elementConfig.title || getDefaultTitle(),
      comment: elementConfig.comment,
      position: elementConfig.position,
      size: elementConfig.size,
      data: getDefaultData(),
      config: getDefaultConfig()
    };

    onSelect(element);
  };

  const getDefaultTitle = () => {
    switch (selectedType) {
      case 'chart': return 'Graphique des données';
      case 'widget': return 'Indicateur KPI';
      case 'table': return 'Tableau des alertes';
      case 'text': return 'Commentaires';
      default: return 'Élément';
    }
  };

  const getDefaultData = () => {
    switch (selectedType) {
      case 'table':
        return {
          source: 'alerts_log',
          filters: { period: 'current' }
        };
      default:
        return {
          source: dataSources[0].id,
          period: 'current'
        };
    }
  };

  const getDefaultConfig = () => {
    switch (selectedType) {
      case 'chart':
        return {
          type: 'line',
          showLegend: true,
          showGrid: true,
          colors: ['#3B82F6', '#10B981', '#F59E0B']
        };
      case 'widget':
        return {
          type: 'kpi',
          unit: '°C',
          thresholds: { min: 0, max: 100, colors: ['#EF4444', '#F59E0B', '#10B981'] }
        };
      default:
        return {};
    }
  };

  const selectedElementType = elementTypes.find(t => t.type === selectedType)!;
  const Icon = selectedElementType.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Ajouter un élément au rapport
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Type Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Type d'élément</h3>
              <div className="space-y-2">
                {elementTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedType === type.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <TypeIcon className={`h-5 w-5 mt-0.5 ${
                          selectedType === type.type ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuration */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Configuration {selectedElementType.label}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'élément
                    </label>
                    <input
                      type="text"
                      value={elementConfig.title}
                      onChange={(e) => setElementConfig(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={getDefaultTitle()}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source de données
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {dataSources.map(source => (
                        <option key={source.id} value={source.id}>
                          {source.label} ({source.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type-specific configuration */}
                {selectedType === 'chart' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de graphique
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {chartTypes.map((chart) => {
                        const ChartIcon = chart.icon;
                        return (
                          <button
                            key={chart.type}
                            className={`p-3 rounded-lg border text-center hover:border-gray-400 transition-colors ${chart.color}`}
                          >
                            <ChartIcon className="h-6 w-6 mx-auto mb-1" />
                            <div className="text-sm font-medium">{chart.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedType === 'widget' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de widget
                    </label>
                    <div className="space-y-2">
                      {widgetTypes.map((widget) => (
                        <label key={widget.type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="widgetType"
                            value={widget.type}
                            className="text-blue-600 focus:ring-blue-500"
                            defaultChecked={widget.type === 'kpi'}
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{widget.label}</div>
                            <div className="text-sm text-gray-600">{widget.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {selectedType === 'table' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Table className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Tableau des alertes automatique</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Ce tableau affichera automatiquement toutes les alertes de la période sélectionnée 
                          avec leur niveau, timestamp, source et message.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire
                  </label>
                  <textarea
                    value={elementConfig.comment}
                    onChange={(e) => setElementConfig(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    placeholder="Commentaire sur cet élément (RAS par défaut)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Examples */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Exemples d'utilisation :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedElementType.examples.map((example, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter l'élément
          </button>
        </div>
      </div>
    </div>
  );
};