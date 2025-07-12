import React from "react";
import { Report } from "../types/reporting";

type WordDocumentPreviewProps = {
  report: Report;
};

const WordDocumentPreview: React.FC<WordDocumentPreviewProps> = ({ report }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aperçu du document Word</h2>

      <div className="bg-white shadow border rounded-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{report.name || 'Titre du rapport'}</h3>
        <p className="text-gray-600">{report.description || 'Pas de description.'}</p>

        {report.pages && report.pages.length > 0 ? (
          report.pages.map((page, index) => (
            <div key={index} className="mt-6 border-t pt-4">
              <h4 className="text-md font-semibold text-blue-700">
                {page.title || `Page ${index + 1}`}
              </h4>
              {page.elements && page.elements.length > 0 ? (
                page.elements.map((el, i) => (
                  <div key={i} className="border border-dashed border-gray-400 rounded p-3 mt-2">
                    <p className="text-sm font-medium text-gray-700">{el.title || 'Élément sans titre'}</p>
                    <p className="text-xs text-gray-500 italic">{el.comment || 'Aucun commentaire fourni.'}</p>
                    <div className="mt-2 bg-gray-100 text-center text-gray-400 py-8 rounded">
                      [Zone réservée à l’élément de type : {el.type}]
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm italic text-gray-400">Aucun élément sur cette page.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">Aucune page définie.</p>
        )}
      </div>

      {/* Bouton de téléchargement Word */}
      <div className="mt-6">
        <button
          onClick={() => fetch("/api/download-word").then(res => res.blob()).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "rapport.docx";
            a.click();
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Télécharger en Word
        </button>
      </div>
    </div>
  );
};

export default WordDocumentPreview;
