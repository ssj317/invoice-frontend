// import { useState, useEffect } from 'react';
// import { Plus, ExternalLink, FileText, ShoppingCart, FileCheck, Receipt, Truck, ClipboardList } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { invoiceService } from '@/services/invoiceService';
// import { subscriptionService } from '@/services/subscriptionService';
// import DashboardLayout from './DashboardLayout';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
  
//   // State for dashboard data
//   const [loading, setLoading] = useState(true);
//   const [lastInvoice, setLastInvoice] = useState<any>(null);
//   const [lastQuotation, setLastQuotation] = useState<any>(null);
//   const [subscription, setSubscription] = useState<any>(null);
//   const [trialInfo, setTrialInfo] = useState<any>(null);
//   const [stats, setStats] = useState<any>(null);
  
//   const displayUser = user || {
//     fullName: 'User',
//     companyName: 'Your Company',
//     email: ''
//   };

//   // Fetch dashboard data
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         const [invoiceResponse, quotationResponse, subResponse, statsResponse] = await Promise.allSettled([
//           invoiceService.getInvoices({ page: 1, limit: 1, sortBy: 'createdAt', order: 'desc' }),
//           invoiceService.getInvoices({ page: 1, limit: 1, templateType: 'quotation', sortBy: 'createdAt', order: 'desc' }),
//           subscriptionService.getSubscription(),
//           invoiceService.getInvoiceStats(),
//         ]);

//         if (invoiceResponse.status === 'fulfilled' && invoiceResponse.value.success) {
//           setLastInvoice(invoiceResponse.value.data.invoices?.[0] || null);
//         }
//         if (quotationResponse.status === 'fulfilled' && quotationResponse.value.success) {
//           setLastQuotation(quotationResponse.value.data.invoices?.[0] || null);
//         }
//         if (subResponse.status === 'fulfilled' && subResponse.value.success) {
//           setSubscription(subResponse.value.data.subscription);
//           setTrialInfo(subResponse.value.data.trialInfo);
//         }
//         if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
//           setStats(statsResponse.value.data);
//         }
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [isAuthenticated]);

//   // Format date
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   // Format currency
//   const formatCurrency = (amount: number, currencySymbol: string = '₹') => {
//     if (!amount) return `${currencySymbol}0`;
//     return `${currencySymbol}${amount.toLocaleString()}`;
//   };

//   return (
//     <DashboardLayout>
//       {/* Main Content */}
//       <div className="p-3 mt-4 sm:mt-2 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-screen">
//         {/* Welcome Section */}
//         <div className="mb-4 sm:mb-6 md:mb-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-xl lg:text-2xl font-bold flex-shrink-0">
//                 {displayUser.fullName?.charAt(0).toUpperCase() || 'U'}
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="text-xs sm:text-sm text-gray-600 truncate">Hello {displayUser.fullName}</p>
//                 <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
//                   Welcome to {displayUser.companyName || 'Your Dashboard'}!
//                 </h1>
//               </div>
//             </div>

//             {/* Subscription Info */}
//             {subscription && (
//               <div className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-50 border border-purple-200 rounded flex-shrink-0">
//                 <span className="text-xs sm:text-sm font-medium text-purple-700">
//                   {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
//                 </span>
//                 <span className="text-xs text-purple-600">
//                   ({subscription.invoicesCreated}/{subscription.invoiceLimit === Infinity ? '∞' : subscription.invoiceLimit} invoices)
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Getting Started Section */}
//         <div className="mb-3 sm:mb-4 md:mb-6">
//           <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Getting Started</h2>
//         </div>

//         {/* Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
//           {/* Your Last Invoice Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
//             <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Past Invoices</h3>

