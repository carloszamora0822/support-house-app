import { jsPDF } from 'jspdf';
import { PDF_CONSTANTS } from '@/constants/pdfConstants';
import type { DisclosureAuthorizationInput } from '../intake/schemas/disclosureSchema';

export const pdfService = {
  async generateDisclosurePDF(data: DisclosureAuthorizationInput): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    // Helper to add text with automatic line wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += (lines.length * fontSize * 0.5) + 5;
    };

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(PDF_CONSTANTS.ORGANIZATION_NAME, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(14);
    doc.text(PDF_CONSTANTS.FORM_TITLE, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Fax Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${data.fax_form_date}`, margin, yPosition);
    doc.text(`To: ${data.fax_to_office}`, pageWidth - margin - 60, yPosition);
    yPosition += 10;

    // Patient Information Section
    addText('PATIENT INFORMATION', 12, true);
    addText(`Name: ${data.fax_patient_name}`);
    addText(`Date of Birth: ${data.fax_patient_dob}`);
    addText(`Address: ${data.fax_patient_address}, ${data.fax_patient_city}, ${data.fax_patient_state} ${data.fax_patient_zip}`);
    addText(`Phone: ${data.fax_patient_phone}`);
    yPosition += 5;

    // Disclosure Purpose
    addText('AUTHORIZATION PURPOSE', 12, true);
    addText(PDF_CONSTANTS.DISCLOSURE_PURPOSE);
    yPosition += 5;

    // Disclosure Scope
    addText(PDF_CONSTANTS.DISCLOSURE_SCOPE, 10, true);
    PDF_CONSTANTS.DISCLOSURE_ITEMS.forEach(item => {
      addText(`• ${item}`);
    });
    yPosition += 5;

    // Medical Information
    addText('MEDICAL INFORMATION', 12, true);
    addText(`${PDF_CONSTANTS.DIAGNOSIS_LABEL}: ${data.office_patient_diagnosis}`);
    if (data.office_stage) {
      addText(`${PDF_CONSTANTS.STAGE_LABEL}: ${data.office_stage}`);
    }
    if (data.office_expected_treatments) {
      addText(`${PDF_CONSTANTS.EXPECTED_TREATMENTS_LABEL}: ${data.office_expected_treatments}`);
    }
    if (data.office_treatment_start_date) {
      addText(`${PDF_CONSTANTS.TREATMENT_START_LABEL}: ${data.office_treatment_start_date}`);
    }
    if (data.office_treatment_end_date) {
      addText(`${PDF_CONSTANTS.TREATMENT_END_LABEL}: ${data.office_treatment_end_date}`);
    }
    yPosition += 5;

    // Chemotherapy Details
    if (data.office_chemo_type && data.office_chemo_type.length > 0) {
      addText(PDF_CONSTANTS.CHEMO_TITLE, 11, true);
      addText(`${PDF_CONSTANTS.CHEMO_TYPE_LABEL}: ${data.office_chemo_type.join(', ')}`);
      if (data.office_chemo_frequency) {
        addText(`${PDF_CONSTANTS.CHEMO_FREQUENCY_LABEL}: ${data.office_chemo_frequency}`);
      }
      yPosition += 5;
    }

    // Radiation Details
    if (data.office_radiation_frequency) {
      addText(PDF_CONSTANTS.RADIATION_TITLE, 11, true);
      addText(`${PDF_CONSTANTS.RADIATION_FREQUENCY_LABEL}: ${data.office_radiation_frequency}`);
      yPosition += 5;
    }

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Rights and Limitations
    addText(PDF_CONSTANTS.RIGHTS_TITLE, 12, true);
    addText(PDF_CONSTANTS.RIGHTS_TEXT);
    addText(PDF_CONSTANTS.EXPIRATION_TEXT);
    addText(PDF_CONSTANTS.CONFIDENTIALITY_TEXT);
    yPosition += 10;

    // Signature Instructions
    addText(PDF_CONSTANTS.SIGNATURE_INSTRUCTIONS, 10, true);
    yPosition += 5;

    // Patient Signature Section
    addText('PATIENT/REPRESENTATIVE SIGNATURE', 11, true);
    doc.line(margin, yPosition, margin + 80, yPosition);
    yPosition += 5;
    addText(`${PDF_CONSTANTS.PATIENT_SIGNATURE_LABEL}: ${data.fax_patient_signature}`);
    addText(`${PDF_CONSTANTS.DATE_LABEL}: ${data.fax_patient_signature_date}`);
    addText(`Printed Name: ${data.fax_patient_printed_name}`);
    if (data.fax_rep_relationship) {
      addText(`${PDF_CONSTANTS.REPRESENTATIVE_RELATIONSHIP_LABEL}: ${data.fax_rep_relationship}`);
    }
    yPosition += 10;

    // Office Staff Signature Section
    addText(PDF_CONSTANTS.OFFICE_USE_TITLE, 11, true);
    doc.line(margin, yPosition, margin + 80, yPosition);
    yPosition += 5;
    addText(`${PDF_CONSTANTS.STAFF_SIGNATURE_LABEL}: ${data.office_staff_signature}`);
    addText(`${PDF_CONSTANTS.DATE_LABEL}: ${data.office_staff_signature_date}`);
    yPosition += 10;

    // Footer
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const footerLines = doc.splitTextToSize(PDF_CONSTANTS.FOOTER_TEXT, contentWidth);
    doc.text(footerLines, margin, 280);
    const contactLines = doc.splitTextToSize(PDF_CONSTANTS.CONTACT_INFO, contentWidth);
    doc.text(contactLines, margin, 285);

    return doc.output('blob');
  },

  downloadPDF(blob: Blob, patientName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Disclosure_Authorization_${patientName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
