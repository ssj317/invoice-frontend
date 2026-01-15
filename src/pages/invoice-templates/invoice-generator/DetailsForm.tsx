import { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateInvoiceData } from '../../../store/invoiceSlice';

export default function InvoiceDetailsForm() {
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.invoice);

  const [invoiceNo, setInvoiceNo] = useState(invoiceData.invoiceNo);
  const [invoiceDate, setInvoiceDate] = useState(invoiceData.invoiceDate);
  const [showDueDate, setShowDueDate] = useState(!!invoiceData.dueDate);
  const [dueDate, setDueDate] = useState(invoiceData.dueDate);
  const [logo, setLogo] = useState(invoiceData.logo);
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [customFields, setCustomFields] = useState(invoiceData.customFields);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Save to Redux whenever data changes
  useEffect(() => {
    dispatch(updateInvoiceData({
      invoiceNo,
      invoiceDate,
      dueDate,
      logo,
      customFields,
    }));
  }, [invoiceNo, invoiceDate, dueDate, logo, customFields, dispatch]);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleAddDueDate = () => {
    setShowDueDate(true);
    setDueDate(invoiceDate);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomField = () => {
    if (newFieldLabel.trim()) {
      setCustomFields([
        ...customFields,
        {
          id: Date.now(),
          label: newFieldLabel,
          value: newFieldValue,
          isDefault: setAsDefault,
        },
      ]);
      setNewFieldLabel('');
      setNewFieldValue('');
      setSetAsDefault(false);
      setShowAddFieldModal(false);
      setShowCustomFieldsModal(true);
    }
  };

  const handleDeleteCustomField = (id: number) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-12 px-20">
          {/* Left Column - Form Fields */}
          <div className="flex-1 space-y-6 flex flex-col">
            {/* Invoice Number */}
            <div className="flex gap-8 items-start">
              <label className="text-gray-700 text-base font-medium w-32 pt-2">
                Invoice No<span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <div className="border-b-2 border-dotted border-gray-300 w-60 hover:border-purple-400 transition-colors">
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="text-sm text-gray-900 outline-none border-none bg-transparent w-60"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last No: A00001 (Jan 5, 2026)</p>
              </div>
            </div>

            {/* Invoice Date */}
            <div className="flex gap-8 items-start">
              <label className="text-gray-700 text-base font-medium w-32 pt-2">
                Invoice Date<span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <div className="border-b-2 border-dotted border-gray-300 pb-1 w-60 hover:border-purple-400 transition-colors">
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="text-sm text-gray-900 outline-none border-none bg-transparent cursor-pointer w-60"
                  />
                </div>
              </div>
            </div>

            {/* Due Date (conditional) */}
            {showDueDate && (
              <div className="flex gap-8 items-start">
                <label className="text-gray-700 text-base font-medium w-32 pt-2">
                  Due Date
                </label>
                <div className="flex-1">
                  <div className="border-b-2 border-dotted border-gray-300 pb-1 w-60 hover:border-purple-400 transition-colors">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="text-sm text-gray-900 outline-none border-none bg-transparent cursor-pointer w-60"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add due date button */}
            {!showDueDate && (
              <button
                onClick={handleAddDueDate}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors ml-40 font-medium"
              >
                <Plus size={18} />
                <span>Add due date</span>
              </button>
            )}

            {/* Custom Fields */}
            {customFields.map((field) => (
              <div key={field.id} className="flex gap-8 items-start">
                <label className="text-gray-700 text-base font-medium w-32 pt-2">
                  {field.label}
                </label>
                <div className="flex-1">
                  <div className="border-b-2 border-dotted border-gray-300 pb-1 hover:border-purple-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          const updated = customFields.map((f) =>
                            f.id === field.id ? { ...f, value: e.target.value } : f
                          );
                          setCustomFields(updated);
                        }}
                        className="text-lg text-gray-900 outline-none bg-transparent flex-1"
                      />
                      <button
                        onClick={() => handleDeleteCustomField(field.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Custom Fields */}
            <button
              onClick={() => setShowCustomFieldsModal(true)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mt-6 ml-40 font-medium"
            >
              <Plus size={18} />
              <span>Add Custom Fields</span>
            </button>
          </div>

          {/* Right Column - Logo Upload */}
          <div className="w-60 h-48">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition-all duration-200 bg-purple-50/30">
              <input
                type="file"
                id="logo-upload"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                {logo ? (
                  <div className="space-y-3">
                    <img src={logo} alt="Business Logo" className="max-h-32 mx-auto rounded-lg" />
                    <p className="text-xs text-purple-600 font-medium hover:text-purple-700">Change Logo</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                        <svg
                          className="w-8 h-8 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-700">Add Business Logo</h3>
                    <p className="text-xs text-gray-500">
                      Resolution up to 1080×1080px.
                      <br />
                      PNG or JPEG file.
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Fields List Modal */}
      {showCustomFieldsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Custom Fields</h2>
              <button
                onClick={() => setShowCustomFieldsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {customFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No custom fields added yet</p>
                ) : (
                  customFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{field.label}</p>
                        <p className="text-sm text-gray-500">{field.value || 'No value'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomField(field.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setShowCustomFieldsModal(false);
                  setShowAddFieldModal(true);
                }}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Add New Custom Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Add Custom Field</h2>
              <button
                onClick={() => {
                  setShowAddFieldModal(false);
                  setNewFieldLabel('');
                  setNewFieldValue('');
                  setSetAsDefault(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Label */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Label<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter field label"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Value</label>
                  <input
                    type="text"
                    placeholder="Enter field value"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                {/* Set as default */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="default-value"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="default-value" className="text-gray-700 cursor-pointer">
                    Set as default value
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddFieldModal(false);
                    setNewFieldLabel('');
                    setNewFieldValue('');
                    setSetAsDefault(false);
                  }}
                  className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomField}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}