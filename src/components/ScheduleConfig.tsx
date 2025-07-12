import React, { useState } from 'react';
import { Calendar, Mail, Server, Clock, Users, Settings } from 'lucide-react';
import { Report } from '../types/reporting';

interface ScheduleConfigProps {
  report: Report;
  onUpdateReport: (report: Report) => void;
}

export const ScheduleConfig: React.FC<ScheduleConfigProps> = ({
  report,
  onUpdateReport
}) => {
  const [schedule, setSchedule] = useState(report.schedule || {
    enabled: false,
    frequency: 'monthly',
    time: '09:00',
    recipients: [],
    ftpConfig: {
      host: '',
      username: '',
      password: '',
      path: '/reports'
    }
  });

  const [newRecipient, setNewRecipient] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'ftp'>('email');

  const updateSchedule = (updates: any) => {
    const newSchedule = { ...schedule, ...updates };
    setSchedule(newSchedule);
    onUpdateReport({ ...report, schedule: newSchedule });
  };

  const addRecipient = () => {
    if (newRecipient.trim() && !schedule.recipients.includes(newRecipient.trim())) {
      updateSchedule({
        recipients: [...schedule.recipients, newRecipient.trim()]
      });
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    updateSchedule({
      recipients: schedule.recipients.filter(r => r !== email)
    });
  };

  return (
    <div className="space-y-6">
      {/* Schedule Toggle */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Planification automatique</h2>
        </div>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={(e) => updateSchedule({ enabled: e.target.checked })}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-lg font-medium text-gray-900">
            Activer la génération et l'envoi automatique
          </span>
        </label>

        {schedule.enabled && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Le rapport sera généré automatiquement selon la fréquence définie et envoyé 
              aux destinataires configurés.
            </p>
          </div>
        )}
      </div>

      {schedule.enabled && (
        <>
          {/* Schedule Configuration */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fréquence et horaire</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence
                </label>
                <select
                  value={schedule.frequency}
                  onChange={(e) => updateSchedule({ frequency: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure d'envoi
                </label>
                <input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => updateSchedule({ time: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Aperçu de la planification :</h4>
              <p className="text-sm text-gray-600">
                {schedule.frequency === 'daily' && 'Le rapport sera généré tous les jours'}
                {schedule.frequency === 'weekly' && 'Le rapport sera généré chaque lundi'}
                {schedule.frequency === 'monthly' && 'Le rapport sera généré le 1er de chaque mois'}
                {' '}à {schedule.time} et envoyé aux destinataires configurés.
              </p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Méthode de livraison</h3>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="email"
                    checked={deliveryMethod === 'email'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'email')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Email</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="ftp"
                    checked={deliveryMethod === 'ftp'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'ftp')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Server className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">FTP</span>
                </label>
              </div>
            </div>
          </div>

          {/* Email Configuration */}
          {deliveryMethod === 'email' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Destinataires email</h3>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    placeholder="email@exemple.com"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addRecipient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>

                {schedule.recipients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Destinataires configurés :</h4>
                    {schedule.recipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-700">{email}</span>
                        <button
                          onClick={() => removeRecipient(email)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FTP Configuration */}
          {deliveryMethod === 'ftp' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Server className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Configuration FTP</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serveur FTP
                  </label>
                  <input
                    type="text"
                    value={schedule.ftpConfig?.host || ''}
                    onChange={(e) => updateSchedule({
                      ftpConfig: { ...schedule.ftpConfig!, host: e.target.value }
                    })}
                    placeholder="ftp.exemple.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={schedule.ftpConfig?.username || ''}
                    onChange={(e) => updateSchedule({
                      ftpConfig: { ...schedule.ftpConfig!, username: e.target.value }
                    })}
                    placeholder="utilisateur"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={schedule.ftpConfig?.password || ''}
                    onChange={(e) => updateSchedule({
                      ftpConfig: { ...schedule.ftpConfig!, password: e.target.value }
                    })}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chemin de destination
                  </label>
                  <input
                    type="text"
                    value={schedule.ftpConfig?.path || ''}
                    onChange={(e) => updateSchedule({
                      ftpConfig: { ...schedule.ftpConfig!, path: e.target.value }
                    })}
                    placeholder="/reports"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Résumé de la planification</h3>
            <div className="space-y-2 text-sm text-green-800">
              <p>• Fréquence: {schedule.frequency === 'daily' ? 'Quotidien' : schedule.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}</p>
              <p>• Heure: {schedule.time}</p>
              <p>• Méthode: {deliveryMethod === 'email' ? 'Email' : 'FTP'}</p>
              {deliveryMethod === 'email' && (
                <p>• Destinataires: {schedule.recipients.length} configuré(s)</p>
              )}
              {deliveryMethod === 'ftp' && schedule.ftpConfig?.host && (
                <p>• Serveur FTP: {schedule.ftpConfig.host}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};