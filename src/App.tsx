// import { Routes, Route } from 'react-router-dom';

// // Components
// import ScrollToTop from './components/ScrollToTop';
// import ProtectedRoute from './components/ProtectedRoute';
// import HomePage from './components/HomePage';
// import WorkflowToolsCarousel from './components/WorkflowToolsCarousel';

// // Auth Pages
// import { Login, Signup, ForgotPassword } from './pages/auth';

// // Dashboard Pages
// import Sidebar from './pages/dashboard/Sidebar';
// import Dashboard from './pages/dashboard/Dashboard';
// import InvoiceList from './pages/dashboard/InvoiceList';

// // Invoice App
// import InvoiceApp from './pages/invoice/InvoiceApp';
// //import { User } from 'lucide-react';
// import UserSettings from './pages/dashboard/UserSettings';
// import BusinessDetails from './pages/auth/BusinessDetails';

// /**
//  * Main App Component
//  * Handles all application routing
//  */
// const App = () => {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/templete" element={<WorkflowToolsCarousel />} />

//         {/* Dashboard Routes - Protected */}
//         <Route path="/sidebar" element={<ProtectedRoute><Sidebar /></ProtectedRoute>} />
//         <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/user-settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
//         <Route path="/business-details" element={<ProtectedRoute><BusinessDetails /></ProtectedRoute>} />
//         <Route path="/invoices" element={<ProtectedRoute><InvoiceList type="all" /></ProtectedRoute>} />
//         <Route path="/quotations" element={<ProtectedRoute><InvoiceList type="quotation" /></ProtectedRoute>} />
        
//         {/* Protected Invoice Routes */}
//         <Route
//           path="/invoice/:templateType"
//           element={
//             <ProtectedRoute>
//               <InvoiceApp />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;

import { Routes, Route } from 'react-router-dom';

// Components
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import WorkflowToolsCarousel from './components/WorkflowToolsCarousel';

// Auth Pages
import { Login, Signup, ForgotPassword } from './pages/auth';

// Dashboard Pages
import Sidebar from './pages/dashboard/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import InvoiceList from './pages/dashboard/InvoiceList';

// Invoice App
import InvoiceApp from './pages/invoice/InvoiceApp';
//import { User } from 'lucide-react';
import UserSettings from './pages/dashboard/UserSettings';
import ClientsPage from './pages/dashboard/ClientsPage';
import BusinessDetails from './pages/auth/BusinessDetails';
import { ProposalApp } from './pages/proposal';

/**
 * Main App Component
 * Handles all application routing
 */
const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/templete" element={<WorkflowToolsCarousel />} />

        {/* Dashboard Routes - Protected */}
        <Route path="/sidebar" element={<ProtectedRoute><Sidebar /></ProtectedRoute>} />
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/user-settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
        <Route path="/business-details" element={<ProtectedRoute><BusinessDetails /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><InvoiceList type="all" /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
        <Route path="/quotations" element={<ProtectedRoute><InvoiceList type="quotation" /></ProtectedRoute>} />
        
        {/* Protected Invoice Routes */}
        <Route
          path="/invoice/:templateType"
          element={
            <ProtectedRoute>
              <InvoiceApp />

            </ProtectedRoute>
          }
        />

          <Route
          path="/proposal/:templateType"
          element={
            <ProtectedRoute>
              <ProposalApp />

            </ProtectedRoute>
          }
        />

      </Routes>

          



    </>
  );
};

export default App;


