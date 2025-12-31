import { X, Printer } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  documentName: string;
}

export function PDFPreviewModal({ isOpen, onClose, pdfUrl, documentName }: PDFPreviewModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    // Open PDF in new window and trigger print
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{documentName}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, '_blank')}
            >
              View in Browser
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* PDF Viewer - Use object tag instead of iframe to avoid CSP issues */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
            aria-label={documentName}
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-600 mb-4">
                Unable to display PDF preview in this browser.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Open in New Tab
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