//             {loading ? (
//               <div className="space-y-3 mb-4">
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//             ) : lastInvoice ? (
//               <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Type</p>
//                   <p className="text-xs sm:text-sm font-medium text-purple-700 capitalize">{lastInvoice.templateType?.replace(/-/g, ' ')}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Invoice No.</p>
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">{lastInvoice.invoiceNo}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Billed To</p>
//                   <p className="text-xs sm:text-sm text-gray-900 break-words line-clamp-2">
//                     {lastInvoice.clientDetails?.name || lastInvoice.selectedClient || 'N/A'}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Amount</p>
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">
//                     {formatCurrency(lastInvoice.totals?.grandTotal, lastInvoice.currency?.symbol)}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Date</p>
//                   <p className="text-xs sm:text-sm text-gray-900">{formatDate(lastInvoice.invoiceDate)}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Status</p>
//                   <span className={`inline-block px-2 py-1 text-[10px] sm:text-xs rounded-full ${
//                     lastInvoice.status === 'completed' ? 'bg-green-100 text-green-800' :
//                     lastInvoice.status === 'paid' ? 'bg-blue-100 text-blue-800' :
//                     lastInvoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {lastInvoice.status?.charAt(0).toUpperCase() + lastInvoice.status?.slice(1)}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
//                 <p className="text-xs sm:text-sm text-gray-500 text-center py-8">
//                   No documents yet. Create your first one!
//                 </p>
//               </div>
//             )}

//             <button 
//               onClick={() => navigate('/invoice/invoice-generator')}
//               className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
//             >
//               <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//               <span>Create New Invoice</span>
//             </button>

//             <button 
//               onClick={() => navigate('/invoices')}
//               className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
//             >
//               <span>View All Documents</span>
//               <span>→</span>
//             </button>
//           </div>

//           {/* Your Last Quotation Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
//             <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Past Quotation</h3>

//             {loading ? (
//               <div className="space-y-3 mb-4">
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//             ) : lastQuotation ? (
//               <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation No.</p>
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">{lastQuotation.invoiceNo}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation For</p>
//                   <p className="text-xs sm:text-sm text-gray-900 break-words line-clamp-2">
//                     {lastQuotation.clientDetails?.name || lastQuotation.selectedClient || 'N/A'}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Amount</p>
//                   <p className="text-xs sm:text-sm font-medium text-gray-900">
//                     {formatCurrency(lastQuotation.totals?.grandTotal, lastQuotation.currency?.symbol)}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation Date</p>
//                   <p className="text-xs sm:text-sm text-gray-900">{formatDate(lastQuotation.invoiceDate)}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Status</p>
//                   <span className={`inline-block px-2 py-1 text-[10px] sm:text-xs rounded-full ${
//                     lastQuotation.status === 'completed' ? 'bg-green-100 text-green-800' :
//                     lastQuotation.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {lastQuotation.status?.charAt(0).toUpperCase() + lastQuotation.status?.slice(1)}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
//                 <p className="text-xs sm:text-sm text-gray-500 text-center py-8">
//                   No quotations yet. Create your first quotation!
//                 </p>
//               </div>
//             )}

//             <button 
//               onClick={() => navigate('/invoice/quotation')}
//               className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
//             >
//               <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
//               <span>Create New Quotation</span>
//             </button>

//             <button 
//               onClick={() => navigate('/quotations')}
//               className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
//             >
//               <span>View All Quotations</span>
//               <span>→</span>
//             </button>
//           </div>

//           {/* Subscription Status Card */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
//             <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2">Subscription Status</h3>

//             {loading ? (
//               <div className="space-y-3 mb-4">
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//             ) : subscription ? (
//               <>
//                 <p className="text-[10px] sm:text-xs text-gray-600 mb-3 sm:mb-4 leading-relaxed">
//                   {subscription.plan === 'free' ? '2-Month Free Trial' : `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan`}
//                 </p>

