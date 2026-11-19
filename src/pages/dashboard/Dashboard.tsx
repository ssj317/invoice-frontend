
import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  ShoppingCart,
  FileCheck,
  Receipt,
  Truck,
  ClipboardList,
  Users,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { invoiceService } from '@/services/invoiceService';
import { documentService } from '@/services/documentService';
import DashboardLayout from './DashboardLayout';
import { useDocumentAccess } from '@/hooks/useDocumentAccess';

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const hasDocumentAccess = useDocumentAccess();

  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [lastQuotation, setLastQuotation] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const displayUser = user || {
    fullName: 'User',
    companyName: 'Your Company',
    email: '',
  };

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          invoiceResponse,
          documentResponse,
          quotationResponse,
          statsResponse,
        ] = await Promise.allSettled([
          invoiceService.getInvoices({
            page: 1,
            limit: 1,
            sortBy: 'createdAt',
            order: 'desc',
          }),

          documentService.getAll(undefined, 1, 1),

          invoiceService.getInvoices({
            page: 1,
            limit: 1,
            templateType: 'quotation',
            sortBy: 'createdAt',
            order: 'desc',
          }),

          invoiceService.getInvoiceStats(),
        ]);

        if (
          invoiceResponse.status === 'fulfilled' &&
          invoiceResponse.value.success
        ) {
          const latestInvoice = invoiceResponse.value.data.invoices?.[0] || null;
          const latestDocument = documentResponse.status === 'fulfilled'
            ? documentResponse.value.data.documents?.[0]
            : null;
          const normalizedDocument = latestDocument ? {
            ...latestDocument,
            templateType: latestDocument.documentType,
            invoiceNo: latestDocument.data?.ourRef || latestDocument.title || latestDocument.documentType,
            clientDetails: { name: latestDocument.data?.clientName || 'N/A' },
            invoiceDate: latestDocument.data?.date,
            items: [{ total: Number(String(latestDocument.data?.totalAmount || '0').replace(/,/g, '')) || 0 }],
            status: latestDocument.status,
          } : null;
          const latest = [latestInvoice, normalizedDocument]
            .filter(Boolean)
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
          setLastInvoice(latest);
        }

        if (
          quotationResponse.status === 'fulfilled' &&
          quotationResponse.value.success
        ) {
          setLastQuotation(
            quotationResponse.value.data.invoices?.[0] || null
          );
        }

        if (
          statsResponse.status === 'fulfilled' &&
          statsResponse.value.success
        ) {
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

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (
    amount: number,
    currencySymbol: string = '₹'
  ) => {
    if (!amount) return `${currencySymbol}0`;

    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="
        p-3
        mt-4
        sm:mt-2
        sm:p-4
        md:p-6
        lg:p-8
        max-w-[1600px]
        mx-auto
        w-full
        min-h-screen
        bg-[#F8F4E1]
      ">

        {/* =========================================================
            WELCOME SECTION
        ========================================================= */}

        <div className="mb-5 sm:mb-6 md:mb-8">

          <div className="
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-4
          ">

            {/* User */}
            <div className="
              flex
              items-center
              gap-3
              md:gap-4
              w-full
              sm:w-auto
            ">

              {/* Avatar */}
              <div className="
                w-11
                h-11
                sm:w-12
                sm:h-12
                md:w-14
                md:h-14
                bg-[#164A41]
                rounded-2xl
                flex
                items-center
                justify-center
                text-[#FFFDF5]
                text-lg
                sm:text-xl
                font-bold
                flex-shrink-0
                shadow-sm
              ">
                {displayUser.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div className="min-w-0 flex-1">

                <p className="
                  text-xs
                  sm:text-sm
                  text-[#49645F]
                  truncate
                ">
                  Hello {displayUser.fullName}
                </p>

                <h1 className="
                  text-base
                  sm:text-lg
                  md:text-xl
                  lg:text-2xl
                  font-bold
                  text-[#164A41]
                  truncate
                ">
                  Welcome to {displayUser.companyName || 'Your Dashboard'}!
                </h1>

              </div>
            </div>

            {/* Right Side */}
            <div className="
              flex
              flex-col
              sm:flex-row
              items-stretch
              sm:items-center
              gap-2
              sm:gap-3
              w-full
              sm:w-auto
            ">

              {/* Clients */}
              <button
                onClick={() => navigate('/clients')}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-3
                  sm:px-4
                  py-2
                  sm:py-2.5
                  bg-[#178C92]
                  text-white
                  rounded-xl
                  hover:bg-[#007078]
                  transition-all
                  shadow-sm
                  hover:shadow-md
                  flex-shrink-0
                "
              >
                <Users className="w-4 h-4" />

                <span className="
                  text-xs
                  sm:text-sm
                  font-semibold
                ">
                  Clients
                </span>
              </button>

            </div>

          </div>
        </div>

        {/* =========================================================
            GETTING STARTED
        ========================================================= */}

        <div className="mb-3 sm:mb-4 md:mb-6">

          <h2 className="
            text-base
            sm:text-lg
            md:text-xl
            font-bold
            text-[#164A41]
          ">
            Getting Started
          </h2>

        </div>

        {/* =========================================================
            CARDS GRID
        ========================================================= */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-3
          sm:gap-4
          md:gap-5
          lg:gap-6
        ">

          {/* =======================================================
              LAST INVOICE
          ======================================================= */}

          <div className="
            bg-[#FFFDF5]
            rounded-2xl
            border
            border-[#164A41]/10
            p-4
            sm:p-5
            hover:shadow-[0_10px_30px_rgba(22,74,65,0.08)]
            transition-all
          ">

            <h3 className="
              text-sm
              sm:text-base
              font-semibold
              text-[#164A41]
              mb-3
              sm:mb-4
            ">
              Past Invoices
            </h3>

            {loading ? (
              <div className="space-y-3 mb-4">

                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />

              </div>
            ) : lastInvoice ? (

              <div className="
                space-y-2.5
                sm:space-y-3
                mb-4
                sm:mb-5
              ">

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Type
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#178C92]
                    capitalize
                  ">
                    {lastInvoice.templateType?.replace(/-/g, ' ')}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Invoice No.
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    font-medium
                    text-[#164A41]
                  ">
                    {lastInvoice.invoiceNo}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Billed To
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    text-[#164A41]
                    break-words
                    line-clamp-2
                  ">
                    {lastInvoice.clientDetails?.name ||
                      lastInvoice.selectedClient ||
                      'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Amount
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#164A41]
                  ">
                    {/* {formatCurrency(
                      lastInvoice.totals?.grandTotal,
                      lastInvoice.currency?.symbol
                    )} */}
                    {/* {formatCurrency(
    lastInvoice.items?.[0]?.total || 0,
    lastInvoice.currency?.symbol
)} */}

{formatCurrency(
    lastInvoice.items?.[0]?.total || 0,
    lastInvoice.currency?.symbol
)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Date
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    text-[#164A41]
                  ">
                    {formatDate(lastInvoice.invoiceDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Status
                  </p>

                  <span
                    className={`
                      inline-block
                      px-2
                      py-1
                      text-[10px]
                      sm:text-xs
                      rounded-full
                      font-medium
                      ${
                        lastInvoice.status === 'completed'
                          ? 'bg-[#EAF4F1] text-[#007078]'
                          : lastInvoice.status === 'paid'
                            ? 'bg-[#EAF4F1] text-[#178C92]'
                            : lastInvoice.status === 'sent'
                              ? 'bg-[#E7B83C]/15 text-[#8A6A13]'
                              : 'bg-[#F8F4E1] text-[#49645F]'
                      }
                    `}
                  >
                    {lastInvoice.status?.charAt(0).toUpperCase() +
                      lastInvoice.status?.slice(1)}
                  </span>

                </div>

              </div>

            ) : (

              <div className="mb-4 sm:mb-5">

                <p className="
                  text-xs
                  sm:text-sm
                  text-[#49645F]
                  text-center
                  py-8
                ">
                  No documents yet. Create your first one!
                </p>

              </div>

            )}

            {/* Create Invoice */}
            <button
              onClick={() =>
                navigate('/invoice/invoice-generator')
              }
              className="
                w-full
                flex
                items-center
                justify-center
                gap-1.5
                px-3
                py-2
                sm:py-2.5
                text-[#178C92]
                border
                border-[#178C92]
                rounded-xl
                hover:bg-[#EAF4F1]
                transition-colors
                text-xs
                sm:text-sm
                font-semibold
                mb-2
                whitespace-nowrap
              "
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span>
                Create New Invoice
              </span>
            </button>

            {/* View All */}
            <button
              onClick={() => navigate('/invoices')}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                text-[#178C92]
                hover:text-[#007078]
                hover:underline
                text-xs
                sm:text-sm
                font-medium
              "
            >
              <span>View All Documents</span>
            </button>

          </div>

          {/* =======================================================
              LAST QUOTATION
          ======================================================= */}

          <div className="
            bg-[#FFFDF5]
            rounded-2xl
            border
            border-[#164A41]/10
            p-4
            sm:p-5
            hover:shadow-[0_10px_30px_rgba(22,74,65,0.08)]
            transition-all
          ">

            <h3 className="
              text-sm
              sm:text-base
              font-semibold
              text-[#164A41]
              mb-3
              sm:mb-4
            ">
              Past Quotation
            </h3>

            {loading ? (

              <div className="space-y-3 mb-4">

                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
                <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />

              </div>

            ) : lastQuotation ? (

              <div className="
                space-y-2.5
                sm:space-y-3
                mb-4
                sm:mb-5
              ">

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Quotation No.
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    font-medium
                    text-[#164A41]
                  ">
                    {lastQuotation.invoiceNo}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Quotation For
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    text-[#164A41]
                    break-words
                    line-clamp-2
                  ">
                    {lastQuotation.clientDetails?.name ||
                      lastQuotation.selectedClient ||
                      'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Amount
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#164A41]
                  ">
                    {formatCurrency(
                      lastQuotation.totals?.grandTotal,
                      lastQuotation.currency?.symbol
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Quotation Date
                  </p>

                  <p className="
                    text-xs
                    sm:text-sm
                    text-[#164A41]
                  ">
                    {formatDate(lastQuotation.invoiceDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
                    Status
                  </p>

                  <span
                    className={`
                      inline-block
                      px-2
                      py-1
                      text-[10px]
                      sm:text-xs
                      rounded-full
                      font-medium
                      ${
                        lastQuotation.status === 'completed'
                          ? 'bg-[#EAF4F1] text-[#007078]'
                          : lastQuotation.status === 'sent'
                            ? 'bg-[#E7B83C]/15 text-[#8A6A13]'
                            : 'bg-[#F8F4E1] text-[#49645F]'
                      }
                    `}
                  >
                    {lastQuotation.status?.charAt(0).toUpperCase() +
                      lastQuotation.status?.slice(1)}
                  </span>

                </div>

              </div>

            ) : (

              <div className="mb-4 sm:mb-5">

                <p className="
                  text-xs
                  sm:text-sm
                  text-[#49645F]
                  text-center
                  py-8
                ">
                  No quotations yet. Create your first quotation!
                </p>

              </div>

            )}

            {/* Create Quotation */}
            <button
              onClick={() =>
                navigate('/invoice/quotation')
              }
              className="
                w-full
                flex
                items-center
                justify-center
                gap-1.5
                px-3
                py-2
                sm:py-2.5
                text-[#178C92]
                border
                border-[#178C92]
                rounded-xl
                hover:bg-[#EAF4F1]
                transition-colors
                text-xs
                sm:text-sm
                font-semibold
                mb-2
                whitespace-nowrap
              "
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span>
                Create New Quotation
              </span>
            </button>

            {/* View All */}
            <button
              onClick={() => navigate('/quotations')}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                text-[#178C92]
                hover:text-[#007078]
                hover:underline
                text-xs
                sm:text-sm
                font-medium
              "
            >
              <span>View All Quotations</span>
            </button>

          </div>

        </div>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================= */}

        <div className="mt-6 sm:mt-8 md:mt-10">

          <h2 className="
            text-base
            sm:text-lg
            md:text-xl
            font-bold
            text-[#164A41]
            mb-3
            sm:mb-4
          ">
            Create Documents
          </h2>

          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            gap-3
            sm:gap-4
          ">

            {[
              {
                label: 'Invoice',
                icon: <FileText className="w-6 h-6" />,
                route: '/invoice/invoice-generator',
              },
              {
                label: 'Purchase Order',
                icon: <ShoppingCart className="w-6 h-6" />,
                route: '/invoice/purchase-order',
              },
              {
                label: 'Quotation',
                icon: <FileCheck className="w-6 h-6" />,
                route: '/invoice/quotation',
              },
              {
                label: 'GST Invoice',
                icon: <Receipt className="w-6 h-6" />,
                route: '/invoice/gst-invoice',
              },
              {
                label: 'Delivery Challan',
                icon: <Truck className="w-6 h-6" />,
                route: '/invoice/delivery-challan',
              },
              {
                label: 'Proforma Invoice',
                icon: <ClipboardList className="w-6 h-6" />,
                route: '/invoice/proforma-invoice',
              },
              {
                label: 'Service Proposal',
                icon: <Receipt className="w-6 h-6" />,
                route: '/proposal/service-proposal',
              },
              {
                label: 'Service Agreement',
                icon: <FileCheck className="w-6 h-6" />,
                route: '/proposal/service-agreement',
              },
              {
                label: 'Tax Invoice',
                icon: <ClipboardList className="w-6 h-6" />,
                route: '/proposal/tax-invoice',
              },
              {
                label: 'Zorintech Invoice',
                icon: <FileText className="w-6 h-6" />,
                route: '/proposal/zorintech',
              },
            ]
              .filter(
                (_, index) =>
                  hasDocumentAccess || index < 6
              )
              .map((item) => (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    p-4
                    sm:p-5
                    rounded-2xl
                    border
                    border-[#178C92]/15
                    bg-[#FFFDF5]
                    text-[#178C92]
                    transition-all
                    hover:bg-[#EAF4F1]
                    hover:border-[#178C92]/30
                    hover:text-[#007078]
                    hover:shadow-[0_8px_24px_rgba(22,74,65,0.08)]
                  "
                >

                  {item.icon}

                  <span className="
                    text-xs
                    sm:text-sm
                    font-medium
                    text-center
                    leading-tight
                  ">
                    {item.label}
                  </span>

                </button>
              ))}
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;


// import { useState, useEffect } from 'react';
// import {
//   Plus,
//   FileText,
//   ShoppingCart,
//   FileCheck,
//   Receipt,
//   Truck,
//   ClipboardList,
//   Users,
// } from 'lucide-react';

// import { useNavigate } from 'react-router-dom';

// import { useAuth } from '@/hooks/useAuth';
// import { invoiceService } from '@/services/invoiceService';
// import DashboardLayout from './DashboardLayout';
// import { useDocumentAccess } from '@/hooks/useDocumentAccess';

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const { user, isAuthenticated } = useAuth();
//   const hasDocumentAccess = useDocumentAccess();

//   // State for dashboard data
//   const [loading, setLoading] = useState(true);
//   const [lastInvoice, setLastInvoice] = useState<any>(null);
//   const [lastQuotation, setLastQuotation] = useState<any>(null);
//   const [stats, setStats] = useState<any>(null);

//   const displayUser = user || {
//     fullName: 'User',
//     companyName: 'Your Company',
//     email: '',
//   };

//   // Fetch dashboard data
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const [
//           invoiceResponse,
//           quotationResponse,
//           statsResponse,
//         ] = await Promise.allSettled([
//           invoiceService.getInvoices({
//             page: 1,
//             limit: 1,
//             sortBy: 'createdAt',
//             order: 'desc',
//           }),

//           invoiceService.getInvoices({
//             page: 1,
//             limit: 1,
//             templateType: 'quotation',
//             sortBy: 'createdAt',
//             order: 'desc',
//           }),

//           invoiceService.getInvoiceStats(),
//         ]);

//         if (
//           invoiceResponse.status === 'fulfilled' &&
//           invoiceResponse.value.success
//         ) {
//           setLastInvoice(
//             invoiceResponse.value.data.invoices?.[0] || null
//           );
//         }

//         if (
//           quotationResponse.status === 'fulfilled' &&
//           quotationResponse.value.success
//         ) {
//           setLastQuotation(
//             quotationResponse.value.data.invoices?.[0] || null
//           );
//         }

//         if (
//           statsResponse.status === 'fulfilled' &&
//           statsResponse.value.success
//         ) {
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

//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   // Format currency
//   const formatCurrency = (
//     amount: number,
//     currencySymbol: string = '₹'
//   ) => {
//     if (!amount) return `${currencySymbol}0`;

//     return `${currencySymbol}${amount.toLocaleString()}`;
//   };

//   return (
//     <DashboardLayout>

//       {/* =========================================================
//           MAIN CONTENT
//       ========================================================= */}

//       <div className="
//         p-3
//         mt-4
//         sm:mt-2
//         sm:p-4
//         md:p-6
//         lg:p-8
//         max-w-[1600px]
//         mx-auto
//         w-full
//         min-h-screen
//         bg-[#F8F4E1]
//       ">

//         {/* =========================================================
//             WELCOME SECTION
//         ========================================================= */}

//         <div className="mb-5 sm:mb-6 md:mb-8">

//           <div className="
//             flex
//             flex-col
//             sm:flex-row
//             items-start
//             sm:items-center
//             justify-between
//             gap-4
//           ">

//             {/* User */}
//             <div className="
//               flex
//               items-center
//               gap-3
//               md:gap-4
//               w-full
//               sm:w-auto
//             ">

//               {/* Avatar */}
//               <div className="
//                 w-11
//                 h-11
//                 sm:w-12
//                 sm:h-12
//                 md:w-14
//                 md:h-14
//                 bg-[#164A41]
//                 rounded-2xl
//                 flex
//                 items-center
//                 justify-center
//                 text-[#FFFDF5]
//                 text-lg
//                 sm:text-xl
//                 font-bold
//                 flex-shrink-0
//                 shadow-sm
//               ">
//                 {displayUser.fullName?.charAt(0).toUpperCase() || 'U'}
//               </div>

//               <div className="min-w-0 flex-1">

//                 <p className="
//                   text-xs
//                   sm:text-sm
//                   text-[#49645F]
//                   truncate
//                 ">
//                   Hello {displayUser.fullName}
//                 </p>

//                 <h1 className="
//                   text-base
//                   sm:text-lg
//                   md:text-xl
//                   lg:text-2xl
//                   font-bold
//                   text-[#164A41]
//                   truncate
//                 ">
//                   Welcome to {displayUser.companyName || 'Your Dashboard'}!
//                 </h1>

//               </div>
//             </div>

//             {/* Right Side */}
//             <div className="
//               flex
//               flex-col
//               sm:flex-row
//               items-stretch
//               sm:items-center
//               gap-2
//               sm:gap-3
//               w-full
//               sm:w-auto
//             ">

//               {/* Clients */}
//               <button
//                 onClick={() => navigate('/clients')}
//                 className="
//                   flex
//                   items-center
//                   justify-center
//                   gap-2
//                   px-3
//                   sm:px-4
//                   py-2
//                   sm:py-2.5
//                   bg-[#178C92]
//                   text-white
//                   rounded-xl
//                   hover:bg-[#007078]
//                   transition-all
//                   shadow-sm
//                   hover:shadow-md
//                   flex-shrink-0
//                 "
//               >
//                 <Users className="w-4 h-4" />

//                 <span className="
//                   text-xs
//                   sm:text-sm
//                   font-semibold
//                 ">
//                   Clients
//                 </span>
//               </button>

//             </div>

//           </div>
//         </div>

//         {/* =========================================================
//             GETTING STARTED
//         ========================================================= */}

//         <div className="mb-3 sm:mb-4 md:mb-6">

//           <h2 className="
//             text-base
//             sm:text-lg
//             md:text-xl
//             font-bold
//             text-[#164A41]
//           ">
//             Getting Started
//           </h2>

//         </div>

//         {/* =========================================================
//             CARDS GRID
//         ========================================================= */}

//         <div className="
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           lg:grid-cols-3
//           gap-3
//           sm:gap-4
//           md:gap-5
//           lg:gap-6
//         ">

//           {/* =======================================================
//               LAST INVOICE
//           ======================================================= */}

//           <div className="
//             bg-[#FFFDF5]
//             rounded-2xl
//             border
//             border-[#164A41]/10
//             p-4
//             sm:p-5
//             hover:shadow-[0_10px_30px_rgba(22,74,65,0.08)]
//             transition-all
//           ">

//             <h3 className="
//               text-sm
//               sm:text-base
//               font-semibold
//               text-[#164A41]
//               mb-3
//               sm:mb-4
//             ">
//               Past Invoices
//             </h3>

//             {loading ? (
//               <div className="space-y-3 mb-4">

//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />

//               </div>
//             ) : lastInvoice ? (

//               <div className="
//                 space-y-2.5
//                 sm:space-y-3
//                 mb-4
//                 sm:mb-5
//               ">

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Type
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     font-semibold
//                     text-[#178C92]
//                     capitalize
//                   ">
//                     {lastInvoice.templateType?.replace(/-/g, ' ')}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Invoice No.
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     font-medium
//                     text-[#164A41]
//                   ">
//                     {lastInvoice.invoiceNo}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Billed To
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     text-[#164A41]
//                     break-words
//                     line-clamp-2
//                   ">
//                     {lastInvoice.clientDetails?.name ||
//                       lastInvoice.selectedClient ||
//                       'N/A'}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Amount
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     font-semibold
//                     text-[#164A41]
//                   ">
//                     {/* {formatCurrency(
//                       lastInvoice.totals?.grandTotal,
//                       lastInvoice.currency?.symbol
//                     )} */}
//                     {/* {formatCurrency(
//     lastInvoice.items?.[0]?.total || 0,
//     lastInvoice.currency?.symbol
// )} */}

// {formatCurrency(
//     lastInvoice.items?.[0]?.total || 0,
//     lastInvoice.currency?.symbol
// )}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Date
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     text-[#164A41]
//                   ">
//                     {formatDate(lastInvoice.invoiceDate)}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Status
//                   </p>

//                   <span
//                     className={`
//                       inline-block
//                       px-2
//                       py-1
//                       text-[10px]
//                       sm:text-xs
//                       rounded-full
//                       font-medium
//                       ${
//                         lastInvoice.status === 'completed'
//                           ? 'bg-[#EAF4F1] text-[#007078]'
//                           : lastInvoice.status === 'paid'
//                             ? 'bg-[#EAF4F1] text-[#178C92]'
//                             : lastInvoice.status === 'sent'
//                               ? 'bg-[#E7B83C]/15 text-[#8A6A13]'
//                               : 'bg-[#F8F4E1] text-[#49645F]'
//                       }
//                     `}
//                   >
//                     {lastInvoice.status?.charAt(0).toUpperCase() +
//                       lastInvoice.status?.slice(1)}
//                   </span>

//                 </div>

//               </div>

//             ) : (

//               <div className="mb-4 sm:mb-5">

//                 <p className="
//                   text-xs
//                   sm:text-sm
//                   text-[#49645F]
//                   text-center
//                   py-8
//                 ">
//                   No documents yet. Create your first one!
//                 </p>

//               </div>

//             )}

//             {/* Create Invoice */}
//             <button
//               onClick={() =>
//                 navigate('/invoice/invoice-generator')
//               }
//               className="
//                 w-full
//                 flex
//                 items-center
//                 justify-center
//                 gap-1.5
//                 px-3
//                 py-2
//                 sm:py-2.5
//                 text-[#178C92]
//                 border
//                 border-[#178C92]
//                 rounded-xl
//                 hover:bg-[#EAF4F1]
//                 transition-colors
//                 text-xs
//                 sm:text-sm
//                 font-semibold
//                 mb-2
//                 whitespace-nowrap
//               "
//             >
//               <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

//               <span>
//                 Create New Invoice
//               </span>
//             </button>

//             {/* View All */}
//             <button
//               onClick={() => navigate('/invoices')}
//               className="
//                 w-full
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 text-[#178C92]
//                 hover:text-[#007078]
//                 hover:underline
//                 text-xs
//                 sm:text-sm
//                 font-medium
//               "
//             >
//               <span>View All Documents</span>
//             </button>

//           </div>

//           {/* =======================================================
//               LAST QUOTATION
//           ======================================================= */}

//           <div className="
//             bg-[#FFFDF5]
//             rounded-2xl
//             border
//             border-[#164A41]/10
//             p-4
//             sm:p-5
//             hover:shadow-[0_10px_30px_rgba(22,74,65,0.08)]
//             transition-all
//           ">

//             <h3 className="
//               text-sm
//               sm:text-base
//               font-semibold
//               text-[#164A41]
//               mb-3
//               sm:mb-4
//             ">
//               Past Quotation
//             </h3>

//             {loading ? (

//               <div className="space-y-3 mb-4">

//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />
//                 <div className="h-4 bg-[#EAF4F1] rounded animate-pulse" />

//               </div>

//             ) : lastQuotation ? (

//               <div className="
//                 space-y-2.5
//                 sm:space-y-3
//                 mb-4
//                 sm:mb-5
//               ">

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Quotation No.
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     font-medium
//                     text-[#164A41]
//                   ">
//                     {lastQuotation.invoiceNo}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Quotation For
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     text-[#164A41]
//                     break-words
//                     line-clamp-2
//                   ">
//                     {lastQuotation.clientDetails?.name ||
//                       lastQuotation.selectedClient ||
//                       'N/A'}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Amount
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     font-semibold
//                     text-[#164A41]
//                   ">
//                     {formatCurrency(
//                       lastQuotation.totals?.grandTotal,
//                       lastQuotation.currency?.symbol
//                     )}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Quotation Date
//                   </p>

//                   <p className="
//                     text-xs
//                     sm:text-sm
//                     text-[#164A41]
//                   ">
//                     {formatDate(lastQuotation.invoiceDate)}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] sm:text-xs text-[#49645F]/70 mb-0.5">
//                     Status
//                   </p>

//                   <span
//                     className={`
//                       inline-block
//                       px-2
//                       py-1
//                       text-[10px]
//                       sm:text-xs
//                       rounded-full
//                       font-medium
//                       ${
//                         lastQuotation.status === 'completed'
//                           ? 'bg-[#EAF4F1] text-[#007078]'
//                           : lastQuotation.status === 'sent'
//                             ? 'bg-[#E7B83C]/15 text-[#8A6A13]'
//                             : 'bg-[#F8F4E1] text-[#49645F]'
//                       }
//                     `}
//                   >
//                     {lastQuotation.status?.charAt(0).toUpperCase() +
//                       lastQuotation.status?.slice(1)}
//                   </span>

//                 </div>

//               </div>

//             ) : (

//               <div className="mb-4 sm:mb-5">

//                 <p className="
//                   text-xs
//                   sm:text-sm
//                   text-[#49645F]
//                   text-center
//                   py-8
//                 ">
//                   No quotations yet. Create your first quotation!
//                 </p>

//               </div>

//             )}

//             {/* Create Quotation */}
//             <button
//               onClick={() =>
//                 navigate('/invoice/quotation')
//               }
//               className="
//                 w-full
//                 flex
//                 items-center
//                 justify-center
//                 gap-1.5
//                 px-3
//                 py-2
//                 sm:py-2.5
//                 text-[#178C92]
//                 border
//                 border-[#178C92]
//                 rounded-xl
//                 hover:bg-[#EAF4F1]
//                 transition-colors
//                 text-xs
//                 sm:text-sm
//                 font-semibold
//                 mb-2
//                 whitespace-nowrap
//               "
//             >
//               <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

//               <span>
//                 Create New Quotation
//               </span>
//             </button>

//             {/* View All */}
//             <button
//               onClick={() => navigate('/quotations')}
//               className="
//                 w-full
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 text-[#178C92]
//                 hover:text-[#007078]
//                 hover:underline
//                 text-xs
//                 sm:text-sm
//                 font-medium
//               "
//             >
//               <span>View All Quotations</span>
//             </button>

//           </div>

//         </div>

//         {/* =========================================================
//             QUICK ACTIONS
//         ========================================================= */}

//         <div className="mt-6 sm:mt-8 md:mt-10">

//           <h2 className="
//             text-base
//             sm:text-lg
//             md:text-xl
//             font-bold
//             text-[#164A41]
//             mb-3
//             sm:mb-4
//           ">
//             Create Documents
//           </h2>

//           <div className="
//             grid
//             grid-cols-2
//             sm:grid-cols-3
//             lg:grid-cols-6
//             gap-3
//             sm:gap-4
//           ">

//             {[
//               {
//                 label: 'Invoice',
//                 icon: <FileText className="w-6 h-6" />,
//                 route: '/invoice/invoice-generator',
//               },
//               {
//                 label: 'Purchase Order',
//                 icon: <ShoppingCart className="w-6 h-6" />,
//                 route: '/invoice/purchase-order',
//               },
//               {
//                 label: 'Quotation',
//                 icon: <FileCheck className="w-6 h-6" />,
//                 route: '/invoice/quotation',
//               },
//               {
//                 label: 'GST Invoice',
//                 icon: <Receipt className="w-6 h-6" />,
//                 route: '/invoice/gst-invoice',
//               },
//               {
//                 label: 'Delivery Challan',
//                 icon: <Truck className="w-6 h-6" />,
//                 route: '/invoice/delivery-challan',
//               },
//               {
//                 label: 'Proforma Invoice',
//                 icon: <ClipboardList className="w-6 h-6" />,
//                 route: '/invoice/proforma-invoice',
//               },
//               {
//                 label: 'Service Proposal',
//                 icon: <Receipt className="w-6 h-6" />,
//                 route: '/proposal/service-proposal',
//               },
//               {
//                 label: 'Service Agreement',
//                 icon: <FileCheck className="w-6 h-6" />,
//                 route: '/proposal/service-agreement',
//               },
//               {
//                 label: 'Tax Invoice',
//                 icon: <ClipboardList className="w-6 h-6" />,
//                 route: '/proposal/tax-invoice',
//               },
//               {
//                 label: 'Zorintech Invoice',
//                 icon: <FileText className="w-6 h-6" />,
//                 route: '/proposal/zorintech',
//               },
//             ]
//               .filter(
//                 (_, index) =>
//                   hasDocumentAccess || index < 6
//               )
//               .map((item) => (
//                 <button
//                   key={item.route}
//                   onClick={() => navigate(item.route)}
//                   className="
//                     flex
//                     flex-col
//                     items-center
//                     justify-center
//                     gap-2
//                     p-4
//                     sm:p-5
//                     rounded-2xl
//                     border
//                     border-[#178C92]/15
//                     bg-[#FFFDF5]
//                     text-[#178C92]
//                     transition-all
//                     hover:bg-[#EAF4F1]
//                     hover:border-[#178C92]/30
//                     hover:text-[#007078]
//                     hover:shadow-[0_8px_24px_rgba(22,74,65,0.08)]
//                   "
//                 >

//                   {item.icon}

//                   <span className="
//                     text-xs
//                     sm:text-sm
//                     font-medium
//                     text-center
//                     leading-tight
//                   ">
//                     {item.label}
//                   </span>

//                 </button>
//               ))}
//           </div>
//         </div>

//       </div>

//     </DashboardLayout>
//   );
// };

// export default Dashboard;


