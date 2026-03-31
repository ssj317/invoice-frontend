import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateInvoiceData } from '../../store/invoiceSlice';
import { clientService, ClientData } from '../../services/clientService';

interface BillingDetailsSectionProps {
	BilledBySection: React.ComponentType<any>;
	BilledToSection: React.ComponentType<any>;
}

// Map DB client to the local Client shape used by BilledToSection
function dbClientToLocal(c: ClientData, index: number) {
	return {
		id: index + 1,
		_id: c._id,
		name: c.businessName,
		company: c.businessAlias || c.businessName,
		logo: c.logo,
		businessName: c.businessName,
		industry: c.industry,
		country: c.country,
		city: c.city,
		gstin: c.gstin,
		pan: c.pan,
		clientType: c.clientType,
		taxTreatment: c.taxTreatment,
		addressCountry: c.addressCountry,
		state: c.state,
		addressCity: c.addressCity,
		postalCode: c.postalCode,
		streetAddress: c.streetAddress,
		businessAlias: c.businessAlias,
		uniqueKey: c.uniqueKey,
		email: c.email,
		showEmailInInvoice: c.showEmailInInvoice,
		phoneCode: c.phoneCode,
		phone: c.phone,
		showPhoneInInvoice: c.showPhoneInInvoice,
		defaultDueDays: c.defaultDueDays,
	};
}

export default function BillingDetails({ BilledBySection, BilledToSection }: BillingDetailsSectionProps) {
	const dispatch = useAppDispatch();
	const invoiceData = useAppSelector((state) => state.invoice);

	const [selectedClient, setSelectedClient] = useState(invoiceData.selectedClient);
	const [selectedBusiness, setSelectedBusiness] = useState(invoiceData.businessDetails.vendorName);
	const [businessForm, setBusinessForm] = useState(invoiceData.businessDetails);

	const [clientForm, setClientForm] = useState({
		logo: null,
		businessName: '',
		industry: '',
		country: 'India',
		city: '',
		gstin: '',
		pan: '',
		clientType: 'individual',
		taxTreatment: '',
		addressCountry: 'India',
		state: '',
		addressCity: '',
		postalCode: '',
		streetAddress: '',
		businessAlias: '',
		uniqueKey: Math.floor(Math.random() * 10000000000000).toString(),
		email: '',
		showEmailInInvoice: false,
		phoneCode: '+91',
		phone: '',
		showPhoneInInvoice: false,
		defaultDueDays: '',
	});

	const [businesses, setBusinesses] = useState([{ id: 1, name: invoiceData.businessDetails.vendorName, company: 'Lokesh Business' }]);
	const [clients, setClients] = useState(invoiceData.clients);

	// Load clients from DB on mount
	useEffect(() => {
		clientService.getClients()
			.then((dbClients) => {
				if (dbClients.length > 0) {
					setClients(dbClients.map(dbClientToLocal));
				}
			})
			.catch(() => {
				// fall back to redux state if API fails
			});
	}, []);

	// Save to Redux whenever data changes
	useEffect(() => {
		dispatch(updateInvoiceData({
			businessDetails: businessForm,
			selectedClient,
			clients,
		}));
	}, [businessForm, selectedClient, clients, dispatch]);

	// Wrap setClients so new/edited clients are persisted to DB
	const handleSetClients = async (updatedClients: any[]) => {
		// Find the client that was added or changed by comparing with current list
		const prevIds = new Set(clients.map((c: any) => c._id).filter(Boolean));
		const newClient = updatedClients.find((c: any) => !c._id);
		const editedClient = updatedClients.find((c: any) => c._id && !prevIds.has(c._id) === false &&
			JSON.stringify(c) !== JSON.stringify(clients.find((p: any) => p._id === c._id)));

		if (newClient) {
			try {
				const saved = await clientService.createClient({
					businessName: newClient.businessName || newClient.name,
					businessAlias: newClient.businessAlias,
					industry: newClient.industry,
					country: newClient.country,
					city: newClient.city,
					gstin: newClient.gstin,
					pan: newClient.pan,
					clientType: newClient.clientType,
					taxTreatment: newClient.taxTreatment,
					addressCountry: newClient.addressCountry,
					state: newClient.state,
					addressCity: newClient.addressCity,
					postalCode: newClient.postalCode,
					streetAddress: newClient.streetAddress,
					email: newClient.email,
					showEmailInInvoice: newClient.showEmailInInvoice,
					phoneCode: newClient.phoneCode,
					phone: newClient.phone,
					showPhoneInInvoice: newClient.showPhoneInInvoice,
					defaultDueDays: newClient.defaultDueDays,
					logo: newClient.logo,
					uniqueKey: newClient.uniqueKey,
				});
				// Replace the temp client with the saved one (now has _id)
				const withId = updatedClients.map((c: any) =>
					!c._id && c.name === newClient.name ? { ...c, _id: saved._id } : c
				);
				setClients(withId);
				return;
			} catch (err) {
				console.error('Failed to save client:', err);
			}
		} else if (editedClient) {
			try {
				await clientService.updateClient(editedClient._id, {
					businessName: editedClient.businessName || editedClient.name,
					businessAlias: editedClient.businessAlias,
					industry: editedClient.industry,
					country: editedClient.country,
					city: editedClient.city,
					gstin: editedClient.gstin,
					pan: editedClient.pan,
					clientType: editedClient.clientType,
					taxTreatment: editedClient.taxTreatment,
					addressCountry: editedClient.addressCountry,
					state: editedClient.state,
					addressCity: editedClient.addressCity,
					postalCode: editedClient.postalCode,
					streetAddress: editedClient.streetAddress,
					email: editedClient.email,
					showEmailInInvoice: editedClient.showEmailInInvoice,
					phoneCode: editedClient.phoneCode,
					phone: editedClient.phone,
					showPhoneInInvoice: editedClient.showPhoneInInvoice,
					defaultDueDays: editedClient.defaultDueDays,
					logo: editedClient.logo,
					uniqueKey: editedClient.uniqueKey,
				});
			} catch (err) {
				console.error('Failed to update client:', err);
			}
		}

		setClients(updatedClients);
	};

	return (
		<div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 xl:gap-44">
				<BilledBySection
					selectedBusiness={selectedBusiness}
					setSelectedBusiness={setSelectedBusiness}
					businesses={businesses}
					setBusinesses={setBusinesses}
					businessForm={businessForm}
					setBusinessForm={setBusinessForm}
				/>

				<BilledToSection
					selectedClient={selectedClient}
					setSelectedClient={setSelectedClient}
					clients={clients}
					setClients={handleSetClients}
					clientForm={clientForm}
					setClientForm={setClientForm}
				/>
			</div>
		</div>
	);
}