//                 <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 border border-purple-200">
//                   <div className="space-y-2 text-[10px] sm:text-xs">
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Plan:</span>
//                       <span className="font-semibold text-purple-700">
//                         {subscription.plan === 'free' ? 'FREE TRIAL' : subscription.plan.toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Documents Created:</span>
//                       <span className="font-semibold text-gray-900">{subscription.invoicesCreated}</span>
//                     </div>
//                     {subscription.plan === 'free' && trialInfo ? (
//                       <>
//                         <div className="flex justify-between">
//                           <span className="text-gray-700">Trial Status:</span>
//                           <span className={`font-semibold ${trialInfo.isTrialActive ? 'text-green-600' : 'text-red-600'}`}>
//                             {trialInfo.isTrialActive ? 'Active' : 'Expired'}
//                           </span>
//                         </div>
//                         {trialInfo.isTrialActive && (
//                           <div className="flex justify-between">
//                             <span className="text-gray-700">Days Remaining:</span>
//                             <span className={`font-semibold ${trialInfo.trialDaysRemaining <= 14 ? 'text-orange-600' : 'text-green-600'}`}>
//                               {trialInfo.trialDaysRemaining} days
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex justify-between">
//                           <span className="text-gray-700">Trial Ends:</span>
//                           <span className="font-semibold text-gray-900">
//                             {new Date(trialInfo.trialEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//                           </span>
//                         </div>
//                         {!trialInfo.isTrialActive && (
//                           <div className="pt-2 border-t border-purple-200">
//                             <p className="text-red-600 font-medium text-center">⚠️ Trial expired. Upgrade to continue.</p>
//                           </div>
//                         )}
//                         {trialInfo.isTrialActive && trialInfo.trialDaysRemaining <= 14 && (
//                           <div className="pt-2 border-t border-purple-200">
//                             <p className="text-orange-600 font-medium text-center">⚠️ Trial ending soon!</p>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex justify-between">
//                           <span className="text-gray-700">Invoice Limit:</span>
//                           <span className="font-semibold text-gray-900">
//                             {subscription.invoiceLimit >= 1e9 ? 'Unlimited' : subscription.invoiceLimit}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-700">Remaining:</span>
//                           <span className="font-semibold text-green-600">
//                             {subscription.invoiceLimit >= 1e9 ? 'Unlimited' : subscription.invoiceLimit - subscription.invoicesCreated}
//                           </span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {subscription.plan === 'free' && (
//                   <button
//                     onClick={() => navigate('/subscription/upgrade')}
//                     className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
//                   >
//                     <span>Upgrade Plan</span>
//                   </button>
//                 )}

