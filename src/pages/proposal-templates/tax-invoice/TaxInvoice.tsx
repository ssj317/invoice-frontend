import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { updateInvoiceData } from '../../../store/invoiceSlice';

const TaxInvoice = () => {
    const dispatch = useAppDispatch();

    // Form state based on the image
    const [formData, setFormData] = useState({
        // Company Details (Fixed Header)
        companyName: 'ELITE8 DIGITAL',
        companyTagline: 'FROM IMAGINATION TO INNOVATION - WE BUILD IT',
        companyCIN: 'U62099MP2025PTC076466',
        companyGST: '23AAICE8606R1Z3',
        companyPhone: '+91 6260894977',
        companyAddress: '2/5, MIG Sant Kabir Nagar Ujjain M.P - 456010',
        companyEmail: 'contact@elite8digital.in',
        companyWebsite: 'www.elite8digital.in',

        // Client Details (To Section)
        clientName: 'Vyahnavi Food Products',
        clientAddress: 'Konijarla Mandalam,\nGundarathi Madugu Village,\nNear Ayyappa Swamy Temple,\nKhammam - 507165',
        clientGST: 'GST: 36AADCV8622FTZ3',

        // Invoice Details
        date: '1 March 2026',
        ourRef: 'elite-8/2025',
        project: 'WEBSITE DESIGNING & DEVELOPMENT',

        // Items Table
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

        // Summary
        totalProjectAmount: '60,000',
        gstAmount: '10,800',
        totalAmount: '70,800',
        paymentPeriod: '6 months',
        monthlyPayment: '10,000 + 1,800 : 11,800',

        // Bank Details
        bankName: 'SBI',
        accountName: 'ELITE8 DIGITAL PRIVATE LIMITED',
        accountNumber: '44213821305',
        ifsc: 'SBIN0030288',
        upiId: 'Elite8digital@sbi'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedInputChange = (itemIndex: number, rateField: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === itemIndex ? { ...item, rate: { ...item.rate, [rateField]: value } } : item
            )
        }));
    };

    const handleSaveAndContinue = () => {
        dispatch(updateInvoiceData({ taxInvoiceData: formData }));
        const event = new Event('switchToPreview');
        window.dispatchEvent(event);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
                {/* Edit Mode Container */}
                <div className="p-10 border-4 border-blue-500">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">📄 TAX INVOICE - EDIT MODE</h2>

                    {/* Company Header Section */}
                    <div className="space-y-3 mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-bold text-lg text-blue-700 mb-3">Company Details (Header)</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.companyTagline}
                                    onChange={(e) => handleInputChange('companyTagline', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">CIN</label>
                                <input
                                    type="text"
                                    value={formData.companyCIN}
                                    onChange={(e) => handleInputChange('companyCIN', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">GST</label>
                                <input
                                    type="text"
                                    value={formData.companyGST}
                                    onChange={(e) => handleInputChange('companyGST', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Phone</label>
                                <input
                                    type="text"
                                    value={formData.companyPhone}
                                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Email</label>
                                <input
                                    type="text"
                                    value={formData.companyEmail}
                                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-600">Address</label>
                                <input
                                    type="text"
                                    value={formData.companyAddress}
                                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Website</label>
                                <input
                                    type="text"
                                    value={formData.companyWebsite}
                                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Client and Invoice Details */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* To Section */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-700">To (Client Details)</h3>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Client Name</label>
                                <input
                                    type="text"
                                    value={formData.clientName}
                                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Address</label>
                                <textarea
                                    value={formData.clientAddress}
                                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                                    rows={4}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">GST</label>
                                <input
                                    type="text"
                                    value={formData.clientGST}
                                    onChange={(e) => handleInputChange('clientGST', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-700">Invoice Details</h3>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Date</label>
                                <input
                                    type="text"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">OUR REF</label>
                                <input
                                    type="text"
                                    value={formData.ourRef}
                                    onChange={(e) => handleInputChange('ourRef', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Project</label>
                                <input
                                    type="text"
                                    value={formData.project}
                                    onChange={(e) => handleInputChange('project', e.target.value)}
                                    className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6">
                        <h3 className="font-bold text-blue-700 mb-3">Items</h3>
                        <table className="w-full border-2 border-gray-900">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border-2 border-gray-900 px-2 py-2 text-xs">Sr.</th>
                                    <th className="border-2 border-gray-900 px-2 py-2 text-xs">Description</th>
                                    <th className="border-2 border-gray-900 px-2 py-2 text-xs">Rate</th>
                                    <th className="border-2 border-gray-900 px-2 py-2 text-xs">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border-2 border-gray-900 p-2 text-center">{item.sr}</td>
                                        <td className="border-2 border-gray-900 p-2">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItems = [...formData.items];
                                                    newItems[index].description = e.target.value;
                                                    setFormData(prev => ({ ...prev, items: newItems }));
                                                }}
                                                className="w-full px-2 py-1 border border-blue-300 rounded"
                                            />
                                        </td>
                                        <td className="border-2 border-gray-900 p-2">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex gap-1">
                                                    <span className="w-20">Lumpsum*</span>
                                                    <input
                                                        type="text"
                                                        value={item.rate.lumpsum}
                                                        onChange={(e) => handleNestedInputChange(index, 'lumpsum', e.target.value)}
                                                        className="flex-1 px-1 py-0.5 border border-blue-300 rounded"
                                                    />
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className="w-20">Total Rs</span>
                                                    <input
                                                        type="text"
                                                        value={item.rate.totalRs}
                                                        onChange={(e) => handleNestedInputChange(index, 'totalRs', e.target.value)}
                                                        className="flex-1 px-1 py-0.5 border border-blue-300 rounded"
                                                    />
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className="w-20">Add 18% GST Extra</span>
                                                    <input
                                                        type="text"
                                                        value={item.rate.gst}
                                                        onChange={(e) => handleNestedInputChange(index, 'gst', e.target.value)}
                                                        className="flex-1 px-1 py-0.5 border border-blue-300 rounded"
                                                    />
                                                </div>
                                                <div className="flex gap-1 font-bold">
                                                    <span className="w-20">Total Amount</span>
                                                    <input
                                                        type="text"
                                                        value={item.rate.totalAmount}
                                                        onChange={(e) => handleNestedInputChange(index, 'totalAmount', e.target.value)}
                                                        className="flex-1 px-1 py-0.5 border border-blue-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-2 border-gray-900 p-2 text-right align-top">
                                            <input
                                                type="text"
                                                value={item.rate.totalAmount}
                                                onChange={(e) => handleNestedInputChange(index, 'totalAmount', e.target.value)}
                                                className="w-full px-2 py-1 border border-blue-300 rounded text-right"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="mb-6 space-y-2">
                        <h3 className="font-bold text-blue-700 mb-3">Payment Summary</h3>
                        <div className="flex gap-2">
                            <span className="w-64">Total Amount of Project:</span>
                            <input
                                type="text"
                                value={formData.totalProjectAmount}
                                onChange={(e) => handleInputChange('totalProjectAmount', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="w-64">18% GST:</span>
                            <input
                                type="text"
                                value={formData.gstAmount}
                                onChange={(e) => handleInputChange('gstAmount', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="w-64">Total Amount:</span>
                            <input
                                type="text"
                                value={formData.totalAmount}
                                onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="w-64">Divided in period of:</span>
                            <input
                                type="text"
                                value={formData.paymentPeriod}
                                onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="w-64">Per Month:</span>
                            <input
                                type="text"
                                value={formData.monthlyPayment}
                                onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-blue-700 mb-3">Bank Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex gap-2">
                                <span className="w-32">BANK NAME:</span>
                                <input
                                    type="text"
                                    value={formData.bankName}
                                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="w-32">IFSC:</span>
                                <input
                                    type="text"
                                    value={formData.ifsc}
                                    onChange={(e) => handleInputChange('ifsc', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                                />
                            </div>
                            <div className="col-span-2 flex gap-2">
                                <span className="w-32">ACCOUNT NAME:</span>
                                <input
                                    type="text"
                                    value={formData.accountName}
                                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="w-32">ACCOUNT NO:</span>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="w-32">UPI ID:</span>
                                <input
                                    type="text"
                                    value={formData.upiId}
                                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-blue-300 rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="p-6 bg-gray-100">
                    <button
                        onClick={handleSaveAndContinue}
                        className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg"
                    >
                        💾 Save & Switch to Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaxInvoice;
