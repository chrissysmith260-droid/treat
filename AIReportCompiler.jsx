import React, { useState, useEffect } from 'react';
import { theme } from './src/theme';
import { Download, Sparkles, Share } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import StripePaymentForm from './StripePaymentForm.jsx';
const AIReportCompiler = ({ symptoms, vitalsHistory, labs, appointments, medications, allergies, notes, isSubscribed, setIsSubscribed }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const iconOutline = { filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(-1px 1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px -1px 0 #000)' };

  const [report, setReport] = useState('');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageHeight = doc.internal.pageSize.height;
    const bottomMargin = 20;
    const lineHeight = 6;
    let cursorY = 40;
    let pageNumber = 1;

    // Helper to determine trend arrow
    const getTrendArrow = (currentValue, previousValue) => {
      if (previousValue === undefined || currentValue === '' || previousValue === '') {
        return ''; // No previous value or current/previous is empty
      }

      // Handle BP separately as it's a string "sys/dia"
      if (typeof currentValue === 'string' && currentValue.includes('/') && typeof previousValue === 'string' && previousValue.includes('/')) {
        const [currentSys] = currentValue.split('/').map(Number);
        const [previousSys] = previousValue.split('/').map(Number);
        if (currentSys > previousSys) return '↑';
        if (currentSys < previousSys) return '↓';
        return '—';
      }

      // For numerical values
      const currentNum = Number(currentValue);
      const previousNum = Number(previousValue);

      if (currentNum > previousNum) return '↑';
      if (currentNum < previousNum) return '↓';
      return '—';
    };

    const drawHeader = (num) => {
      // 0. Confidential Watermark
      doc.saveGraphicsState();
      doc.setTextColor(242); // Very light gray
      doc.setFontSize(50);
      doc.setFont("helvetica", "bold");
      doc.text("CONFIDENTIAL", 105, 150, { align: 'center', angle: 45 });
      doc.restoreGraphicsState();

      doc.setFillColor(theme.colors.leafGreen);
      doc.ellipse(margin + 4, 18, 3, 6, 'F'); 
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(theme.colors.leafGreen); // Changed to leaf green
      doc.text('treat', margin + 10, 21);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor('#777777');
      doc.text(`Generated: ${new Date().toLocaleDateString()} | Page ${num}`, 190, 21, { align: 'right' });
      
      doc.setDrawColor(theme.colors.primaryBlue);
      doc.setLineWidth(0.5);
      doc.line(margin, 28, 190, 28);

      // Footer: Confidential Notice
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor('#999999');
      doc.text(
        "CONFIDENTIAL: This document contains sensitive personal health information intended for healthcare professionals.",
        doc.internal.pageSize.width / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    };

    drawHeader(pageNumber);

    // Split the report into logical sections for better PDF rendering
    const sections = report.split('\n\n');

    sections.forEach(section => {
      const trimmed = section.trim();
      if (!trimmed) return;

      // Detect the Vitals section to render as a table
      if (trimmed.startsWith('VITALS TRACKING:')) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(theme.colors.leafGreen);
        doc.text("VITALS TRACKING", margin, cursorY);
        cursorY += 5;

        autoTable(doc, {
          startY: cursorY,
          head: [['Date/Time', 'BP', 'HR', 'Glucose', 'O2%']],
          body: vitalsHistory.map((v, index) => {
            const previousVitals = vitalsHistory[index + 1]; // Older entry
            const hrTrend = getTrendArrow(v.hr, previousVitals?.hr);
            const bpTrend = getTrendArrow(v.bp, previousVitals?.bp);
            const glucoseTrend = getTrendArrow(v.glucose, previousVitals?.glucose);
            const o2Trend = getTrendArrow(v.o2, previousVitals?.o2);

            return [v.timestamp, `${v.bp} ${bpTrend}`, `${v.hr} ${hrTrend}`, `${v.glucose} ${glucoseTrend}`, `${v.o2}% ${o2Trend}`];
          }),
          
          theme: 'striped',
          headStyles: { fillColor: [129, 199, 132] }, // theme.colors.leafGreen (#81C784)
          margin: { left: margin, right: margin },
          didDrawPage: (data) => {
            if (data.pageNumber > pageNumber) {
              pageNumber = data.pageNumber;
              drawHeader(pageNumber);
            }
          }
        });
        cursorY = doc.lastAutoTable.finalY + 15;
      } else {
        // Detect the Labs section
        if (trimmed.startsWith('LAB RESULTS:')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(theme.colors.leafGreen);
          doc.text("LAB RESULTS", margin, cursorY);
          cursorY += 5;

          autoTable(doc, {
            startY: cursorY,
            head: [['Lab Name', 'Result', 'Unit']],
            body: labs.map(l => [l.name, l.value, l.unit]),
            theme: 'striped',
            headStyles: { fillColor: [129, 199, 132] },
            margin: { left: margin, right: margin }
          });
          cursorY = doc.lastAutoTable.finalY + 15;
        } else {
          // Detect the Appointments section
          if (trimmed.startsWith('APPOINTMENT HISTORY:')) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(theme.colors.leafGreen);
            doc.text("APPOINTMENT HISTORY", margin, cursorY);
            cursorY += 5;

            autoTable(doc, {
              startY: cursorY,
              head: [['Date', 'Visit Type', 'Notes']],
              body: appointments.map(a => [a.date, a.type, a.notes]),
              theme: 'striped',
              headStyles: { fillColor: [129, 199, 132] },
              margin: { left: margin, right: margin }
            });
            cursorY = doc.lastAutoTable.finalY + 15;
          } else {
            // Detect the Medications section
            if (trimmed.startsWith('ACTIVE MEDICATIONS:')) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.setTextColor(theme.colors.leafGreen);
              doc.text("ACTIVE MEDICATIONS", margin, cursorY);
              cursorY += 5;

              autoTable(doc, {
                startY: cursorY,
                head: [['Medication', 'Dosage']],
                body: medications.map(m => [m.name, m.dosage]),
                theme: 'striped',
                headStyles: { fillColor: [129, 199, 132] },
                margin: { left: margin, right: margin }
              });
              cursorY = doc.lastAutoTable.finalY + 15;
            } else {
              // Detect the Allergies section
              if (trimmed.startsWith('KNOWN ALLERGIES:')) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(theme.colors.leafGreen);
                doc.text("KNOWN ALLERGIES", margin, cursorY);
                cursorY += 5;

                autoTable(doc, {
                  startY: cursorY,
                  head: [['Substance', 'Reaction', 'Severity']],
                  body: allergies.map(a => [a.substance, a.reaction, a.severity || 'Moderate']),
                  theme: 'striped',
                  headStyles: { fillColor: [129, 199, 132] },
                  margin: { left: margin, right: margin }
                });
                cursorY = doc.lastAutoTable.finalY + 15;
              } else {
                if (trimmed.startsWith('GENERAL NOTES:')) {
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(12);
                  doc.setTextColor(theme.colors.leafGreen);
                  doc.text("GENERAL MEDICAL NOTES", margin, cursorY);
                  cursorY += 5;

                  autoTable(doc, {
                    startY: cursorY,
                    head: [['Date', 'Note Contents']],
                    body: notes.map(n => [n.date, n.text]),
                    theme: 'striped',
                    headStyles: { fillColor: [129, 199, 132] },
                    margin: { left: margin, right: margin }
                  });
                  cursorY = doc.lastAutoTable.finalY + 15;
                } else {
        // Regular Text Section
        const isTitle = trimmed.includes('----------------') || trimmed.includes('MEDICAL HISTORY SUMMARY');
        doc.setFont("helvetica", isTitle ? "bold" : "normal");
        doc.setFontSize(isTitle ? 12 : 10);
        doc.setTextColor(theme.colors.textDark);

        const lines = doc.splitTextToSize(trimmed, 170);
        lines.forEach(line => {
          if (cursorY > pageHeight - bottomMargin) {
            doc.addPage();
            pageNumber++;
            drawHeader(pageNumber);
            cursorY = 40;
          }
          doc.text(line, margin, cursorY);
          cursorY += lineHeight;
        });
        cursorY += 5; // Extra spacing between paragraphs
        }
        }
        }
        }
        }
      }
    });
    return doc;
  };

  useEffect(() => {
    if (report) {
      const doc = generatePDF();
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Clean up the URL to prevent memory leaks
    }
  }, [report]);

  const exportToPDF = () => {
    const doc = generatePDF();
    doc.save(`Treat_Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const sharePDF = async () => {
    const doc = generatePDF();
    const blob = doc.output('blob');
    const fileName = `Treat_Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Treat Medical Report',
          text: 'Sharing my medical history summary generated by the treat app.',
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Sharing failed:', err);
          alert('Could not open the sharing dialog.');
        }
      }
    } else {
      alert('Native sharing is not supported on this browser or requires a secure (HTTPS) connection.');
    }
  };

  const generateReport = () => {
    if (!isSubscribed) {
      alert("Please subscribe to unlock AI Medical Report Compiler.");
      return;
    }
    setIsGenerating(true);
    setReport(''); // Clear previous report

    const promptContent = `
MEDICAL HISTORY SUMMARY (Generated by treat AI)
-----------------------------------------------
PATIENT REPORT PERIOD: ${new Date().toLocaleDateString()}

SYMPTOMS LOGGED:
${symptoms.length > 0 ? symptoms.map(s => `- ${s.name} (Mood: ${s.mood || 'Neutral'}, Severity: ${s.severity || 'Moderate'}, Type: ${s.type}) on ${s.date}: ${s.notes}`).join('\n') : "No symptoms logged."}

VITALS TRACKING:
${vitalsHistory.length > 0 ? vitalsHistory.map(v => `- ${v.timestamp}: BP ${v.bp || 'N/A'}, HR ${v.hr || 'N/A'}, Glucose ${v.glucose || 'N/A'}, O2 ${v.o2 || 'N/A'}%`).join('\n') : "No vitals logged."}

LAB RESULTS:
${labs.length > 0 ? labs.map(l => `- ${l.name}: ${l.value} ${l.unit}`).join('\n') : "No lab results imported."}

APPOINTMENT HISTORY:
${appointments && appointments.length > 0 ? appointments.map(a => `- ${a.date}: ${a.type} - ${a.notes}`).join('\n') : "No appointment history imported."}

ACTIVE MEDICATIONS:
${medications && medications.length > 0 ? medications.map(m => `- ${m.name} (Dosage: ${m.dosage})`).join('\n') : "No medications imported."}

KNOWN ALLERGIES:
${allergies && allergies.length > 0 ? allergies.map(a => `- ${a.substance}: ${a.reaction} (Severity: ${a.severity || 'Moderate'})`).join('\n') : "No allergies imported."}

GENERAL NOTES:
${notes && notes.length > 0 ? notes.map(n => `- [${n.date}]: ${n.text}`).join('\n') : "No additional notes logged."}

AI OBSERVATIONS:
The patient has logged ${symptoms.length} symptom events. 
Consistent tracking of vitals shows ${vitalsHistory.length} data points. 
${labs.length > 0 ? `This analysis incorporates ${labs.length} clinical lab results from imported history.` : ""}
${(appointments || []).length > 0 ? `Historical data includes ${(appointments || []).length} past medical encounters.` : ""}
${(medications || []).length > 0 ? `Current regimen consists of ${(medications || []).length} medications.` : ""}
${(allergies || []).length > 0 ? `Patient has ${(allergies || []).length} recorded allergies.` : ""}
This report is intended to facilitate clinical discussion with a healthcare provider.
      `;

    (async () => {
      try {
        const response = await fetch('/api/ai/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: promptContent
              }]
            }]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
        setReport(generatedText);

      } catch (error) {
        console.error("Error generating report:", error);
        setReport(`Failed to generate report: ${error.message}. Please ensure your GOOGLE_API_KEY is valid and try again.`);
      } finally {
        setIsGenerating(false);
      }
    })();
  };
  return (
    <div style={{ 
      background: '#CCE5FF', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${theme.colors.accentBlue}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <Sparkles color={theme.colors.accentBlue} />
        <h3 style={{ color: theme.colors.accentBlue, margin: 0 }}>AI Medical Report Compiler</h3>
        <a href="https://buy.stripe.com/3cI14o0yYghX9gmci11B600" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', display: 'flex' }}>
          <img src="/path-to-stripe-logo.svg" alt="Powered by Stripe" style={{ height: '20px' }} />
        </a>
      </div>
      
      {/* Subscription Status Toggle (Demo Only) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '1rem',
        padding: '8px',
        backgroundColor: '#B3D7FF',
        borderRadius: '8px', 
        fontSize: '0.8rem'
      }}>
        <input 
          type="checkbox" 
          id="subToggle"
          checked={isSubscribed}
          onChange={(e) => {
            const val = e.target.checked;
            setIsSubscribed(val);
            localStorage.setItem('treat_ai_unlocked', val);
            window.location.reload(); // Reload to reflect subscription status immediately
          }}
        />
        <label htmlFor="subToggle" style={{ color: theme.colors.textDark, cursor: 'pointer' }}>
          Active Subscription Status
        </label>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Get a professional summary of your logs for your next doctor's visit.
      </p>
      {!isSubscribed ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p style={{ marginBottom: '1.5rem', color: theme.colors.textDark }}>
            Subscribe to unlock the AI Medical Report Compiler.
          </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <a 
            href="https://buy.stripe.com/3cI14o0yYghX9gmci11B600"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'white', textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000', backgroundColor: theme.colors.leafGreen, padding: '12px 24px', borderRadius: '25px', display: 'inline-block', fontWeight: 'bold' }}
          >
            Subscribe $5/mo via Stripe
          </a>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: 0.7 }}>
            <span style={{ fontSize: '0.7rem' }}>Powered by</span>
            <a href="https://buy.stripe.com/3cI14o0yYghX9gmci11B600" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
              <img src="/path-to-stripe-logo.svg" alt="Stripe" style={{ height: '14px' }} />
            </a>
          </div>
        </div>
          <StripePaymentForm onSubscriptionSuccess={() => { setIsSubscribed(true); localStorage.setItem('treat_ai_unlocked', 'true'); }} />
        </div>
      ) : (
        <>
          <button 
            onClick={generateReport}
            disabled={isGenerating}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: theme.colors.accentBlue, color: 'white', textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000', cursor: 'pointer' }}
          >
            {isGenerating ? 'AI is analyzing your data...' : 'Generate Medical Report'}
          </button>

          {report && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: theme.colors.textDark, marginBottom: '10px', fontSize: '1rem' }}>PDF Preview</h4>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '10px', 
              overflow: 'hidden',
              height: '400px'
            }}>
              <iframe 
                src={pdfPreviewUrl} 
                title="PDF Preview" 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={sharePDF}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                backgroundColor: theme.colors.accentBlue, 
                color: 'white', 
                textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              <Share size={18} style={iconOutline} /> Share Report
            </button>
            <button 
              onClick={exportToPDF}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                backgroundColor: theme.colors.leafGreen, 
                color: 'white', 
                textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              <Download size={18} style={iconOutline} /> Export as PDF
            </button>
          </div>
          <pre style={{ padding: '15px', backgroundColor: '#B3D7FF', borderRadius: '10px', whiteSpace: 'pre-wrap', fontSize: '0.85rem', border: '1px solid #ddd' }}>
            {report}
          </pre>
        </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIReportCompiler;