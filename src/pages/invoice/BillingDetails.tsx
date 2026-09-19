import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateInvoiceData } from '../../store/invoiceSlice';
import { clientService, ClientData } from '../../services/clientService';
import { businessService } from '../../services/businessService';

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

const emptyBusinessForm = {
	vendorName: '',
	country: 'India',
	city: '',
	gstin: '',
	pan: '',
	addressCountry: 'India',
	state: '',
	addressCity: '',
	postalCode: '',
	streetAddress: '',
	updatePrevious: false,
	updateFuture: true,
};

export default function BillingDetails({ BilledBySection, BilledToSection }: BillingDetailsSectionProps) {
	const dispatch = useAppDispatch();
	const invoiceData = useAppSelector((state) => state.invoice);

	const [selectedClient, setSelectedClient] = useState(invoiceData.selectedClient);
	const [selectedBusiness, setSelectedBusiness] = useState(invoiceData.businessDetails.vendorName);
	const [businessForm, setBusinessForm] = useState<any>(emptyBusinessForm);
	const [businesses, setBusinesses] = useState<any[]>([]);
	// Always start empty — only filled from DB
	const [clients, setClients] = useState<any[]>([]);

	const [clientForm, setClientForm] = useState({
		logo: null as string | null,
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

	// Track whether the business profile has loaded from DB so we
	// don't immediately fire a save with empty data on mount.
	const businessProfileLoaded = useRef(false);
	const businessSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ── On mount: load both clients and business profile from DB ──────────────
	useEffect(() => {
		// Load clients (scoped to current user via auth header)
		clientService.getClients()
			.then((dbClients) => {
				const mapped = dbClients.map(dbClientToLocal);
				setClients(mapped);
			})
			.catch(() => {
				setClients([]); // ensure no dummy data on error
			});

		// Load business profile
		businessService.getProfile()
			.then((profile) => {
				if (profile && profile.vendorName) {
					const form = {
						vendorName: profile.vendorName || '',
						country: profile.country || 'India',
						city: profile.city || '',
						gstin: profile.gstin || '',
						pan: profile.pan || '',
						addressCountry: profile.addressCountry || 'India',
						state: profile.state || '',
						addressCity: profile.addressCity || '',
						postalCode: profile.postalCode || '',
						streetAddress: profile.streetAddress || '',
						updatePrevious: false,
						updateFuture: true,
					};
					setBusinessForm(form);
					setSelectedBusiness(profile.vendorName);
					setBusinesses([{ id: 1, name: profile.vendorName, company: '' }]);
				}
				businessProfileLoaded.current = true;
			})
			.catch(() => {
				businessProfileLoaded.current = true;
			});
	}, []);

	// ── Sync clients + selectedClient to Redux ────────────────────────────────
	useEffect(() => {
		dispatch(updateInvoiceData({ clients, selectedClient }));
	}, [clients, selectedClient, dispatch]);

	// ── Sync businessForm to Redux ────────────────────────────────────────────
	useEffect(() => {
		dispatch(updateInvoiceData({ businessDetails: businessForm }));
	}, [businessForm, dispatch]);

	// ── Auto-save businessForm to DB (debounced 800ms) ────────────────────────
	useEffect(() => {
		if (!businessProfileLoaded.current) return; // skip until initial load done
		if (!businessForm.vendorName) return;        // don't save blank vendor name

		if (businessSaveTimer.current) clearTimeout(businessSaveTimer.current);
		businessSaveTimer.current = setTimeout(() => {
			businessService.saveProfile({
				vendorName: businessForm.vendorName,
				country: businessForm.country,
				city: businessForm.city,
				gstin: businessForm.gstin,
				pan: businessForm.pan,
				addressCountry: businessForm.addressCountry,
				state: businessForm.state,
				addressCity: businessForm.addressCity,
				postalCode: businessForm.postalCode,
				streetAddress: businessForm.streetAddress,
			}).catch((err) => console.error('Failed to save business profile:', err));
		}, 800);

		return () => {
			if (businessSaveTimer.current) clearTimeout(businessSaveTimer.current);
		};
	}, [businessForm]);

	// ── When business name changes keep businesses list in sync ───────────────
	useEffect(() => {
		if (businessForm.vendorName) {
			setBusinesses([{ id: 1, name: businessForm.vendorName, company: '' }]);
		}
	}, [businessForm.vendorName]);

	// ── Wrap setClients: persist new/edited client to DB ─────────────────────
	const handleSetClients = async (updatedClients: any[]) => {
		const prevIds = new Set(clients.map((c: any) => c._id).filter(Boolean));
		const newClient = updatedClients.find((c: any) => !c._id);
		const editedClient = updatedClients.find(
			(c: any) =>
				c._id &&
				prevIds.has(c._id) &&
				JSON.stringify(c) !== JSON.stringify(clients.find((p: any) => p._id === c._id))
		);

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
				// Replace the temp client with the DB-saved one (now has _id)
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
