import { useAppSelector } from '../../../store';
import { useMemo } from 'react';

const TaxInvoicePreview = () => {
	const invoiceData = useAppSelector((state) => state.invoice);
	const formData = invoiceData.taxInvoiceData || {
		companyName: 'XORIN TECH',
		companyTagline: '.',
		companyCIN: 'U62099MP2025PTC076466',
		companyGST: '23AAICE8606R1Z3',
		companyPhone: '+91 7207280423',
		companyAddress: 'F.NO.B-G11, WESTERN PLAZA, H S DARGA, SHAIKPET, SHAIKPET',
		companyEmail: 'Contact@xorintech.com',
		companyWebsite: 'Www.xorintech.com',
		clientName: 'Vyshnavi Food Products',
		clientAddress: 'Konijarla Mandalam,\nGundarathi Madugu Village,\nNear Ayyappa Swamy Temple,\nKhammam - 507165',
		clientGST: 'GST: 36AAGCS6022FTZJ',
		date: '1 March 2026',
		ourRef: 'elite-8/2025',
		project: 'WEBSITE DESIGNING & DEVELOPMENT',
		items: [
			{
				sr: '1',
				description: 'Website Designing & Development',
				rate: {
					lumpsum: '10,000/-',
					totalRs: '10,000=00',
					gst: '1,800=00',
					totalAmount: '11,800=00',
				},
			},
		],
		summaryLabels: {
			totalProjectLabel: 'Total Amount of Project:',
			gstLabel: '18% GST:',
			totalAmountLabel: 'Total Amount:',
			paymentPeriodLabel: 'Divided in period of:',
			monthlyPaymentLabel: 'Per Month:',
		},
		totalProjectAmount: '60,000',
		gstAmount: '10,800',
		totalAmount: '70,800',
		paymentPeriod: '6 months',
		monthlyPayment: '10,000 + 1,800 : 11,800',
		bankName: 'SBI',
		accountName: 'ELITE8 DIGITAL PRIVATE LIMITED',
		accountNumber: '44213821305',
		ifsc: 'SBIN0030288',
		upiId: 'Elite8digital@sbi',
	};

	// Split items into pages if there are many items
	const itemsPerPage = 3; // Adjust based on page space
	const pages = useMemo(() => {
		const result = [];
		const items = formData.items || [];

		if (items.length <= itemsPerPage) {
			// Single page with all content
			result.push({
				items: items,
				showSummary: true,
				showBankDetails: true,
			});
		} else {
			// Multiple pages
			for (let i = 0; i < items.length; i += itemsPerPage) {
				const pageItems = items.slice(i, i + itemsPerPage);
				const isLastPage = i + itemsPerPage >= items.length;
				result.push({
					items: pageItems,
					showSummary: isLastPage,
					showBankDetails: isLastPage,
				});
			}
		}

		return result;
	}, [formData.items]);

	const Header = () => (
		<div>
			<div className="relative h-16">
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '60%',
						height: '24px',
						backgroundColor: '#06b6d4',
					}}
				></div>
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: '40%',
						height: '24px',
						backgroundColor: '#1e293b',
					}}
				></div>
				<div style={{ position: 'absolute', top: '4px', left: 0, width: '60%', height: '40px' }}>
					<svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
						<path d="M 0 0 Q 80 20 100 0 L 100 20 L 0 20 Z" fill="#06b6d4" />
					</svg>
				</div>
			</div>
			<div className="px-10 pb-4">
				<div className="flex justify-between items-start pb-1 border-b-4 border-gray-900">
					<div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <div style={{ width: '200px', flexShrink: 0 }}>
        <img src="/zorin.png" alt="Elite8 Digital" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
    </div>
    <h1 className="text-3xl font-bold text-gray-900" style={{ margin: 0, lineHeight: 1 }}>{formData.companyName}</h1>
</div>
					<div className="text-right text-xs border-l-4 border-gray-900 pl-6">
						{/* <p className="font-bold">CIN:- {formData.companyCIN}</p>
                        <p className="font-bold mb-3">GST:- {formData.companyGST}</p> */}
						<p>
							<b>Phone:</b> {formData.companyPhone}
						</p>
						<p>
							<b>ADD:</b> F.NO.B-G11, WESTERN PLAZA,
						</p>
						<p>H S DARGA, SHAIKPET</p>
						<p>
							<b>Email:</b> {formData.companyEmail}
						</p>
						<p>
							<b>Website:</b> {formData.companyWebsite}
						</p>
					</div>
				</div>
				{/* <div className="border-b-2 border-gray-900 mt-1"></div> */}
			</div>
		</div>
	);

	const Footer = () => (
		<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px' }}>
			<div style={{ position: 'absolute', bottom: '0px', left: 0, width: '60%', height: '40px' }}>
				<svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
					<path d="M 0 20 Q 80 0 100 20 L 100 0 L 0 0 Z" fill="#06b6d4" />
				</svg>
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '60%',
					height: '24px',
					backgroundColor: '#06b6d4',
				}}
			></div>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					width: '40%',
					height: '24px',
					backgroundColor: '#1e293b',
				}}
			></div>
		</div>
	);

	return (
		<div style={{ lineHeight: 0, fontSize: 0 }}>
			<style>{`
                @media print {
                    body { margin: 0; padding: 0; }
                    .page-container { 
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    .page-container:last-child { 
                        page-break-after: avoid;
                    }
                }
            `}</style>

			{pages.map((page, pageIndex) => (
				<div
					key={pageIndex}
					className="page-container"
					style={{
						width: '210mm',
						height: '297mm',
						position: 'relative',
						margin: '0 auto',
						backgroundColor: 'white',
						lineHeight: 'normal',
						fontSize: '14px',
						overflow: 'hidden',
						marginBottom: pageIndex < pages.length - 1 ? '20px' : '0',
					}}
				>
					<Header />

					{/* TAX INVOICE Title - Only on first page */}

					<Footer />
				</div>
			))}
		</div>
	);
};

export default TaxInvoicePreview;
