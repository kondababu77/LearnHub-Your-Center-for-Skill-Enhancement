import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';

const Certificate = ({ 
  studentName, 
  courseName, 
  completedDate, 
  certificateId,
  instructorName,
  onClose 
}) => {
  const certificateRef = useRef(null);

  const downloadAsPDF = async () => {
    const certificate = certificateRef.current;
    
    try {
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LearnHub_Certificate_${courseName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadAsImage = async () => {
    const certificate = certificateRef.current;
    
    try {
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `LearnHub_Certificate_${courseName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="certificate-modal">
      {/* Fixed Header with Download Buttons */}
      <div className="certificate-actions">
        <button className="btn btn-primary me-2" onClick={downloadAsPDF}>
          <DownloadIcon fontSize="small" className="me-1" />
          Download PDF
        </button>
        <button className="btn btn-outline-light me-2" onClick={downloadAsImage}>
          <DownloadIcon fontSize="small" className="me-1" />
          Download Image
        </button>
        <button className="btn btn-outline-danger" onClick={onClose}>
          <CloseIcon fontSize="small" className="me-1" />
          Close
        </button>
      </div>

      {/* Scrollable Certificate Container */}
      <div className="certificate-container">
        {/* Certificate Design */}
        <div ref={certificateRef} className="certificate-paper">
          {/* Outer Border */}
          <div className="certificate-outer-border">
            {/* Inner Border */}
            <div className="certificate-inner-border">
              {/* Certificate Content */}
              <div className="certificate-content">
                {/* Header with Logo */}
                <div className="certificate-header">
                  <div className="certificate-logo">
                    <div className="logo-icon">
                      <svg viewBox="0 0 100 100" width="60" height="60">
                        <defs>
                          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#1e40af' }} />
                            <stop offset="100%" style={{ stopColor: '#2563eb' }} />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
                        <text x="50" y="60" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="serif">L</text>
                      </svg>
                    </div>
                    <span className="logo-text">LearnHub</span>
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="certificate-title">
                  <h1>Certificate of Completion</h1>
                  <div className="title-decoration">
                    <span className="decoration-line"></span>
                    <VerifiedIcon className="verified-icon" />
                    <span className="decoration-line"></span>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="certificate-body">
                  <p className="presented-to">This is to certify that</p>
                  
                  <h2 className="recipient-name">{studentName}</h2>
                  
                  <p className="completion-text">
                    has successfully completed the course
                  </p>
                  
                  <h3 className="course-name">{courseName}</h3>
                  
                  <p className="completion-date">
                    Completed on {formatDate(completedDate)}
                  </p>
                </div>

                {/* Signature Section */}
                <div className="certificate-footer">
                  <div className="signature-section">
                    <div className="signature-block">
                      <div className="signature-line"></div>
                      <p className="signature-title">{instructorName || 'Course Instructor'}</p>
                      <p className="signature-role">Instructor</p>
                    </div>
                    
                    <div className="seal-section">
                      <div className="certificate-seal">
                        <div className="seal-inner">
                          <span className="seal-text">VERIFIED</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="signature-block">
                      <div className="signature-line"></div>
                      <p className="signature-title">LearnHub</p>
                      <p className="signature-role">Platform Director</p>
                    </div>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="certificate-id">
                  <p>Certificate ID: {certificateId}</p>
                  <p className="verify-text">Verify at: learnhub.com/verify/{certificateId}</p>
                </div>

                {/* Corner Decorations */}
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
