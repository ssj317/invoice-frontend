import { useAppSelector } from '../../../store';

const TaxInvoicePreview = () => {
    const invoiceData = useAppSelector((state) => state.invoice);
    const formData = invoiceData.taxInvoiceData || {
        companyName: 'ELITE8 DIGITAL',
        companyTagline: 'FROM IMAGINATION TO INNOVATION - WE BUILD IT',
        companyCIN: 'U62099MP2025PTC076466',
        companyGST: '23AAICE8606R1Z3',
        companyPhone: '+91 6260894977',
        companyAddress: '2/5, MIG Sant Kabir Nagar\nUjjain M.P - 456010',
        companyEmail: 'contact@elite8digital.in',
        companyWebsite: 'www.elite8digital.in',
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
                    totalAmount: '11,800=00'
                }
            }
        ],
        totalProjectAmount: '60,000',
        gstAmount: '10,800',
        totalAmount: '70,800',
        paymentPeriod: '6 months',
        monthlyPayment: '10,000 + 1,800 : 11,800',
        bankName: 'SBI',
        accountName: 'ELITE8 DIGITAL PRIVATE LIMITED',
        accountNumber: '44213821305',
        ifsc: 'SBIN0030288',
        upiId: 'Elite8digital@sbi'
    };

    return (
        <div style={{ lineHeight: 0, fontSize: 0 }}>
            <style>{`
                @media print {
                    body { margin: 0; padding: 0; }
                    .page-container { 
                        page-break-after: avoid !important;
                        page-break-inside: avoid !important;
                        page-break-before: avoid !important;
                    }
                    * {
                        page-break-after: avoid !important;
                        page-break-inside: avoid !important;
                    }
                }
            `}</style>
            <div className="page-container" style={{ width: '210mm', height: '297mm', position: 'relative', margin: '0 auto', backgroundColor: 'white', lineHeight: 'normal', fontSize: '14px', overflow: 'hidden' }}>
                {/* Header with curved design */}
                <div>
                    <div className="relative h-16">
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '60%', height: '24px', backgroundColor: '#06b6d4' }}></div>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '24px', backgroundColor: '#1e293b' }}></div>
                        <div style={{ position: 'absolute', top: '4px', left: 0, width: '60%', height: '40px' }}>
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                                <path d="M 0 0 Q 80 20 100 0 L 100 20 L 0 20 Z" fill="#06b6d4" />
                            </svg>
                        </div>
                    </div>
                    <div className="px-10 pb-4">
                        <div className="flex justify-between items-start pb-4 border-b-4 border-gray-900">
                            <div className="flex items-center gap-6">
                                <div style={{ width: '120px', height: '100px' }}>
                                    <img src="/elite8digital-nav.png" alt="Elite8 Digital" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-center text-gray-900">{formData.companyName}</h1>
                                    <p className="text-xs text-gray-600 mt-2 uppercase">{formData.companyTagline}</p>
                                </div>
                            </div>
                            <div className="text-right text-xs border-l-4 border-gray-900 pl-6">
                                <p className="font-bold">CIN:- {formData.companyCIN}</p>
                                <p className="font-bold mb-3">GST:- {formData.companyGST}</p>
                                <p><b>Phone:</b> {formData.companyPhone}</p>
                                <p><b>ADD:</b> 2/5, MIG Sant Kabir Nagar</p>
                                <p>Ujjain M.P - 456010</p>
                                <p><b>Email:</b> {formData.companyEmail}</p>
                                <p><b>Website:</b> {formData.companyWebsite}</p>
                            </div>
                        </div>
                        <div className="border-b-2 border-gray-900 mt-1"></div>
                    </div>
                </div>

                {/* TAX INVOICE Title */}
                <div className="px-8 py-5">
                    <h2 className="text-[36px] font-black text-center text-gray-900 tracking-wide">TAX INVOICE</h2>
                </div>

                {/* To and Date Section */}
                <div className="px-8 mb-5">
                    <table className="w-full border-2 border-black">
                        <tbody>
                            <tr className="border-b-2 border-black">
                                <td className="border-r-2 border-black p-3 w-[15%] align-top"><div className="font-bold text-[13px]">To</div></td>
                                <td className="border-r-2 border-black p-3 w-[35%]">
                                    <div className="text-[11px] space-y-0.5 leading-[1.5]">
                                        <div className="font-bold text-[12px]">{formData.clientName}</div>
                                        <div className="whitespace-pre-line">{formData.clientAddress}</div>
                                        <div className="font-semibold">{formData.clientGST}</div>
                                    </div>
                                </td>
                                <td className="border-r-2 border-black p-3 w-[20%] align-top"><div className="font-bold text-[13px]">DATE</div></td>
                                <td className="p-3 w-[30%]"><div className="text-[12px]">{formData.date}</div></td>
                            </tr>
                            <tr>
                                <td className="border-r-2 border-black p-3 align-top"><div className="font-bold text-[13px]">Project</div></td>
                                <td className="border-r-2 border-black p-3"><div className="text-[12px] font-bold">{formData.project}</div></td>
                                <td className="border-r-2 border-black p-3 align-top"><div className="font-bold text-[13px]">OUR REF</div></td>
                                <td className="p-3"><div className="text-[12px]">{formData.ourRef}</div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Items Table */}
                <div className="px-8 mb-5">
                    <table className="w-full border-2 border-black">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="border-r-2 border-black p-2.5 text-[13px] font-bold text-center w-[8%]">Sr.</th>
                                <th className="border-r-2 border-black p-2.5 text-[13px] font-bold text-center w-[37%]">Description</th>
                                <th className="border-r-2 border-black p-2.5 text-[13px] font-bold text-center w-[35%]">Rate</th>
                                <th className="p-2.5 text-[13px] font-bold text-center w-[20%]">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item: { sr: string; description: string; rate: { lumpsum: string; totalRs: string; gst: string; totalAmount: string } }, index: number) => (
                                <tr key={index}>
                                    <td className="border-r-2 border-black p-3 text-center align-top"><div className="text-[12px] font-semibold">{item.sr}</div></td>
                                    <td className="border-r-2 border-black p-3 align-top"><div className="text-[12px]">{item.description}</div></td>
                                    <td className="border-r-2 border-black p-0">
                                        <table className="w-full h-full">
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    <td className="p-2 text-[11px] text-right pr-3">Lumpsum*</td>
                                                    <td className="p-2 text-[11px] font-semibold text-right pr-3 border-l border-black">{item.rate.lumpsum}</td>
                                                </tr>
                                                <tr className="border-b border-black">
                                                    <td className="p-2 text-[11px] text-right pr-3">Total, Rs</td>
                                                    <td className="p-2 text-[11px] font-semibold text-right pr-3 border-l border-black">{item.rate.totalRs}</td>
                                                </tr>
                                                <tr className="border-b border-black">
                                                    <td className="p-2 text-[11px] text-right pr-3">Add 18% GST Extra</td>
                                                    <td className="p-2 text-[11px] font-semibold text-right pr-3 border-l border-black">{item.rate.gst}</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2 text-[11px] font-bold text-right pr-3">Total Amount</td>
                                                    <td className="p-2 text-[11px] font-bold text-right pr-3 border-l border-black">{item.rate.totalAmount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="p-3 align-top">
                                        <div className="space-y-[26px] text-right text-[12px]">
                                            <div className="font-semibold">{item.rate.lumpsum}</div>
                                            <div className="font-semibold">{item.rate.totalRs}</div>
                                            <div className="font-semibold">{item.rate.gst}</div>
                                            <div className="font-bold">{item.rate.totalAmount}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="px-8 mb-5 text-[12px] leading-[1.7]">
                    <div>Total Amount of Project: {formData.totalProjectAmount}</div>
                    <div>18% GST: {formData.gstAmount}</div>
                    <div className="font-bold">Total Amount: {formData.totalAmount}</div>
                    <div>Divided in period of {formData.paymentPeriod}</div>
                    <div>Per Month {formData.monthlyPayment}</div>
                </div>

                {/* Bank Details */}
                <div className="px-8 mb-6 text-[12px] leading-[1.7]">
                    <div className="font-bold">BANK NAME: {formData.bankName}</div>
                    <div>ACCOUNT NAME: {formData.accountName}</div>
                    <div>ACCOUNT NO.: {formData.accountNumber}</div>
                    <div>IFSC: {formData.ifsc}</div>
                    <div>UPI ID: {formData.upiId}</div>
                </div>

                {/* Footer with curved design - Fixed at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px' }}>
                    <div style={{ position: 'absolute', bottom: '0px', left: 0, width: '60%', height: '40px' }}>
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                            <path d="M 0 20 Q 80 0 100 20 L 100 0 L 0 0 Z" fill="#06b6d4" />
                        </svg>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '60%', height: '24px', backgroundColor: '#06b6d4' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '24px', backgroundColor: '#1e293b' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TaxInvoicePreview;
