import { jsPDF } from 'jspdf';
import { PDF_CONSTANTS } from '@/constants/pdfConstants';
import type { DisclosureAuthorizationInput } from '../intake/schemas/disclosureSchema';

export const pdfService = {
  async generateDisclosurePDF(data: DisclosureAuthorizationInput): Promise<Blob> {
    // LETTER looks better for US forms
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 40; // Smaller margins for one-page fit
    const marginTop = 36;
    const marginBottom = 36;
    const contentWidth = pageWidth - marginX * 2;

    let y = marginTop;

    // ---------- helpers ----------
    const lineH = (fontSize: number) => Math.round(fontSize * 1.25);

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
    };

    const set = (size: number, style: 'normal' | 'bold' = 'normal') => {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(0);
    };

    const textBlock = (txt: string, fontSize: number, style: 'normal' | 'bold' = 'normal') => {
      set(fontSize, style);
      const lines = doc.splitTextToSize(txt, contentWidth);
      ensureSpace(lines.length * lineH(fontSize));
      doc.text(lines, marginX, y);
      y += lines.length * lineH(fontSize);
      return lines.length;
    };

    const sectionTitle = (txt: string) => {
      ensureSpace(24);
      set(11, 'bold');
      doc.text(txt, marginX, y);
      y += 16;
    };

    const row2 = (leftLabel: string, leftValue: string, rightLabel?: string, rightValue?: string) => {
      const fs = 9;
      const lh = lineH(fs);
      ensureSpace(lh + 6);

      set(fs, 'normal');
      doc.text(`${leftLabel} ${leftValue || ''}`, marginX, y);

      if (rightLabel) {
        const rightX = marginX + contentWidth * 0.58;
        doc.text(`${rightLabel} ${rightValue || ''}`, rightX, y);
      }

      y += lh;
    };

    const row4 = (
      a: { label: string; value: string },
      b: { label: string; value: string },
      c: { label: string; value: string },
      d: { label: string; value: string }
    ) => {
      const fs = 9;
      const lh = lineH(fs);
      ensureSpace(lh + 6);

      const cols = [0, 0.34, 0.58, 0.78].map(p => marginX + contentWidth * p);
      set(fs, 'normal');
      doc.text(`${a.label} ${a.value || ''}`, cols[0], y);
      doc.text(`${b.label} ${b.value || ''}`, cols[1], y);
      doc.text(`${c.label} ${c.value || ''}`, cols[2], y);
      doc.text(`${d.label} ${d.value || ''}`, cols[3], y);

      y += lh;
    };

    const checkboxRow = (label: string, items: string[], cols = 4) => {
      const fs = 8;
      const lh = lineH(fs);
      const box = 10;

      set(fs, 'normal');

      // label
      ensureSpace(lh + 10);
      doc.text(label, marginX, y);

      const startX = marginX + 60;
      const colW = (contentWidth - 60) / cols;

      let cx = startX;
      let cy = y;

      items.forEach((t, i) => {
        const col = i % cols;
        if (i !== 0 && col === 0) {
          cy += lh + 6;
          ensureSpace(lh + 10);
        }
        cx = startX + col * colW;

        doc.rect(cx, cy - box + 2, box, box);
        doc.text(t, cx + box + 6, cy);
      });

      y = cy + lh + 6;
    };

    const signatureLine = (label: string, lineWidth: number) => {
      const fs = 9;
      const lh = lineH(fs);
      ensureSpace(lh + 20);

      set(fs, 'bold');
      doc.text(label, marginX, y);

      const lineX1 = marginX;
      const lineX2 = marginX + lineWidth;
      doc.setDrawColor(0);
      doc.line(lineX1, y + 12, lineX2, y + 12);

      y += 22;
    };

    // ---------- HEADER ----------
    set(14, 'bold');
    doc.text(PDF_CONSTANTS.FORM_TITLE, pageWidth / 2, y, { align: 'center' });
    y += 16;

    set(9, 'normal');
    doc.text(PDF_CONSTANTS.ORGANIZATION_NAME, pageWidth / 2, y, { align: 'center' });
    y += 18;

    // ---------- DATE / FAX TO ----------
    row2('DATE:', data.fax_form_date || '');
    row2('FAX TO The Office Of:', data.fax_to_office || '');
    y += 6;

    // ---------- PURPOSE ----------
    textBlock(PDF_CONSTANTS.DISCLOSURE_PURPOSE, 8, 'normal');
    y += 6;

    // ---------- FAX RETURN ----------
    set(8, 'bold');
    doc.text(`${PDF_CONSTANTS.FAX_RETURN_TEXT} ${PDF_CONSTANTS.RETURN_EMAIL}`, marginX, y);
    y += lineH(8);
    set(8, 'normal');
    doc.text(PDF_CONSTANTS.THANK_YOU_TEXT, marginX, y);
    y += 12;

    // ---------- PATIENT INFORMATION ----------
    set(10, 'bold');
    doc.text('PATIENT INFORMATION', marginX, y);
    y += 12;
    
    set(8, 'normal');
    doc.text(`Patient Name: ${data.fax_patient_name || ''}`, marginX, y);
    doc.text(`D.O.B.: ${data.fax_patient_dob || ''}`, marginX + 240, y);
    y += 10;
    doc.text(`Address: ${data.fax_patient_address || ''}`, marginX, y);
    y += 10;
    doc.text(`City: ${data.fax_patient_city || ''}`, marginX, y);
    doc.text(`State: ${data.fax_patient_state || ''}`, marginX + 160, y);
    doc.text(`Zip: ${data.fax_patient_zip || ''}`, marginX + 230, y);
    doc.text(`Phone: ${data.fax_patient_phone || ''}`, marginX + 310, y);
    y += 12;

    // ---------- MEDICAL STAFF ONLY (compact box) ----------
    const boxX = marginX;
    const boxY = y;
    const boxW = contentWidth;

    // Title inside box
    set(9, 'bold');
    doc.text(PDF_CONSTANTS.MEDICAL_STAFF_ONLY, boxX + 8, boxY + 12);

    // content cursor inside box
    let by = boxY + 24;

    const inBoxText = (txt: string, fs = 8, style: 'normal' | 'bold' = 'normal') => {
      set(fs, style);
      const lines = doc.splitTextToSize(txt, boxW - 16);
      doc.text(lines, boxX + 8, by);
      by += lines.length * lineH(fs);
    };

    inBoxText(`${PDF_CONSTANTS.DIAGNOSIS_LABEL}: ${data.office_patient_diagnosis || '_______________'}`);
    inBoxText(`${PDF_CONSTANTS.STAGE_LABEL}: ${data.office_stage || '______'}`);
    inBoxText(`${PDF_CONSTANTS.EXPECTED_TREATMENTS_LABEL}: ${data.office_expected_treatments || '______'}`);
    inBoxText(`${PDF_CONSTANTS.TREATMENT_START_LABEL}: ${data.office_treatment_start_date || '__________'}`);
    inBoxText(`${PDF_CONSTANTS.TREATMENT_END_LABEL}: ${data.office_treatment_end_date || '__________'}`);
    by += 6;

    set(8, 'bold');
    doc.text(PDF_CONSTANTS.CHEMO_TITLE, boxX + 8, by);
    by += lineH(8) + 2;

    // chemo types - use checkboxRow helper
    const drawMiniChecks = (items: string[], startX: number, startY: number, gap = 90) => {
      const box = 10;
      set(8, 'normal');
      items.forEach((t, i) => {
        const x = startX + i * gap;
        doc.rect(x, startY - box + 2, box, box);
        doc.text(t, x + box + 6, startY);
      });
    };
    drawMiniChecks(['IV Chemo', 'Oral Chemo', 'Pump Bag'], boxX + 8, by, 100);
    by += lineH(8) + 6;

    // chemo frequency
    set(7, 'normal');
    doc.text(PDF_CONSTANTS.CHEMO_FREQUENCY_LABEL, boxX + 8, by);
    drawMiniChecks(['Daily', 'Weekly', 'Every ___ Week(s)', 'Monthly'], boxX + 90, by, 92);
    by += lineH(7) + 10;

    // radiation
    set(8, 'bold');
    doc.text(PDF_CONSTANTS.RADIATION_TITLE, boxX + 8, by);
    by += lineH(8) + 2;

    set(7, 'normal');
    doc.text('Frequency:', boxX + 8, by);
    drawMiniChecks(['Daily', 'Weekly', 'Every ___ Week(s)', 'Monthly'], boxX + 90, by, 92);
    by += lineH(7) + 10;

    // status
    set(7, 'normal');
    doc.text(PDF_CONSTANTS.STATUS_TITLE, boxX + 8, by);
    drawMiniChecks(
      [PDF_CONSTANTS.STATUS_NOT_IN_TREATMENT, PDF_CONSTANTS.STATUS_PENDING],
      boxX + 50,
      by,
      160
    );
    by += lineH(7) + 5;
    drawMiniChecks(
      [PDF_CONSTANTS.STATUS_TERMINAL, PDF_CONSTANTS.STATUS_ENDED],
      boxX + 50,
      by,
      160
    );
    by += lineH(7) + 10;

    // staff signature/date
    set(7, 'normal');
    doc.text(`${PDF_CONSTANTS.STAFF_SIG_LABEL}`, boxX + 8, by);
    doc.line(boxX + 100, by + 2, boxX + 280, by + 2);

    doc.text(`${PDF_CONSTANTS.DATE_LABEL}:`, boxX + 300, by);
    doc.line(boxX + 330, by + 2, boxX + boxW - 8, by + 2);

    by += 14;

    // draw the box AFTER computing height
    const boxH = by - boxY + 6;
    doc.rect(boxX, boxY, boxW, boxH);

    y = boxY + boxH + 12;

    // PATIENT CONSENT - compact
    set(9, 'bold');
    doc.text(PDF_CONSTANTS.PATIENT_CONSENT_TITLE, marginX, y);
    y += 10;

    // bullets wrapped
    set(7, 'normal');
    PDF_CONSTANTS.CONSENT_BULLETS.forEach(bullet => {
      const lines = doc.splitTextToSize(`• ${bullet}`, contentWidth);
      doc.text(lines, marginX, y);
      y += lines.length * lineH(7) + 1;
    });

    y += 8;

    // patient signature area - MORE vertical space for signature
    set(9, 'bold');
    doc.text(PDF_CONSTANTS.PATIENT_SIG_LABEL, marginX, y);
    y += 35; // More space for signature

    // signature line
    const sigLineY = y;
    doc.setDrawColor(0);
    doc.line(marginX, sigLineY, marginX + contentWidth * 0.65, sigLineY);

    // signature image - larger and centered vertically
    if (data.fax_patient_signature?.startsWith('data:image')) {
      try {
        const sigWidth = 220;
        const sigHeight = 40; // Taller signature
        const sigX = marginX + 15;
        const sigY = sigLineY - (sigHeight / 2) - 2; // Center on line
        doc.addImage(data.fax_patient_signature, 'PNG', sigX, sigY, sigWidth, sigHeight);
      } catch {
        // ignore
      }
    }

    // date line on same row
    set(8, 'normal');
    const dateX = marginX + contentWidth * 0.7;
    doc.text(`${PDF_CONSTANTS.DATE_LABEL}:`, dateX, sigLineY + 3);
    doc.line(dateX + 32, sigLineY, marginX + contentWidth, sigLineY);
    if (data.fax_patient_signature_date) {
      doc.text(data.fax_patient_signature_date, dateX + 38, sigLineY - 2);
    }

    y = sigLineY + 28;

    // printed name
    set(8, 'normal');
    doc.text(PDF_CONSTANTS.PRINTED_NAME_LABEL, marginX, y);
    doc.line(marginX + 65, y + 2, marginX + contentWidth * 0.5, y + 2);
    doc.text(data.fax_patient_printed_name || '', marginX + 70, y - 1);

    if (data.fax_rep_relationship) {
      const rx = marginX + contentWidth * 0.56;
      doc.text(PDF_CONSTANTS.RELATIONSHIP_LABEL, rx, y);
      doc.line(rx + 70, y + 2, marginX + contentWidth, y + 2);
      doc.text(data.fax_rep_relationship, rx + 75, y - 1);
    }

    y += 12;

    // digital signature audit
    set(6, 'normal');
    doc.setTextColor(90);
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    doc.text(
      `${PDF_CONSTANTS.DIGITAL_SIG_METHOD} ${data.fax_patient_printed_name || ''} | ${PDF_CONSTANTS.SIG_METHOD_DRAWN} | ${timestamp}`,
      marginX,
      y
    );

    // ---------- FOOTER (both pages) ----------
    const addFooter = () => {
      doc.setTextColor(0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        `Fax to: ${PDF_CONSTANTS.ORGANIZATION_NAME} @ ${PDF_CONSTANTS.FAX_NUMBER} | ${PDF_CONSTANTS.CONTACT_INFO}`,
        marginX,
        pageHeight - 28
      );
      doc.setFontSize(7);
      doc.text('Rev 07.30.19', pageWidth - marginX - 60, pageHeight - 14);
    };

    // apply footer to every page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter();
    }

    return doc.output('blob');
  },

  downloadPDF(blob: Blob, patientName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Disclosure_Authorization_${patientName.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
