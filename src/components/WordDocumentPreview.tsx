import React from 'react';
import { Report } from '../types/reporting';

type WordDocumentPreviewProps = {
  report: Report;
};

const WordDocumentPreview: React.FC<WordDocumentPreviewProps> = ({ report }) => {
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Aperçu du document Word</h2>
      <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
      <p className="mt-2 text-gray-700">{report.description}</p>

      {report.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="mt-6">
          <h4 className="text-md font-bold text-blue-700">{page.title || `Page ${pageIndex + 1}`}</h4>
          {page.elements?.map((element, elementIndex) => (
            <div
              key={elementIndex}
              className="mt-2 p-4 border border-dashed border-gray-400 rounded bg-gray-50"
            >
              <p className="font-semibold">{element.title}</p>
              <p className="text-sm italic text-gray-600">{element.comment}</p>
              <div className="h-24 mt-2 border border-gray-300 rounded bg-white flex items-center justify-center text-gray-400">
                Zone réservée pour le graphique ou tableau
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-8">
        <form method="POST" action="/api/download-word">
          <input type="hidden" name="report" value={JSON.stringify(report)} />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Télécharger en Word
          </button>
        </form>
      </div>
    </div>
  );
};

export default WordDocumentPreview;
