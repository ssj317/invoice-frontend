import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Eye, FileText, Mail, X, Send, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import DashboardLayout from './DashboardLayout';

interface InvoiceListProps {
  type?: 'invoice' | 'quotation' | 'all';
}

const InvoiceList = ({ type = 'all' }: InvoiceListProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateType = type === 'quotation' ? 'quotation' : type === 'invoice' ? 'invoice-generator' : undefined;
  const title = type === 'quotation' ? 'Quotations' : type === 'invoice' ? 'Invoices' : 'All Documents';
  const createRoute = type === 'quotation' ? '/invoice/quotation' : '/invoice/invoice-generator';

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [groupByClient, setGroupByClient] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Email modal state
  const [emailModal, setEmailModal] = useState<{ open: boolean; invoice: any | null }>({ open: false, invoice: null });
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const fetchInvoices = async (p = 1) => {
    try {
      setLoading(true);
      const params: any = { page: p, limit: 10, sortBy: 'createdAt', order: 'desc' };
      if (templateType) params.templateType = templateType;
      const res = await invoiceService.getInvoices(params);
      if (res.success) {
        setInvoices(res.data.invoices);
        setTotalPages(res.data.pagination.pages);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(page);
  }, [page, templateType]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await invoiceService.deleteInvoice(id);
      fetchInvoices(page);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openEmailModal = (inv: any) => {
    const clientEmail = inv.clientDetails?.email || '';
    const docType = inv.templateType?.replace(/-/g, ' ') || 'Invoice';
    const docTypeCapitalized = docType.charAt(0).toUpperCase() + docType.slice(1);
    setEmailTo(clientEmail);
    setEmailSubject(`${docTypeCapitalized} ${inv.invoiceNo}`);
    setEmailMessage(`Please find attached your ${docTypeCapitalized} ${inv.invoiceNo}.\n\nThank you for your business.`);
    setEmailError('');
    setEmailSuccess('');
    setEmailModal({ open: true, invoice: inv });
  };

  const handleSendEmail = async () => {
    if (!emailTo) { setEmailError('Recipient email is required'); return; }
    if (!emailModal.invoice) return;
    try {
      setEmailSending(true);
      setEmailError('');
      const res = await invoiceService.sendInvoiceEmail(emailModal.invoice._id, {
        to: emailTo,
        subject: emailSubject,
        message: emailMessage,
      });
      if (res.success) {
        setEmailSuccess(`Email sent successfully to ${emailTo}`);
        fetchInvoices(page); // refresh to show updated status
        setTimeout(() => setEmailModal({ open: false, invoice: null }), 2000);
      }
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setEmailSending(false);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number, symbol = '₹') => {
    if (!amount) return `${symbol}0`;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientName = (inv: any) =>
    inv.clientDetails?.name || inv.selectedClient || 'No Client';

  const groupedInvoices = invoices.reduce((acc: Record<string, any[]>, inv) => {
    const key = getClientName(inv);
    if (!acc[key]) acc[key] = [];
    acc[key].push(inv);
    return acc;
  }, {});

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const InvoiceRow = ({ inv }: { inv: any }) => (
    <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNo}</td>
      <td className="px-4 py-3">
        <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full capitalize">
          {inv.templateType?.replace(/-/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
        {getClientName(inv)}
      </td>
      <td className="px-4 py-3 text-gray-600">{formatDate(inv.invoiceDate)}</td>
      <td className="px-4 py-3 font-medium text-gray-900">
        {formatCurrency(inv.totals?.grandTotal, inv.currency?.symbol)}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>
          {inv.status?.charAt(0).toUpperCase() + inv.status?.slice(1) || 'Draft'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/invoice/${inv.templateType || templateType}?id=${inv._id}`)}
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEmailModal(inv)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(inv._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGroupByClient((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                groupByClient
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
              }`}
            >
              <Users className="w-4 h-4" />
              Group by Client
            </button>
            <button
              onClick={() => navigate(createRoute)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create {type === 'quotation' ? 'Quotation' : 'Invoice'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No {title.toLowerCase()} yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first one to get started</p>
              <button
                onClick={() => navigate(createRoute)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Create {type === 'quotation' ? 'Quotation' : 'Invoice'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">No.</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupByClient
                    ? Object.entries(groupedInvoices).map(([clientName, clientInvoices]) => {
                        const isCollapsed = collapsedGroups.has(clientName);
                        const groupTotal = clientInvoices.reduce(
                          (sum, inv) => sum + (inv.totals?.grandTotal || 0),
                          0
                        );
                        const symbol = clientInvoices[0]?.currency?.symbol || '₹';
                        return (
                          <>
                            {/* Group header row */}
                            <tr
                              key={`group-${clientName}`}
                              className="bg-purple-50 cursor-pointer select-none"
                              onClick={() => toggleGroup(clientName)}
                            >
                              <td colSpan={7} className="px-4 py-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {isCollapsed
                                      ? <ChevronRight className="w-4 h-4 text-purple-500" />
                                      : <ChevronDown className="w-4 h-4 text-purple-500" />
                                    }
                                    <div className="w-7 h-7 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                      {clientName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800 text-sm">{clientName}</span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      {clientInvoices.length} {clientInvoices.length === 1 ? 'invoice' : 'invoices'}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold text-purple-700 mr-2">
                                    {formatCurrency(groupTotal, symbol)}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* Group rows */}
                            {!isCollapsed && clientInvoices.map((inv) => (
                              <InvoiceRow key={inv._id} inv={inv} />
                            ))}
                          </>
                        );
                      })
                    : invoices.map((inv) => <InvoiceRow key={inv._id} inv={inv} />)
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Send via Email</h2>
              </div>
              <button onClick={() => setEmailModal({ open: false, invoice: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {emailSuccess ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Send className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-green-700 font-medium">{emailSuccess}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setEmailModal({ open: false, invoice: null })}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmail}
                      disabled={emailSending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {emailSending ? 'Sending...' : 'Send Email'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InvoiceList;