//                 <button
//                   onClick={() => navigate('/subscription')}
//                   className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
//                 >
//                   <span>View Details</span>
//                   <ExternalLink className="w-3 h-3 flex-shrink-0" />
//                 </button>
//               </>
//             ) : (
//               <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
//                 Loading subscription...
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions - Create Documents */}
//         <div className="mt-6 sm:mt-8 md:mt-10">
//           <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Create Documents</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
//             {[
//               { label: 'Invoice', icon: <FileText className="w-6 h-6" />, route: '/invoice/invoice-generator', color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
//               { label: 'Purchase Order', icon: <ShoppingCart className="w-6 h-6" />, route: '/invoice/purchase-order', color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
//               { label: 'Quotation', icon: <FileCheck className="w-6 h-6" />, route: '/invoice/quotation', color: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100' },
//               { label: 'GST Invoice', icon: <Receipt className="w-6 h-6" />, route: '/invoice/gst-invoice', color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' },
//               { label: 'Delivery Challan', icon: <Truck className="w-6 h-6" />, route: '/invoice/delivery-challan', color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
//               { label: 'Proforma Invoice', icon: <ClipboardList className="w-6 h-6" />, route: '/invoice/proforma-invoice', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
//             ].map((item) => (
//               <button
//                 key={item.route}
//                 onClick={() => navigate(item.route)}
//                 className={`flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-xl border transition-all hover:shadow-md ${item.color}`}
//               >
//                 {item.icon}
//                 <span className="text-xs sm:text-sm font-medium text-center leading-tight">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, FileText, ShoppingCart, FileCheck, Receipt, Truck, ClipboardList, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { invoiceService } from '@/services/invoiceService';
import { subscriptionService } from '@/services/subscriptionService';
import DashboardLayout from './DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [lastQuotation, setLastQuotation] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [trialInfo, setTrialInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  
  const displayUser = user || {
    fullName: 'User',
    companyName: 'Your Company',
    email: ''
  };

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [invoiceResponse, quotationResponse, subResponse, statsResponse] = await Promise.allSettled([
          invoiceService.getInvoices({ page: 1, limit: 1, sortBy: 'createdAt', order: 'desc' }),
          invoiceService.getInvoices({ page: 1, limit: 1, templateType: 'quotation', sortBy: 'createdAt', order: 'desc' }),
          subscriptionService.getSubscription(),
          invoiceService.getInvoiceStats(),
        ]);

        if (invoiceResponse.status === 'fulfilled' && invoiceResponse.value.success) {
          setLastInvoice(invoiceResponse.value.data.invoices?.[0] || null);
        }
        if (quotationResponse.status === 'fulfilled' && quotationResponse.value.success) {
          setLastQuotation(quotationResponse.value.data.invoices?.[0] || null);
        }
        if (subResponse.status === 'fulfilled' && subResponse.value.success) {
          setSubscription(subResponse.value.data.subscription);
          setTrialInfo(subResponse.value.data.trialInfo);
        }
        if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
          setStats(statsResponse.value.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Format currency
  const formatCurrency = (amount: number, currencySymbol: string = 'â‚¹') => {
    if (!amount) return `${currencySymbol}0`;
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="p-3 mt-4 sm:mt-2 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-screen">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-xl lg:text-2xl font-bold flex-shrink-0">
                {displayUser.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Hello {displayUser.fullName}</p>
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Welcome to {displayUser.companyName || 'Your Dashboard'}!
                </h1>
              </div>
            </div>

            {/* Subscription Info */}
            {subscription && (
              <div className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-50 border border-purple-200 rounded flex-shrink-0">
                <span className="text-xs sm:text-sm font-medium text-purple-700">
                  {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                </span>
                <span className="text-xs text-purple-600">
                  ({subscription.invoicesCreated}/{subscription.invoiceLimit === Infinity ? 'âˆž' : subscription.invoiceLimit} invoices)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Getting Started</h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Your Last Invoice Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Past Invoices</h3>

            {loading ? (
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : lastInvoice ? (
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Type</p>
                  <p className="text-xs sm:text-sm font-medium text-purple-700 capitalize">{lastInvoice.templateType?.replace(/-/g, ' ')}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Invoice No.</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{lastInvoice.invoiceNo}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Billed To</p>
                  <p className="text-xs sm:text-sm text-gray-900 break-words line-clamp-2">
                    {lastInvoice.clientDetails?.name || lastInvoice.selectedClient || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Amount</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {formatCurrency(lastInvoice.totals?.grandTotal, lastInvoice.currency?.symbol)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Date</p>
                  <p className="text-xs sm:text-sm text-gray-900">{formatDate(lastInvoice.invoiceDate)}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Status</p>
                  <span className={`inline-block px-2 py-1 text-[10px] sm:text-xs rounded-full ${
                    lastInvoice.status === 'completed' ? 'bg-green-100 text-green-800' :
                    lastInvoice.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                    lastInvoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lastInvoice.status?.charAt(0).toUpperCase() + lastInvoice.status?.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                <p className="text-xs sm:text-sm text-gray-500 text-center py-8">
                  No documents yet. Create your first one!
                </p>
              </div>
            )}

            <button 
              onClick={() => navigate('/invoice/invoice-generator')}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Create New Invoice</span>
            </button>

            <button 
              onClick={() => navigate('/invoices')}
              className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
            >
              <span>View All Documents</span>
              {/* <span>â†’</span> */}
            </button>
          </div>

          {/* Your Last Quotation Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Past Quotation</h3>

            {loading ? (
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : lastQuotation ? (
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation No.</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{lastQuotation.invoiceNo}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation For</p>
                  <p className="text-xs sm:text-sm text-gray-900 break-words line-clamp-2">
                    {lastQuotation.clientDetails?.name || lastQuotation.selectedClient || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Amount</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {formatCurrency(lastQuotation.totals?.grandTotal, lastQuotation.currency?.symbol)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Quotation Date</p>
                  <p className="text-xs sm:text-sm text-gray-900">{formatDate(lastQuotation.invoiceDate)}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Status</p>
                  <span className={`inline-block px-2 py-1 text-[10px] sm:text-xs rounded-full ${
                    lastQuotation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    lastQuotation.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lastQuotation.status?.charAt(0).toUpperCase() + lastQuotation.status?.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                <p className="text-xs sm:text-sm text-gray-500 text-center py-8">
                  No quotations yet. Create your first quotation!
                </p>
              </div>
            )}

            <button 
              onClick={() => navigate('/invoice/quotation')}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Create New Quotation</span>
            </button>

            <button 
              onClick={() => navigate('/quotations')}
              className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
            >
              <span>View All Quotations</span>
              {/* <span>â†’</span> */}
            </button>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2">Subscription Status</h3>

            {loading ? (
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : subscription ? (
              <>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  {subscription.plan === 'free' ? '2-Month Free Trial' : `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan`}
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 border border-purple-200">
                  <div className="space-y-2 text-[10px] sm:text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Plan:</span>
                      <span className="font-semibold text-purple-700">
                        {subscription.plan === 'free' ? 'FREE TRIAL' : subscription.plan.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Documents Created:</span>
                      <span className="font-semibold text-gray-900">{subscription.invoicesCreated}</span>
                    </div>
                    {subscription.plan === 'free' && trialInfo ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Trial Status:</span>
                          <span className={`font-semibold ${trialInfo.isTrialActive ? 'text-green-600' : 'text-red-600'}`}>
                            {trialInfo.isTrialActive ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        {trialInfo.isTrialActive && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Days Remaining:</span>
                            <span className={`font-semibold ${trialInfo.trialDaysRemaining <= 14 ? 'text-orange-600' : 'text-green-600'}`}>
                              {trialInfo.trialDaysRemaining} days
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-700">Trial Ends:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(trialInfo.trialEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        {!trialInfo.isTrialActive && (
                          <div className="pt-2 border-t border-purple-200">
                            <p className="text-red-600 font-medium text-center">âš ï¸ Trial expired. Upgrade to continue.</p>
                          </div>
                        )}
                        {trialInfo.isTrialActive && trialInfo.trialDaysRemaining <= 14 && (
                          <div className="pt-2 border-t border-purple-200">
                            <p className="text-orange-600 font-medium text-center">âš ï¸ Trial ending soon!</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Invoice Limit:</span>
                          <span className="font-semibold text-gray-900">
                            {subscription.invoiceLimit >= 1e9 ? 'Unlimited' : subscription.invoiceLimit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Remaining:</span>
                          <span className="font-semibold text-green-600">
                            {subscription.invoiceLimit >= 1e9 ? 'Unlimited' : subscription.invoiceLimit - subscription.invoicesCreated}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {subscription.plan === 'free' && (
                  <button
                    onClick={() => navigate('/subscription/upgrade')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium mb-2 whitespace-nowrap"
                  >
                    <span>Upgrade Plan</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full flex items-center justify-center gap-2 text-purple-600 hover:underline text-xs sm:text-sm"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </button>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
                Loading subscription...
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions - Create Documents */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Create Documents</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { label: 'Invoice', icon: <FileText className="w-6 h-6" />, route: '/invoice/invoice-generator', color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
              { label: 'Purchase Order', icon: <ShoppingCart className="w-6 h-6" />, route: '/invoice/purchase-order', color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
              { label: 'Quotation', icon: <FileCheck className="w-6 h-6" />, route: '/invoice/quotation', color: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100' },
              { label: 'GST Invoice', icon: <Receipt className="w-6 h-6" />, route: '/invoice/gst-invoice', color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' },
              { label: 'Delivery Challan', icon: <Truck className="w-6 h-6" />, route: '/invoice/delivery-challan', color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
              { label: 'Proforma Invoice', icon: <ClipboardList className="w-6 h-6" />, route: '/invoice/proforma-invoice', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
              
              { label: 'Service Proposal', icon: <Receipt className="w-6 h-6" />, route: '/proposal/service-proposal', color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' },  
              { label: 'Service Agreement', icon: <FileCheck className="w-6 h-6" />, route: '/proposal/service-agreement', color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
              { label: 'Tax Invoice', icon: <ClipboardList className="w-6 h-6" />, route: '/proposal/tax-invoice', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
              { label: 'Clients', icon: <Users className="w-6 h-6" />, route: '/clients', color: 'text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100' },
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-xl border transition-all hover:shadow-md ${item.color}`}
              >
                {item.icon}
                <span className="text-xs sm:text-sm font-medium text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


