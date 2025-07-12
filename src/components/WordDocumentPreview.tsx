import React from "react";

type WordDocumentPreviewProps = {
  title: string;
  content: string;
};

const WordDocumentPreview: React.FC<WordDocumentPreviewProps> = ({ title, content }) => {
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Document Preview</h2>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-gray-700">{content}</p>
    </div>
  );
};

export default WordDocumentPreview;
