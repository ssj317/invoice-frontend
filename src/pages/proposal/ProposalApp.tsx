import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

import { Download, Mail, ArrowLeft, Home, Save } from 'lucide-react';
import { documentService, DocumentType } from '../../services/documentService';

// Import proposal templates
import {
	Proposal as ServiceProposal,
	ProposalPreview as ServiceProposalPreview,
} from '../proposal-templates/service-proposal';
import {
	Agreement as ServiceAgreement,
	AgreementPreview as ServiceAgreementPreview,
} from '../proposal-templates/service-agreement';
import { TaxInvoice, TaxInvoicePreview } from '../proposal-templates/tax-invoice';

const ProposalApp = () => {
	const { templateType } = useParams<{ templateType: string }>();
	const navigate = useNavigate();
	const currentStep = useAppSelector((state) => state.invoice.currentStep);
	const invoiceState = useAppSelector((state) => state.invoice);

	const [activeStep, setActiveStep] = useState(currentStep || 1);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [savedDocId, setSavedDocId] = useState<string | null>(null);
	const [saveMsg, setSaveMsg] = useState('');

	// Email modal state
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [emailTo, setEmailTo] = useState('');
	const [emailSubject, setEmailSubject] = useState('');
	const [emailMessage, setEmailMessage] = useState('');
	const [isSendingEmail, setIsSendingEmail] = useState(false);
	const [emailMsg, setEmailMsg] = useState('');

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
		const handleSwitchToPreview = () => setActiveStep(2);
		window.addEventListener('switchToPreview', handleSwitchToPreview);
		return () => window.removeEventListener('switchToPreview', handleSwitchToPreview);
	}, []);

	const getDocumentData = () => {
		switch (templateType) {
			case 'service-proposal':
				return invoiceState.proposalData;
			case 'service-agreement':
				return invoiceState.agreementData;
			case 'tax-invoice':
				return invoiceState.taxInvoiceData;
			default:
				return null;
		}
	};

	const handleSaveToBackend = async () => {
		const data = getDocumentData();
		if (!data) {
			setSaveMsg('Please fill in the form first.');
			return;
		}
		setIsSaving(true);
		setSaveMsg('');
		try {
			if (savedDocId) {
				await documentService.update(savedDocId, data);
				setSaveMsg('Document updated successfully.');
			} else {
				const res = await documentService.save(templateType as DocumentType, data, templateType);
				setSavedDocId(res.data.document._id);
				setSaveMsg('Document saved successfully.');
			}
		} catch (err: any) {
			setSaveMsg(err?.response?.data?.message || 'Failed to save document.');
		} finally {
			setIsSaving(false);
			setTimeout(() => setSaveMsg(''), 3000);
		}
	};

	const getPdfBase64 = async (): Promise<string | null> => {
		const element = previewRef.current;
		if (!element) return null;
		try {
			if (templateType === 'tax-invoice') {
				const html2canvas = (await import('html2canvas')).default;
				const jsPDF = (await import('jspdf')).default;
				const pageContainer = element.querySelector('.page-container') as HTMLElement;
				if (!pageContainer) return null;
				const canvas = await html2canvas(pageContainer, {
					scale: 2,
					useCORS: true,
					logging: false,
					width: 794,
					height: 1123,
					windowWidth: 794,
					windowHeight: 1123,
					backgroundColor: '#ffffff',
				});
				const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
				pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297);
				return pdf.output('datauristring').split(',')[1];
			} else {
				const html2pdf = (await import('html2pdf.js')).default;
				const pages = element.querySelectorAll('.page-container');
				if (pages.length === 0) return null;
				const tempContainer = document.createElement('div');
				tempContainer.style.cssText = 'width:210mm;height:594mm;lineHeight:0;fontSize:0;overflow:hidden';
				for (let i = 0; i < Math.min(pages.length, 2); i++) {
					tempContainer.appendChild(pages[i].cloneNode(true));
				}
				const blob: Blob = await html2pdf()
					.set({
						margin: 0,
						image: { type: 'jpeg', quality: 1 },
						html2canvas: { scale: 2, useCORS: true, logging: false, height: 2245, windowHeight: 2245 },
						jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
					})
					.from(tempContainer)
					.outputPdf('blob');
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
					reader.readAsDataURL(blob);
				});
			}
		} catch {
			return null;
		}
	};

	const handleDownloadPDF = async () => {
		setIsDownloading(true);
		try {
			const element = previewRef.current;
			if (!element) return;

			if (templateType === 'tax-invoice') {
				const html2canvas = (await import('html2canvas')).default;
				const jsPDF = (await import('jspdf')).default;
				const pageContainer = element.querySelector('.page-container') as HTMLElement;
				if (!pageContainer) return;
				const canvas = await html2canvas(pageContainer, {
					scale: 2,
					useCORS: true,
					logging: false,
					width: 794,
					height: 1123,
					windowWidth: 794,
					windowHeight: 1123,
					backgroundColor: '#ffffff',
				});
				const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
				pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297);
				pdf.save('Tax-Invoice.pdf');
			} else {
				const html2pdf = (await import('html2pdf.js')).default;
				const pages = element.querySelectorAll('.page-container');
				if (pages.length === 0) return;
				const tempContainer = document.createElement('div');
				tempContainer.style.cssText = 'width:210mm;height:594mm;lineHeight:0;fontSize:0;overflow:hidden';
				for (let i = 0; i < Math.min(pages.length, 2); i++) {
					tempContainer.appendChild(pages[i].cloneNode(true));
				}
				await html2pdf()
					.set({
						margin: 0,
						image: { type: 'jpeg' as const, quality: 1 },
						html2canvas: {
							scale: 2,
							useCORS: true,
							logging: false,
							letterRendering: true,
							allowTaint: true,
							height: 2245,
							windowHeight: 2245,
						},
						jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
					})
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

	const handleSendEmail = async () => {
		if (!emailTo) {
			setEmailMsg('Please enter recipient email.');
			return;
		}
		if (!savedDocId) {
			setEmailMsg('Please save the document first before emailing.');
			return;
		}

		setIsSendingEmail(true);
		setEmailMsg('');
		try {
			const pdfBase64 = await getPdfBase64();
			const fileName = `${templateType}.pdf`;
			await documentService.sendEmail(savedDocId, {
				to: emailTo,
				subject: emailSubject || `${templateType} from Elite8 Digital`,
				message: emailMessage,
				pdfBase64: pdfBase64 || undefined,
				fileName,
			});
			setEmailMsg('Email sent successfully!');
			setTimeout(() => {
				setShowEmailModal(false);
				setEmailMsg('');
			}, 2000);
		} catch (err: any) {
			setEmailMsg(err?.response?.data?.message || 'Failed to send email.');
		} finally {
			setIsSendingEmail(false);
		}
	};

	const renderTemplate = () => {
		if (activeStep === 2) {
			switch (templateType) {
				case 'service-proposal':
					return (
						<div ref={previewRef}>
							<ServiceProposalPreview />
						</div>
					);
				case 'service-agreement':
					return (
						<div ref={previewRef}>
							<ServiceAgreementPreview />
						</div>
					);
				case 'tax-invoice':
					return (
						<div ref={previewRef}>
							<TaxInvoicePreview />
						</div>
					);
				default:
					return <div>Template not found</div>;
			}
		} else {
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

	const docTitle =
		templateType === 'service-proposal'
			? 'Service Proposal'
			: templateType === 'service-agreement'
				? 'Service Agreement'
				: 'Tax Invoice';

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
					<h1 className="text-2xl font-bold text-gray-900">{docTitle}</h1>
					<div className="flex gap-3 items-center flex-wrap">
						<button
							onClick={() => setActiveStep(1)}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeStep === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
						>
							Edit
						</button>
						<button
							onClick={() => setActiveStep(2)}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeStep === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
						>
							Preview
						</button>

						{/* Save to backend */}
						<button
							onClick={handleSaveToBackend}
							disabled={isSaving}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							<Save size={16} />
							{isSaving ? 'Saving...' : savedDocId ? 'Update' : 'Save'}
						</button>

						{activeStep === 2 && (
							<>
								<button
									onClick={handleDownloadPDF}
									disabled={isDownloading}
									className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									<Download size={16} />
									{isDownloading ? 'Downloading...' : 'Download PDF'}
								</button>

								<button
									onClick={() => setShowEmailModal(true)}
									className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
								>
									<Mail size={16} />
									Email
								</button>
							</>
						)}
					</div>
				</div>
				{saveMsg && (
					<div
						className={`max-w-7xl mx-auto mt-2 text-sm font-medium ${saveMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}
					>
						{saveMsg}
					</div>
				)}
			</div>

			{/* Content */}
			{renderTemplate()}

			{/* Email Modal */}
			{showEmailModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Send {docTitle} via Email</h2>

						{!savedDocId && (
							<div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-700 text-sm">
								⚠️ Save the document first to attach the PDF in the email.
							</div>
						)}

						<div className="space-y-3">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
								<input
									type="email"
									value={emailTo}
									onChange={(e) => setEmailTo(e.target.value)}
									placeholder="recipient@example.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
								<input
									type="text"
									value={emailSubject}
									onChange={(e) => setEmailSubject(e.target.value)}
									placeholder={`${docTitle} from Elite8 Digital`}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
								<textarea
									value={emailMessage}
									onChange={(e) => setEmailMessage(e.target.value)}
									rows={3}
									placeholder="Please find the attached document..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
								/>
							</div>
						</div>

						{emailMsg && (
							<p
								className={`mt-3 text-sm font-medium ${emailMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}
							>
								{emailMsg}
							</p>
						)}

						<div className="flex gap-3 mt-5">
							<button
								onClick={() => {
									setShowEmailModal(false);
									setEmailMsg('');
								}}
								className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
							>
								Cancel
							</button>
							<button
								onClick={handleSendEmail}
								disabled={isSendingEmail}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								<Mail size={16} />
								{isSendingEmail ? 'Sending...' : 'Send Email'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProposalApp;
