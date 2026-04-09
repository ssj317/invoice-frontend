import React, { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { updateInvoiceData } from '../../../store/invoiceSlice';
import { Plus, Trash2 } from 'lucide-react';

const Proposal = () => {
    const dispatch = useAppDispatch();

    // Form state
    const [formData, setFormData] = useState({
        date: 'September 2nd, 2025',
        clientName: 'Reclipse Photography & Films',
        subject: 'Quotation for Wedding Photography Website Design, Development & Maintenance',
        greeting: 'Dear Reclipse Photography & Films,',
        intro: 'Thank you for considering Elite8 Digital as your digital partner. Please find below the detailed quotation for your wedding photography website project including development and complimentary maintenance.',
        projectScopeTitle: 'Project Scope & Inclusions',
        projectScopeItems: [
            {
                service: 'Website Design & Integration',
                description: 'Fully responsive website (mobile, tablet, desktop)',
                cost: 'Included'
            },
            {
                service: 'Basic SEO Optimization',
                description: 'Meta tags, responsive layout, fast loading, mobile-first performance tuning',
                cost: 'Included'
            },
            {
                service: 'Testing & Deployment',
                description: 'QA, device compatibility, bug fixing, and final deployment',
                cost: 'Included'
            }
        ],
        websiteStructureTitle: 'Website Structure:',
        websiteStructure: [
            'Landing Page - Eye-catching hero section with best work showcase',
            'Home Page - Complete overview of services and portfolio highlights',
            'Films Page - Wedding videography portfolio and video samples',
            'Photography Page - Wedding photography portfolio organized by style',
            'Gallery Page - Comprehensive collection of your finest work',
            'Stories Page - Behind-the-scenes content and wedding stories',
            'Testimonials Page - Dedicated section for client reviews and feedback',
            'Contact Us Page - Professional contact form and business information'
        ],
        maintenanceTitle: 'Complimentary Maintenance Package (2 Months)',
        maintenanceSubtitle: 'Maintenance Services Included:',
        maintenanceServices: [
            'Bug Fixes - Resolution of any technical issues',
            'Content Updates - Gallery additions, text modifications, testimonials',
            'Performance Checks - Regular speed and functionality testing',
            'Mobile Responsiveness - Ensuring optimal mobile experience'
        ],
        maintenanceLimitation: 'Maintenance Limitations: New page additions not included in maintenance package',
        developmentCost: '₹45,000/-',
        gstNote: 'Note: 18% GST will be charged extra on the final invoice amount.',
        domainHostingTitle: 'Domain & Hosting (Can discuss on a call for more details):',
        domainHostingContent: 'We will provide assistance in setting up the domain and hosting, However, the cost must be borne by the client directly through the provider.',
        closingMessage: 'Please let us know if you have any queries or would like to proceed. We\'re excited to build something impactful and lasting for your business.',
        signature: 'Warm regards,\nElite8 Digital\n+91 62608 9497\ncontact@elite8digital.in\nwww.elite8digital.in'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayInputChange = (field: string, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
        }));
    };

    const handleTableInputChange = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            projectScopeItems: prev.projectScopeItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSaveAndContinue = () => {
        dispatch(updateInvoiceData({ proposalData: formData }));
        const event = new Event('switchToPreview');
        window.dispatchEvent(event);
    };

    const handleAddScopeItem = (insertAtIndex?: number) => {
        const newItem = {
            service: 'New Service',
            description: 'Service description',
            cost: 'Included'
        };

        setFormData(prev => {
            const items = [...prev.projectScopeItems];
            if (insertAtIndex !== undefined) {
                items.splice(insertAtIndex, 0, newItem);
            } else {
                items.push(newItem);
            }
            return { ...prev, projectScopeItems: items };
        });
    };

    const handleRemoveScopeItem = (index: number) => {
        if (formData.projectScopeItems.length > 1) {
            setFormData(prev => ({
                ...prev,
                projectScopeItems: prev.projectScopeItems.filter((_, i) => i !== index)
            }));
        }
    };

    const handleAddWebsiteStructure = (insertAtIndex?: number) => {
        const newItem = 'New Page - Description';

        setFormData(prev => {
            const items = [...prev.websiteStructure];
            if (insertAtIndex !== undefined) {
                items.splice(insertAtIndex, 0, newItem);
            } else {
                items.push(newItem);
            }
            return { ...prev, websiteStructure: items };
        });
    };

    const handleRemoveWebsiteStructure = (index: number) => {
        if (formData.websiteStructure.length > 1) {
            setFormData(prev => ({
                ...prev,
                websiteStructure: prev.websiteStructure.filter((_, i) => i !== index)
            }));
        }
    };

    const handleAddMaintenanceService = (insertAtIndex?: number) => {
        const newItem = 'New Service - Description';

        setFormData(prev => {
            const items = [...prev.maintenanceServices];
            if (insertAtIndex !== undefined) {
                items.splice(insertAtIndex, 0, newItem);
            } else {
                items.push(newItem);
            }
            return { ...prev, maintenanceServices: items };
        });
    };

    const handleRemoveMaintenanceService = (index: number) => {
        if (formData.maintenanceServices.length > 1) {
            setFormData(prev => ({
                ...prev,
                maintenanceServices: prev.maintenanceServices.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
                {/* Page 1 - Project Scope */}
                <div className="p-10 border-4 border-blue-500">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">📄 PAGE 1: PROJECT SCOPE - EDIT MODE</h2>

                    <div className="space-y-4 text-[13px]">
                        <div className="flex gap-2 items-start">
                            <span className="text-gray-800 whitespace-nowrap">Date:</span>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                        </div>

                        <div className="flex gap-2 items-start">
                            <span className="text-gray-800 whitespace-nowrap">Client Name:</span>
                            <input
                                type="text"
                                value={formData.clientName}
                                onChange={(e) => handleInputChange('clientName', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                        </div>

                        <div className="flex gap-2 items-start">
                            <span className="text-gray-800 whitespace-nowrap">Subject:</span>
                            <textarea
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                rows={2}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                        </div>

                        <div className="mt-4">
                            <input
                                type="text"
                                value={formData.greeting}
                                onChange={(e) => handleInputChange('greeting', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                        </div>

                        <div>
                            <textarea
                                value={formData.intro}
                                onChange={(e) => handleInputChange('intro', e.target.value)}
                                rows={3}
                                className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-6">
                            <span className="text-2xl">🎯</span>
                            <input
                                type="text"
                                value={formData.projectScopeTitle}
                                onChange={(e) => handleInputChange('projectScopeTitle', e.target.value)}
                                className="flex-1 px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50 font-bold"
                            />
                        </div>

                        {/* Project Scope Table */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Project Scope Items:</span>
                                <button
                                    type="button"
                                    onClick={() => handleAddScopeItem()}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    <Plus size={16} /> Add Item at End
                                </button>
                            </div>
                            <table className="w-full border-2 border-gray-900">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border-2 border-gray-900 px-2 py-2 text-center font-bold">Service</th>
                                        <th className="border-2 border-gray-900 px-2 py-2 text-center font-bold">Description</th>
                                        <th className="border-2 border-gray-900 px-2 py-2 text-center font-bold">Cost (INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.projectScopeItems.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {/* Insert button before each item */}
                                            <tr>
                                                <td colSpan={3} className="p-0 border-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddScopeItem(index)}
                                                        className="w-full py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors"
                                                    >
                                                        + Insert Item Here
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-gray-900 p-2 relative">
                                                    <input
                                                        type="text"
                                                        value={item.service}
                                                        onChange={(e) => handleTableInputChange(index, 'service', e.target.value)}
                                                        className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                                                    />
                                                    {formData.projectScopeItems.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveScopeItem(index)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                            title="Remove Item"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="border-2 border-gray-900 p-2">
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => handleTableInputChange(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                                                    />
                                                </td>
                                                <td className="border-2 border-gray-900 p-2">
                                                    <input
                                                        type="text"
                                                        value={item.cost}
                                                        onChange={(e) => handleTableInputChange(index, 'cost', e.target.value)}
                                                        className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                                                    />
                                                </td>
                                            </tr>
                                            {/* Insert button after last item */}
                                            {index === formData.projectScopeItems.length - 1 && (
                                                <tr>
                                                    <td colSpan={3} className="p-0 border-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddScopeItem(index + 1)}
                                                            className="w-full py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors"
                                                        >
                                                            + Insert Item Here
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Website Structure */}
                        <div className="mt-6">
                            <input
                                type="text"
                                value={formData.websiteStructureTitle}
                                onChange={(e) => handleInputChange('websiteStructureTitle', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50 font-bold mb-3"
                            />
                            <div className="flex justify-end mb-2">
                                <button
                                    type="button"
                                    onClick={() => handleAddWebsiteStructure()}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    <Plus size={16} /> Add Page at End
                                </button>
                            </div>
                            <div className="space-y-1">
                                {formData.websiteStructure.map((item, index) => (
                                    <div key={index}>
                                        {/* Insert button before each item */}
                                        <button
                                            type="button"
                                            onClick={() => handleAddWebsiteStructure(index)}
                                            className="w-full py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors rounded mb-1"
                                        >
                                            + Insert Page Here
                                        </button>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleArrayInputChange('websiteStructure', index, e.target.value)}
                                                className="flex-1 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 bg-blue-50"
                                            />
                                            {formData.websiteStructure.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveWebsiteStructure(index)}
                                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    title="Remove Page"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        {/* Insert button after last item */}
                                        {index === formData.websiteStructure.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleAddWebsiteStructure(index + 1)}
                                                className="w-full py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors rounded mt-1"
                                            >
                                                + Insert Page Here
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page 2 - Maintenance Package */}
                <div className="p-10 border-4 border-green-500 mt-8">
                    <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">📄 PAGE 2: MAINTENANCE PACKAGE - EDIT MODE</h2>

                    <div className="space-y-4 text-[13px]">
                        <div>
                            <input
                                type="text"
                                value={formData.maintenanceTitle}
                                onChange={(e) => handleInputChange('maintenanceTitle', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 text-xl font-bold"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                value={formData.maintenanceSubtitle}
                                onChange={(e) => handleInputChange('maintenanceSubtitle', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 font-bold"
                            />
                        </div>

                        <div className="flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={() => handleAddMaintenanceService()}
                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                                <Plus size={16} /> Add Service at End
                            </button>
                        </div>

                        <div className="space-y-1">
                            {formData.maintenanceServices.map((service, index) => (
                                <div key={index}>
                                    {/* Insert button before each item */}
                                    <button
                                        type="button"
                                        onClick={() => handleAddMaintenanceService(index)}
                                        className="w-full py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold transition-colors rounded mb-1"
                                    >
                                        + Insert Service Here
                                    </button>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg mt-1">✓</span>
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => handleArrayInputChange('maintenanceServices', index, e.target.value)}
                                            className="flex-1 px-2 py-1 border border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50"
                                        />
                                        {formData.maintenanceServices.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMaintenanceService(index)}
                                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                title="Remove Service"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {/* Insert button after last item */}
                                    {index === formData.maintenanceServices.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleAddMaintenanceService(index + 1)}
                                            className="w-full py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold transition-colors rounded mt-1"
                                        >
                                            + Insert Service Here
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={formData.maintenanceLimitation}
                                onChange={(e) => handleInputChange('maintenanceLimitation', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 font-bold"
                            />
                        </div>

                        <div className="my-6">
                            <div className="flex gap-2 items-center mb-2">
                                <span className="font-bold">Total Development Cost (One-Time):</span>
                                <input
                                    type="text"
                                    value={formData.developmentCost}
                                    onChange={(e) => handleInputChange('developmentCost', e.target.value)}
                                    className="px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 font-bold"
                                />
                            </div>
                            <input
                                type="text"
                                value={formData.gstNote}
                                onChange={(e) => handleInputChange('gstNote', e.target.value)}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 font-bold"
                            />
                        </div>

                        <div className="my-6">
                            <div className="flex gap-2 items-start mb-2">
                                <span className="font-bold">•</span>
                                <input
                                    type="text"
                                    value={formData.domainHostingTitle}
                                    onChange={(e) => handleInputChange('domainHostingTitle', e.target.value)}
                                    className="flex-1 px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50 font-bold"
                                />
                            </div>
                            <textarea
                                value={formData.domainHostingContent}
                                onChange={(e) => handleInputChange('domainHostingContent', e.target.value)}
                                rows={2}
                                className="w-full ml-4 px-2 py-1 border border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50"
                            />
                        </div>

                        <div className="mt-8">
                            <textarea
                                value={formData.closingMessage}
                                onChange={(e) => handleInputChange('closingMessage', e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50"
                            />
                        </div>

                        <div className="mt-6">
                            <textarea
                                value={formData.signature}
                                onChange={(e) => handleInputChange('signature', e.target.value)}
                                rows={5}
                                className="w-full px-2 py-1 border-2 border-green-300 rounded focus:ring-2 focus:ring-green-500 bg-green-50"
                            />
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

export default Proposal;
