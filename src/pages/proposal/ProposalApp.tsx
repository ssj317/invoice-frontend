import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { Download, ArrowLeft, Home } from 'lucide-react';

// Import proposal templates
import { Proposal as ServiceProposal, ProposalPreview as ServiceProposalPreview } from '../proposal-templates/service-proposal';
import { Agreement as ServiceAgreement, AgreementPreview as ServiceAgreementPreview } from '../proposal-templates/service-agreement';
import { TaxInvoice, TaxInvoicePreview } from '../proposal-templates/tax-invoice';

const ProposalApp = () => {
    const { templateType } = useParams<{ templateType: string }>();
    const navigate = useNavigate();
    const currentStep = useAppSelector((state) => state.invoice.currentStep);
    const [activeStep, setActiveStep] = useState(currentStep || 1);
    const [isDownloading, setIsDownloading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleBack = () => {
        if (activeStep === 2) {
            setActiveStep(1);
        } else {
            navigate(-1);
        }
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    // Listen for save and preview event from child components
    React.useEffect(() => {
        const handleSwitchToPreview = () => {
            setActiveStep(2);
        };

        window.addEventListener('switchToPreview', handleSwitchToPreview);

        return () => {
            window.removeEventListener('switchToPreview', handleSwitchToPreview);
        };
    }, []);




    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const element = previewRef.current;
            if (!element) return;

            // Separate handling for tax-invoice - Direct canvas to PDF approach
            if (templateType === 'tax-invoice') {
                const html2canvas = (await import('html2canvas')).default;
                const jsPDF = (await import('jspdf')).default;

                // Get the single page container
                const pageContainer = element.querySelector('.page-container') as HTMLElement;
                if (!pageContainer) return;

                // Convert to canvas
                const canvas = await html2canvas(pageContainer, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: 794,
                    height: 1123,
                    windowWidth: 794,
                    windowHeight: 1123,
                    backgroundColor: '#ffffff'
                });

                // Create PDF with exact A4 size
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Convert canvas to image and add to PDF
                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

                // Save PDF
                pdf.save('Tax-Invoice.pdf');

            } else {
                // Original code for multi-page documents (service-proposal, service-agreement)
                const html2pdf = (await import('html2pdf.js')).default;
                const pages = element.querySelectorAll('.page-container');
                if (pages.length === 0) return;

                const tempContainer = document.createElement('div');
                tempContainer.style.width = '210mm';
                tempContainer.style.height = '594mm';
                tempContainer.style.lineHeight = '0';
                tempContainer.style.fontSize = '0';
                tempContainer.style.overflow = 'hidden';

                // Clone only first 2 pages
                for (let i = 0; i < Math.min(pages.length, 2); i++) {
                    const clonedPage = pages[i].cloneNode(true) as HTMLElement;
                    tempContainer.appendChild(clonedPage);
                }

                const opt = {
                    margin: 0,
                    image: { type: 'jpeg' as const, quality: 1 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        letterRendering: true,
                        allowTaint: true,
                        height: 2245,
                        windowHeight: 2245
                    },
                    jsPDF: {
                        unit: 'mm' as const,
                        format: 'a4' as const,
                        orientation: 'portrait' as const
                    }
                };

                await html2pdf()
                    .set(opt)
                    .from(tempContainer)
                    .save(`${templateType === 'service-proposal' ? 'Service-Proposal' : 'Service-Agreement'}.pdf`);
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Render the appropriate template based on the route
    const renderTemplate = () => {
        if (activeStep === 2) {
            // Preview mode - wrap in ref for PDF generation
            switch (templateType) {
                case 'service-proposal':
                    return <div ref={previewRef}><ServiceProposalPreview /></div>;
                case 'service-agreement':
                    return <div ref={previewRef}><ServiceAgreementPreview /></div>;
                case 'tax-invoice':
                    return <div ref={previewRef}><TaxInvoicePreview /></div>;
                default:
                    return <div>Template not found</div>;
            }
        } else {
            // Edit mode
            switch (templateType) {
                case 'service-proposal':
                    return <ServiceProposal />;
                case 'service-agreement':
                    return <ServiceAgreement />;
                case 'tax-invoice':
                    return <TaxInvoice />;
                default:
                    return <div>Template not found</div>;
            }
        }
    };

    return (
        <div>
            {/* Navigation Buttons */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 mt-3 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 hover:text-purple-600 hover:bg-white rounded-lg transition-colors border border-gray-300 hover:border-purple-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    <button
                        onClick={handleGoToDashboard}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {templateType === 'service-proposal' ? 'Service Proposal' : templateType === 'service-agreement' ? 'Service Agreement' : 'Tax Invoice'}
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveStep(1)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeStep === 1
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setActiveStep(2)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeStep === 2
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Preview
                        </button>
                        {activeStep === 2 && (
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                {isDownloading ? 'Downloading...' : 'Download PDF'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {renderTemplate()}
        </div>
    );
};

export default ProposalApp;
