import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import { useBusiness } from '../context/BusinessContext';

// PrimeReact & Icons
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Skeleton } from 'primereact/skeleton';
import { 
    FaSave, 
    FaUndo, 
    FaPlus, 
    FaTrash, 
    FaArrowLeft, 
    FaExclamationTriangle,
    FaTags,
    FaEdit,
    FaCheckCircle,
    FaInfoCircle
} from 'react-icons/fa';

const color = {
    primary: '#0B77A7',
    secondary: '#0057ae',
    background: '#F5F5F5',
    text: '#212121',
};

const ProductAttributes = () => {
    const { id } = useParams();
    const { businessId } = useBusiness();
    const navigate = useNavigate();
    const toast = useRef(null);

    // --- State ---
    const [attributes, setAttributes] = useState([]);
    const [originalAttributes, setOriginalAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changedIds, setChangedIds] = useState(new Set());

    // --- 1. Fetch Allowed Attributes ---
    useEffect(() => {
        if (businessId && id) loadAttributes();
    }, [businessId, id]);

    const loadAttributes = async () => {
        setLoading(true);
        try {
            const response = await apiGet(`/seller/business/${businessId}/items/${id}/allowed/attributes`);
            if (response.data.success) {
                const data = response.data.data || [];
                setAttributes(data);
                setOriginalAttributes(JSON.parse(JSON.stringify(data)));
                setChangedIds(new Set());
            }
        } catch (error) {
            console.error(error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to load attributes' 
            });
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Change Handling ---
    const handleValueChange = (defId, newValue) => {
        setAttributes(prev => prev.map(attr => {
            if (attr.attributeDefinitionId === defId) {
                return { ...attr, value: newValue };
            }
            return attr;
        }));

        const original = originalAttributes.find(a => a.attributeDefinitionId === defId);
        if (JSON.stringify(original?.value) !== JSON.stringify(newValue)) {
            setChangedIds(prev => new Set(prev).add(defId));
        } else {
            setChangedIds(prev => {
                const next = new Set(prev);
                next.delete(defId);
                return next;
            });
        }
    };

    // --- 3. Save Logic ---
    const handleSave = async () => {
        if (changedIds.size === 0) return;
        setSaving(true);

        try {
            const payload = {
                attributes: attributes
                    .filter(attr => changedIds.has(attr.attributeDefinitionId))
                    .map(attr => ({
                        attributeDefinitionId: attr.attributeDefinitionId,
                        sourceType: attr.sourceType || 'custom',
                        value: attr.value
                    }))
            };

            await apiPost(`/seller/business/${businessId}/items/${id}/attributes`, payload);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Saved', 
                detail: 'Attributes updated successfully' 
            });
            
            await loadAttributes();
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Failed', 
                detail: error.message 
            });
        } finally {
            setSaving(false);
        }
    };

    // --- 4. Dynamic Renderers ---
    const renderInput = (attr) => {
        const { dataType, value, attributeDefinitionId: defId, options } = attr;

        switch (dataType) {
            case 'string':
                return (
                    <InputTextarea 
                        value={value || ''} 
                        onChange={(e) => handleValueChange(defId, e.target.value)}
                        rows={2}
                        className="w-full !p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm transition-all"
                        placeholder={`Enter ${attr.label}...`}
                    />
                );

            case 'number':
                return (
                    <InputText 
                        type="number" 
                        value={value || ''} 
                        onChange={(e) => handleValueChange(defId, Number(e.target.value))}
                        className="w-full !p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                        placeholder="0.00"
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <Checkbox 
                            checked={value === true} 
                            onChange={(e) => handleValueChange(defId, e.checked)}
                            className="!w-5 !h-5"
                        />
                        <label className="text-sm font-semibold cursor-pointer" style={{ color: value ? color.primary : '#6b7280' }}>
                            {value ? 'Enabled' : 'Disabled'}
                        </label>
                    </div>
                );

            case 'enum':
                return (
                    <Dropdown 
                        value={value} 
                        options={options || []} 
                        onChange={(e) => handleValueChange(defId, e.value)} 
                        placeholder="Select an option..."
                        className="w-full"
                        inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-4 !text-sm"
                    />
                );

            case 'array':
                const arr = Array.isArray(value) ? value : [];
                return (
                    <div className="space-y-2">
                        {arr.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                                <InputText 
                                    value={item} 
                                    onChange={(e) => {
                                        const newArr = [...arr];
                                        newArr[idx] = e.target.value;
                                        handleValueChange(defId, newArr);
                                    }}
                                    className="flex-1 !p-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !text-sm"
                                />
                                <Button 
                                    icon={<FaTrash className="text-xs"/>} 
                                    className="!p-3 !bg-red-50 !text-red-500 !border-none !rounded-xl hover:!bg-red-100 transition-all" 
                                    onClick={() => {
                                        handleValueChange(defId, arr.filter((_, i) => i !== idx));
                                    }}
                                />
                            </div>
                        ))}
                        <Button 
                            label="Add Item" 
                            icon={<FaPlus className="mr-2 text-xs"/>} 
                            size="small" 
                            className="!bg-purple-50 !text-purple-600 !border-none !rounded-xl !px-4 !py-2 !text-xs !font-semibold hover:!bg-purple-100 transition-all" 
                            onClick={() => {
                                handleValueChange(defId, [...arr, ""]);
                            }}
                        />
                    </div>
                );

            case 'json':
                const obj = value && typeof value === 'object' ? value : {};
                return (
                    <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        {Object.entries(obj).map(([k, v], idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                <InputText 
                                    value={k} 
                                    readOnly 
                                    className="col-span-4 !p-2 !text-xs !bg-gray-100 !rounded-lg !border !border-gray-200" 
                                />
                                <InputText 
                                    value={v} 
                                    onChange={(e) => handleValueChange(defId, { ...obj, [k]: e.target.value })}
                                    className="col-span-7 !p-2 !text-sm !bg-white !rounded-lg !border !border-gray-200 focus:!border-[#0B77A7]"
                                />
                                <button 
                                    onClick={() => {
                                        const newObj = { ...obj };
                                        delete newObj[k];
                                        handleValueChange(defId, newObj);
                                    }} 
                                    className="col-span-1 text-red-500 hover:text-red-700 transition-colors flex items-center justify-center"
                                >
                                    <FaTrash className="text-sm"/>
                                </button>
                            </div>
                        ))}
                        <Button 
                            label="Add Field" 
                            icon={<FaPlus className="mr-2 text-xs"/>} 
                            size="small" 
                            className="!bg-blue-50 !text-blue-600 !border-none !rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!bg-blue-100 transition-all" 
                            onClick={() => {
                                const k = prompt("Field Name:");
                                if(k) handleValueChange(defId, { ...obj, [k]: "" });
                            }}
                        />
                    </div>
                );

            default:
                return (
                    <div className="text-gray-400 text-sm bg-gray-50 p-3 rounded-xl border border-gray-200">
                        Unsupported Type
                    </div>
                );
        }
    };

    // Get data type color
    const getDataTypeColor = (dataType) => {
        const colors = {
            string: 'bg-blue-100 text-blue-700',
            number: 'bg-green-100 text-green-700',
            boolean: 'bg-purple-100 text-purple-700',
            enum: 'bg-amber-100 text-amber-700',
            array: 'bg-pink-100 text-pink-700',
            json: 'bg-indigo-100 text-indigo-700'
        };
        return colors[dataType] || 'bg-gray-100 text-gray-700';
    };

    // --- 5. Main Render ---
    return (
        <div className="max-w-6xl mx-auto pb-32 animate-fade-in">
            <Toast ref={toast} />

            {/* Header */}
            <div className="mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-[#0B77A7] mb-4 transition-colors font-semibold"
                >
                    <FaArrowLeft className="text-sm" /> Back to Product
                </button>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#212121] mb-2">
                            Product Attributes
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Configure dynamic specifications for Item ID: 
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg ml-2 font-semibold">
                                {id.slice(0,8)}...
                            </span>
                        </p>
                    </div>

                    {!loading && attributes.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white">
                            <FaTags style={{ color: color.primary }} />
                            <span className="text-sm font-bold text-[#212121]">
                                {attributes.length} Attributes
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Banner */}
            {!loading && attributes.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 text-lg mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                            Editing Product Attributes
                        </p>
                        <p className="text-xs text-blue-700">
                            Changes will be saved only when you click the "Save All" button. 
                            Modified fields are highlighted for your reference.
                        </p>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                            <Skeleton width="30%" height="1.5rem" className="mb-4" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                    ))}
                </div>
            ) : attributes.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                        <FaExclamationTriangle className="text-4xl" style={{ color: color.primary }} />
                    </div>
                    <h3 className="text-xl font-bold text-[#212121] mb-2">
                        No Configurable Attributes
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        This item type does not have any extra attributes defined. 
                        You can add attributes at the category or business level.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {attributes.map((attr) => (
                        <div 
                            key={attr.attributeDefinitionId} 
                            className={`bg-white rounded-2xl border transition-all ${
                                changedIds.has(attr.attributeDefinitionId)
                                    ? 'border-amber-200 shadow-lg shadow-amber-100/50'
                                    : 'border-gray-100 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-bold text-[#212121]">
                                                {attr.label}
                                            </h3>
                                            {changedIds.has(attr.attributeDefinitionId) && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                                                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                                                        Modified
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono font-semibold">
                                                {attr.key}
                                            </span>
                                            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${getDataTypeColor(attr.dataType)}`}>
                                                {attr.dataType}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                        <FaEdit />
                                    </div>
                                </div>

                                {/* Input Field */}
                                <div>
                                    {renderInput(attr)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sticky Action Bar */}
            {changedIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
                    <div className="max-w-6xl mx-auto px-4 pb-6">
                        <div className="rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ backgroundColor: color.primary }}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <FaCheckCircle className="text-white text-xl" />
                                </div>
                                <div className="text-white">
                                    <p className="font-bold text-lg">Unsaved Changes</p>
                                    <p className="text-sm text-white/80">
                                        {changedIds.size} attribute{changedIds.size !== 1 ? 's' : ''} modified
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={loadAttributes} 
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                                >
                                    <FaUndo className="text-xs" /> Reset All
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ color: color.primary }}
                                >
                                    {saving ? (
                                        <>
                                            <i className="pi pi-spin pi-spinner"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="text-xs" />
                                            Save All Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductAttributes;
