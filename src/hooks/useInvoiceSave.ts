import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { saveAsDraft, completeInvoice, updateInvoiceData } from '@/store/invoiceSlice';
import { invoiceService } from '@/services/invoiceService';

interface UseInvoiceSaveProps {
  templateType: string;
  title: string;
  subtitle: string;
}

export const useInvoiceSave = ({ templateType, title, subtitle }: UseInvoiceSaveProps) => {
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.invoice);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveInvoice = async (status: 'draft' | 'completed') => {
    try {
      setSaving(true);
      setError(null);

      // Update title and subtitle in Redux
      dispatch(updateInvoiceData({
        title,
        subtitle,
      }));

      // Log the raw invoice data for debugging
      console.log('Raw invoiceData from Redux:', invoiceData);
      console.log('columnConfiguration type:', typeof invoiceData.columnConfiguration);
      console.log('columnConfiguration value:', invoiceData.columnConfiguration);

      // Prepare invoice data for backend - ensure proper serialization
      const invoicePayload = {
        templateType,
        title,
        subtitle,
        status,
        invoiceNo: invoiceData.invoiceNo,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        logo: invoiceData.logo,
        customFields: Array.isArray(invoiceData.customFields) ? invoiceData.customFields : [],
        businessDetails: invoiceData.businessDetails || {},
        selectedClient: invoiceData.selectedClient,
        clientDetails: invoiceData.clients?.find((c: any) => c.name === invoiceData.selectedClient) || {},
        items: Array.isArray(invoiceData.items) ? invoiceData.items : [],
        groups: Array.isArray(invoiceData.groups) ? invoiceData.groups : [],
        totals: invoiceData.totals || {},
        signature: invoiceData.signature || {},
        terms: Array.isArray(invoiceData.terms) ? invoiceData.terms : [],
        notes: invoiceData.notes || '',
        attachments: Array.isArray(invoiceData.attachments) ? invoiceData.attachments : [],
        contactDetails: invoiceData.contactDetails || {},
        additionalInfo: Array.isArray(invoiceData.additionalInfo) ? invoiceData.additionalInfo : [],
        advancedOptions: invoiceData.advancedOptions || {},
        columnConfiguration: Array.isArray(invoiceData.columnConfiguration) ? invoiceData.columnConfiguration : [],
        gstConfiguration: invoiceData.gstConfiguration || {},
        currency: invoiceData.currency || {},
        addShippingDetails: invoiceData.addShippingDetails || false,
        shippingDetails: invoiceData.shippingDetails || {},
        transportDetails: invoiceData.transportDetails || {}
      };

      console.log('Prepared payload:', invoicePayload);
      console.log('Payload columnConfiguration:', invoicePayload.columnConfiguration);

      // Save to backend
      // Reuse the saved record when the user saves a draft more than once.
      const response = invoiceData.savedInvoiceId
        ? await invoiceService.updateInvoice(invoiceData.savedInvoiceId, invoicePayload)
        : await invoiceService.createInvoice(invoicePayload);

      if (response.success) {
        // Update Redux state
        if (status === 'draft') {
          dispatch(saveAsDraft());
        } else {
          dispatch(completeInvoice());
        }
        // Store the saved invoice ID
        dispatch(updateInvoiceData({ savedInvoiceId: response.data.invoice?._id || null }));

        return {
          success: true,
          data: response.data,
          message: `Invoice ${status === 'draft' ? 'saved as draft' : 'completed'} successfully!`
        };
      }
    } catch (error: any) {
      console.error('Save invoice error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save invoice';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setSaving(false);
    }
  };

  const saveAsDraftHandler = () => saveInvoice('draft');
  const saveAndContinueHandler = () => saveInvoice('completed');

  return {
    saving,
    error,
    saveAsDraft: saveAsDraftHandler,
    saveAndContinue: saveAndContinueHandler
  };
};
