import { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost } from '../services/api';
import apiClient from '../services/api';
import { useBusiness } from '../context/BusinessContext';
// PrimeReact
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { TreeSelect } from 'primereact/treeselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { FaBox, FaSitemap, FaDollarSign, FaSave, FaUndo, FaKey, FaPlus, FaTimes, FaUpload, FaFileDownload, FaCloudUploadAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const AddItem = () => {
    const { businessId } = useBusiness();
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // --- Form State ---
    const [title, setTitle] = useState('');
    const [itemType, setItemType] = useState(null);
    const [description, setDescription] = useState('');
    const [metadata, setMetadata] = useState('');
    
    // Category State
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(null);


   // ye nyi add ki he abhisekh ki requirement pr 
//     const [purchasePrice, setPurchasePrice] = useState(null);
// const [isPurchaseGstIncluded, setIsPurchaseGstIncluded] = useState(false);
const [hsnSacCode, setHsnSacCode] = useState('');
    // Pricing State
    const [priceAmount, setPriceAmount] = useState(null);
    const [currency, setCurrency] = useState('INR');
    const [priceType, setPriceType] = useState('one_time');
const [taxMode, setTaxMode] = useState("exclusive");
    // Currency Options
const currencyOptions = [
    { label: 'Indian Rupee (INR)', value: 'INR' }
];

const getLocaleByCurrency = (currencyCode) => {
    switch (currencyCode) {
        case 'USD':
            return 'en-US';
        case 'INR':
        default:
            return 'en-IN';
    }
};

    // Digital Assets State
    const [digitalKeys, setDigitalKeys] = useState([]);
    const [currentKey, setCurrentKey] = useState('');
    const [createdItemId, setCreatedItemId] = useState(null);

    // Bulk Upload State
    const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
    const [bulkUploadType, setBulkUploadType] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
const [taxRate, setTaxRate] = useState(null);

const taxRateOptions = [
    { label: "5%", value: 5 },
    { label: "12%", value: 12 },
    { label: "18%", value: 18 },
    { label: "28%", value: 28 }
];
    // Options
    const itemTypes = [
        { label: 'Physical Product', value: 'physical' },
        { label: 'Digital Asset', value: 'digital' },
            // { label: 'Service', value: 'service' },  // ✅ Add this
    ];

 const priceTypes = [
    { label: 'One Time Payment', value: 'one_time' }
];

    // --- 1. Load Categories on Mount ---
    // useEffect(() => {
    //     if (businessId) loadCategories();
    // }, [businessId]);
    useEffect(() => {
    if (businessId) {
        loadCategories();
    }
}, [businessId]);
// ✅ Clear tax selection when item type changes

useEffect(() => {
    setTaxRate(null);
}, [itemType]);

    const loadCategories = async () => {
        try {
            const response = await apiGet(`/seller/business/${businessId}/categories`);
            if (response.data.success) {
                setCategories(transformToTree(response.data.data));
            }
        } catch (error) {
            console.error("Category Load Error", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
        }
    };
//  const loadTaxCodes = async () => {
//     try {
//         setLoadingTaxCodes(true);

//         const res = await apiGet(
//             `/tax/seller/business/${businessId}/tax/taxcodes`,
//             {
//                 page: 1,
//                 limit: 100,
//                 includeInactive: false
//             }
//         );

//         const taxList = res.data?.data || [];

//         setTaxCodeOptions(taxList);

//     } catch (error) {
//         console.error("Tax code fetch failed", error);
//         toast.current?.show({
//             severity: "error",
//             summary: "Error",
//             detail: "Unable to load tax codes"
//         });
//     } finally {
//         setLoadingTaxCodes(false);
//     }
// };

    const transformToTree = (nodes) => {
        return nodes.map(node => ({
            key: node.id,
            label: node.name,
            data: node,
            children: node.children ? transformToTree(node.children) : undefined
        }));
    };
// ✅ Filter tax codes based on selected item type
// const filteredTaxCodes = taxCodeOptions.filter(code => {
//     if (!itemType) return true;

//     if (itemType === "physical") {
//         return code.taxCategory === "goods";
//     }

//     if (itemType === "digital" || itemType === "service") {
//         return code.taxCategory === "service";
//     }

//     return true;
// });
    // --- Digital Keys Management ---
    const handleAddKey = () => {
        if (!currentKey.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Invalid Key', detail: 'Please enter a key' });
            return;
        }
        if (currentKey.trim().length < 5) {
            toast.current.show({ severity: 'warn', summary: 'Key Too Short', detail: 'Key must be at least 5 characters' });
            return;
        }
        if (digitalKeys.includes(currentKey.trim())) {
            toast.current.show({ severity: 'warn', summary: 'Duplicate Key', detail: 'This key already exists' });
            return;
        }
        setDigitalKeys([...digitalKeys, currentKey.trim()]);
        setCurrentKey('');
    };

    const handleRemoveKey = (keyToRemove) => {
        setDigitalKeys(digitalKeys.filter(key => key !== keyToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddKey();
        }
    };

    // --- Upload Digital Assets to Created Item ---
    const uploadDigitalAssets = async (itemId) => {
        if (digitalKeys.length === 0) return;

        try {
            const response = await apiPost(
                `/seller/business/${businessId}/items/${itemId}/assets/digital`,
                { keys: digitalKeys }
            );

            if (response.data.success) {
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Assets Added', 
                    detail: `${digitalKeys.length} digital keys uploaded successfully` 
                });
            }
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Asset Upload Failed', 
                detail: error.message || 'Could not upload digital assets' 
            });
        }
    };

    // --- Bulk Upload Functions ---
    const openBulkUploadDialog = (type) => {
        setBulkUploadType(type);
        setShowBulkUploadDialog(true);
    };

    const closeBulkUploadDialog = () => {
        setShowBulkUploadDialog(false);
        setBulkUploadType(null);
        setUploadProgress(0);
        setIsUploading(false);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const handleBulkUpload = async (event) => {
        const file = event.files[0];
        
        if (!file) {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'No File', 
                detail: 'Please select a file to upload' 
            });
            return;
        }

        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Invalid File', 
                detail: 'Please upload a CSV or Excel file' 
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const endpointPath = bulkUploadType === 'physical' 
                ? `/seller/business/${businessId}/items/physical/bulk/upload`
                : `/seller/business/${businessId}/items/digital/bulk/upload`;

            const baseURL = apiClient.defaults.baseURL.endsWith('/') 
                ? apiClient.defaults.baseURL.slice(0, -1) 
                : apiClient.defaults.baseURL;
            const fullEndpoint = `${baseURL}${endpointPath}`;

            console.log('🚀 Bulk Upload Details:');
            console.log('  - Type:', bulkUploadType);
            console.log('  - Business ID:', businessId);
            console.log('  - Full URL:', fullEndpoint);
            console.log('  - File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const blob = xhr.response;
                    const contentDisposition = xhr.getResponseHeader('Content-Disposition');
                    let filename = `bulk_upload_${bulkUploadType}_${Date.now()}.csv`;

                    if (contentDisposition) {
                        try {
                            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                            if (filenameMatch && filenameMatch[1]) {
                                filename = filenameMatch[1].replace(/['"]/g, '');
                            }
                        } catch (error) {
                            console.info('Using default filename due to CORS policy');
                        }
                    }

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Upload Complete', 
                        detail: 'Bulk upload processed. Check the downloaded result file for details.' 
                    });

                    closeBulkUploadDialog();
                } else {
                    let errorMessage = 'Bulk upload failed. Please try again.';
                    
                    if (xhr.response) {
                        try {
                            const reader = new FileReader();
                            reader.onload = () => {
                                try {
                                    const errorData = JSON.parse(reader.result);
                                    errorMessage = errorData.message || errorMessage;
                                } catch (e) {
                                    // If not JSON, use default message
                                }
                                toast.current.show({ 
                                    severity: 'error', 
                                    summary: `Upload Failed (${xhr.status})`, 
                                    detail: errorMessage 
                                });
                            };
                            reader.readAsText(xhr.response);
                        } catch (e) {
                            toast.current.show({ 
                                severity: 'error', 
                                summary: `Upload Failed (${xhr.status})`, 
                                detail: errorMessage 
                            });
                        }
                    } else {
                        toast.current.show({ 
                            severity: 'error', 
                            summary: `Upload Failed (${xhr.status})`, 
                            detail: errorMessage 
                        });
                    }
                    
                    setIsUploading(false);
                }
            });

            xhr.addEventListener('error', () => {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Network Error', 
                    detail: 'Could not connect to server. Please check your connection and try again.' 
                });
                setIsUploading(false);
            });

            xhr.responseType = 'blob';
            xhr.open('POST', fullEndpoint);
            
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.send(formData);

        } catch (error) {
            console.error('Bulk upload error:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Upload Failed', 
                detail: error.message || 'Could not upload file' 
            });
            setIsUploading(false);
        }
    };

    const downloadTemplate = (type) => {
        let csvContent = '';
        
        if (type === 'physical') {
            csvContent = 'title,description,price,currency,priceType,categoryId,metadata\n';
            csvContent += 'Sample Product,Sample description,99.99,INR,one_time,1,"{""weight"":""500g""}"\n';
        } else if (type === 'digital') {
            csvContent = 'title,description,price,currency,priceType,categoryId,digitalKeys,metadata\n';
            csvContent += 'Sample Digital Product,Sample description,49.99,INR,one_time,1,"KEY1,KEY2,KEY3","{""format"":""pdf""}"\n';
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_catalog_template.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.current.show({ 
            severity: 'info', 
            summary: 'Template Downloaded', 
            detail: `${type} catalog template downloaded successfully` 
        });
    };

    // --- 2. Handle Submission ---
    const handleSubmit = async () => {
      

        // if (itemType === 'digital' && digitalKeys.length === 0) {
        //     toast.current.show({ 
        //         severity: 'warn', 
        //         summary: 'Missing Digital Keys', 
        //         detail: 'Please add at least one digital key for digital items' 
        //     });
        //     return;
        // }
    
    // Replace karo ye line: abhishek kehen pr purches
        // if (!title || !itemType || !priceAmount || priceAmount <= 0 || !taxRate)
        
        
        
       // With:
if (!title || !itemType || !priceAmount || priceAmount <= 0 || !taxRate)  
        {
    toast.current.show({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Please fill in Title, Type, Price and Tax Rate.'
    });
    return;
}

        setLoading(true);

        try {
            let parsedMetadata = {};
            try {
                if (metadata) parsedMetadata = JSON.parse(metadata);
            } catch (e) {
                toast.current.show({ severity: 'error', summary: 'Invalid JSON', detail: 'Metadata must be valid JSON format' });
                setLoading(false);
                return;
            }


const payload = {
    title,
    itemType,
    taxRate,
    //  purchasePrice: Number(purchasePrice),           // ✅ Add
    // isPurchaseGstIncluded: isPurchaseGstIncluded,   // ✅ Add
    hsnSacCode: hsnSacCode || undefined,            // ✅ Add (optional)
    description: description || null,
    metadata: parsedMetadata || {},
    price: {
        amount: Number(priceAmount),
        currency: "INR",
        priceType: "one_time",
        taxMode: taxMode || "exclusive",
        metadata: {}
    }
};

// ✅ Only add categoryIds if category selected
if (selectedCategories) {
    payload.categoryIds = [selectedCategories];
} 
            const response = await apiPost(`/seller/business/${businessId}/items`, payload);

            if (response.data.success) {
                const newItemId = response.data.data?.item?.id;
                
                if (!newItemId) {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Item created but ID not found in response' 
                    });
                    setLoading(false);
                    return;
                }
                
                setCreatedItemId(newItemId);
                
                toast.current.show({ severity: 'success', summary: 'Created', detail: 'Item added successfully' });
                
                if (itemType === 'digital' && digitalKeys.length > 0) {
                    await uploadDigitalAssets(newItemId);
                }
                
                resetForm();
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Failed', detail: error.message || 'Could not create item' });
        } finally {
            setLoading(false);
        }
    };

 
    const resetForm = () => {
    setTitle('');
    setItemType(null);
    setDescription('');
    setMetadata('');
    setSelectedCategories(null);
    setPriceAmount(null);
    setPriceType('one_time');
    setCurrency('INR');
setTaxRate(null);
    setTaxMode('exclusive');
    setDigitalKeys([]);
    setCurrentKey('');
    setCreatedItemId(null);
//     setPurchasePrice(null);
// setIsPurchaseGstIncluded(false);
setHsnSacCode('');
};

    // --- 3. Render ---
    return (
        <div className="max-w-7xl mx-auto pb-20">
            <Toast ref={toast} />

            {/* ===== Premium Page Header ===== */}
            <div className="mb-8">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5">
                        {/* LEFT */}
                        <div>
                            <h1 className="text-2xl font-bold text-[#212121] tracking-tight">
                                Add New Product
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Create and publish a new product to your store
                            </p>
                        </div>

                        {/* RIGHT ACTIONS */}
                        <div className="flex items-center gap-3 whitespace-nowrap overflow-x-auto">
                            {/* Bulk Upload Buttons */}
                            <Button
                                label="Bulk Upload Physical"
                                icon={<FaCloudUploadAlt className="mr-2 text-xs" />}
                                onClick={() => openBulkUploadDialog('physical')}
                                className="!bg-blue-50 !text-[#0B77A7] !border-none !rounded-xl !px-4 !py-3 !text-xs !font-semibold hover:!bg-blue-100 hover:!scale-105 cursor-pointer active:!scale-95 transition-all shadow-sm"
                            />
                            
                            <Button
                                label="Bulk Upload Digital"
                                icon={<FaCloudUploadAlt className="mr-2 text-xs" />}
                                onClick={() => openBulkUploadDialog('digital')}
                                className="!bg-blue-50 !text-blue-600 !border-none !rounded-xl !px-4 !py-3 !text-xs !font-semibold hover:!bg-blue-100 hover:!scale-105 cursor-pointer1 active:!scale-95 transition-all shadow-sm"
                            />

                            <Button
                                label="Reset"
                                icon={<FaUndo className="mr-2 text-xs" />}
                                onClick={resetForm}
                                className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-5 !py-3 !text-xs !font-semibold hover:!bg-gray-200 hover:!scale-105 active:!scale-95 cursor-pointer transition-all"
                            />

                            <Button
                                label="Publish Product"
                                icon={<FaSave className="mr-2 text-xs" />}
                                loading={loading}
                                onClick={handleSubmit}
                                className="!bg-[#0B77A7] cursor-pointer !border-none !rounded-xl !px-6 !py-3 !text-xs !font-bold hover:!bg-[#0057ae] hover:!scale-105 active:!scale-95 transition-all shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Layout ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ================= LEFT ================= */}
                <div className="lg:col-span-8 space-y-6">
                    {/* ---- General Info ---- */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B77A7]">
                                <FaBox className="text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-[#212121]">
                                Product Information
                            </h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-[#212121] mb-2 block">
                                    Product Title <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Premium Wireless Headphones"
                                    className="w-full !p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm transition-all"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-bold text-[#212121] mb-2 block">
                                        Item Type <span className="text-red-500">*</span>
                                    </label>
                                    <Dropdown
                                        value={itemType}
                                        options={itemTypes}
                                        onChange={(e) => setItemType(e.value)}
                                        placeholder="Select product type"
                                        className="w-full"
                                        inputClassName="!p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-[#212121] mb-2 block">
                                    Description
                                </label>
                                <InputTextarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    placeholder="Describe your product in detail..."
                                    className="w-full !p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm transition-all"
                                />
                            </div>
                        </div>
                    </section>
{/* Purchase Price */}
{/* <div>
    <label className="text-sm font-bold text-[#212121] mb-2 block">
        Purchase Price <span className="text-red-500">*</span>
    </label>
    <InputNumber
        value={purchasePrice}
        onValueChange={(e) => setPurchasePrice(e.value ?? null)}
        mode="currency"
        currency={currency}
        locale={getLocaleByCurrency(currency)}
        min={0}
        className="w-full"
        inputClassName="!p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !text-sm font-bold"
        placeholder="Your cost price"
    />
</div> */}

{/* HSN/SAC Code */}
<div>
    <label className="text-xs font-semibold text-gray-600 mb-2 block">
        HSN/SAC Code <span className="text-gray-400">(Optional)</span>
    </label>
    <InputText
        value={hsnSacCode}
        onChange={(e) => setHsnSacCode(e.target.value)}
        placeholder="e.g. 99843"
        maxLength={50}
        className="w-full !p-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !text-sm"
    />
</div>

{/* Is Purchase GST Included */}
{/* <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
    <div>
        <p className="text-xs font-semibold text-[#212121]">Purchase GST Included?</p>
        <p className="text-xs text-gray-500 mt-0.5">Is GST already included in purchase price?</p>
    </div>
    <Dropdown
        value={isPurchaseGstIncluded}
        options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ]}
        onChange={(e) => setIsPurchaseGstIncluded(e.value)}
        className="w-24"
        inputClassName="!p-2 !rounded-xl !bg-white !border !border-gray-200 !text-sm !font-semibold"
    />
</div> */}
                    {/* ---- Digital Assets ---- */}
                    {/* {itemType === "digital" && ( */}
                     {false && itemType === "digital" && (   <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md">
                                    <FaKey className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#212121]">
                                        Digital Assets
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Add license keys for your digital product
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <InputText
                                        value={currentKey}
                                        onChange={(e) => setCurrentKey(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter license key (min 5 characters)"
                                        className="flex-1 !p-4 !rounded-xl !bg-white !border !border-blue-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 !text-sm"
                                    />
                                    <Button
                                        icon={<FaPlus />}
                                        onClick={handleAddKey}
                                        className="!bg-blue-500 !border-none !rounded-xl !w-12 !h-12 hover:!bg-blue-600 FaPlus hover:!scale-105 active:!scale-95 transition-all shadow-md"
                                    />
                                </div>

                                {digitalKeys.length > 0 && (
                                    <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-bold text-[#212121]">
                                                Added Keys ({digitalKeys.length})
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {digitalKeys.map((key, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={key}
                                                    removable
                                                    onRemove={() => handleRemoveKey(key)}
                                                    className="!bg-blue-100 !text-blue-700 cursor-pointer !font-semibold"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* ================= RIGHT ================= */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:self-start">
                    {/* ---- Pricing ---- */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FaDollarSign className="text-xl" />
        </div>
        <h3 className="text-lg font-bold text-[#212121]">
            Pricing
        </h3>
    </div>

    <div className="space-y-5">
        <div>
            <label className="text-sm font-bold text-[#212121] mb-2 block">
                Price <span className="text-red-500">*</span>
            </label>
            <InputNumber
                value={priceAmount}
                onValueChange={(e) => setPriceAmount(e.value ?? null)}
                mode="currency"
                currency={currency}
                locale={getLocaleByCurrency(currency)}
                min={0}
                className="w-full"
                inputClassName="!p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] text-xl font-bold !text-[#0B77A7]"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Currency
                </label>
                <Dropdown
                    value={currency}
                    options={currencyOptions}
                    onChange={(e) => setCurrency(e.value)}
                    className="w-full cursor-pointer"
                    inputClassName="!p-3 !rounded-xl  !bg-gray-50 !border !border-gray-200 !text-sm !font-semibold"
                />
            </div>

            <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Type
                </label>
                <Dropdown
                    value={priceType}
                    options={priceTypes}
                    onChange={(e) => setPriceType(e.value)}
                    className="w-full cursor-pointer"
                    inputClassName="!p-3 !rounded-xl !bg-gray-50 !border !border-gray-200 !text-sm !font-semibold"
                />
            </div>
        </div>
        {/* <div>
    <label className="text-xs font-semibold text-gray-600 mb-2 block">
        Tax Code <span className="text-red-500">*</span>
    </label>
  
<Dropdown
    value={taxCodeId}
options={filteredTaxCodes}    optionValue="id"
    loading={loadingTaxCodes}
    onChange={(e) => setTaxCodeId(e.value)}
    placeholder="Select tax code"
    emptyMessage="No tax codes found"
    className="w-full"
    panelClassName="max-w-[500px]"
    
    itemTemplate={(option) => (
        <div className="flex flex-col w-full">
            <span className="font-semibold text-sm truncate">
                {option.hsnSacCode} - {option.description}
            </span>
            <span className="text-xs text-gray-500">
                {option.taxCategory.toUpperCase()}
                {option.isExempt && " • EXEMPT"}
                {option.isZeroRated && " • ZERO RATED"}
            </span>
        </div>
    )}

    valueTemplate={(option) => {
        if (!option) return "Select tax code"
        return `${option.hsnSacCode} - ${option.description}`
    }}
/>
</div> */}
<div>
<label className="text-xs font-semibold text-gray-600 mb-2 block">
Tax Rate <span className="text-red-500">*</span>
</label>

<Dropdown
    value={taxRate}
    options={taxRateOptions}
    onChange={(e) => setTaxRate(e.value)}
    placeholder="Select tax rate"
    className="w-full"
    inputClassName="!p-3 !rounded-xl !bg-gray-50 !border !border-gray-200 !text-sm !font-semibold"
/>
</div>
<div>
    <label className="text-xs font-semibold text-gray-600 mb-2 block">
        Tax Mode
    </label>
    <Dropdown
        value={taxMode}
        options={[
            { label: "Exclusive (Tax Added on Top)", value: "exclusive" },
            { label: "Inclusive (Tax Included in Price)", value: "inclusive" }
        ]}
        onChange={(e) => setTaxMode(e.value)}
        className="w-full"
        inputClassName="!p-3 !rounded-xl !bg-gray-50 !border !border-gray-200 !text-sm !font-semibold"
    />
</div>
    </div>
</section>

                    {/* ---- Categories ---- */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FaSitemap className="text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-[#212121]">
                                Category
                            </h3>
                        </div>

                        <TreeSelect
                            value={selectedCategories}
                            options={categories}
                            onChange={(e) => setSelectedCategories(e.value)}
                            selectionMode="single"
                            placeholder="Select category"
                            className="w-full"
                            inputClassName="!p-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !text-sm"
                        />
                    </section>

                    {/* ---- Info Card ---- */}
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                        <div className="flex items-start gap-3">
                            <FaInfoCircle className="text-[#0B77A7] text-lg mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-[#212121] mb-1">
                                    Pro Tip
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Add detailed descriptions and high-quality images to increase your product visibility and sales.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* ===== Bulk Upload Dialog ===== */}
            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center">
                            <FaCloudUploadAlt className="text-[#0B77A7]" />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">
                            Bulk Upload {bulkUploadType === 'physical' ? 'Physical' : 'Digital'} Catalog
                        </span>
                    </div>
                }
                visible={showBulkUploadDialog}
                onHide={closeBulkUploadDialog}
                style={{ width: '600px' }}
                className="bulk-upload-dialog"
            >
                <div className="space-y-6 pt-4">
                    {/* Instructions */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <FaInfoCircle className="text-[#0B77A7] text-lg mt-0.5" />
                            <h4 className="font-bold text-[#212121]">Instructions</h4>
                        </div>
                        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-7">
                            <li>Download the template file below</li>
                            <li>Fill in your product data following the template format</li>
                            <li>Upload the completed CSV or Excel file</li>
                            <li>Review the results file after processing</li>
                        </ol>
                    </div>

                    {/* Download Template Button */}
                    <Button
                        label="Download Template"
                        icon={<FaFileDownload className="mr-2" />}
                        onClick={() => downloadTemplate(bulkUploadType)}
                        className="w-full !bg-blue-500 !border-none !rounded-xl !py-3 !font-bold hover:!bg-blue-600 hover:!scale-105 active:!scale-95 transition-all shadow-md"
                    />

                    <Divider />

                    {/* File Upload */}
                    <div>
                        <label className="text-sm font-bold text-[#212121] mb-3 block">
                            Upload File (CSV or Excel)
                        </label>
                        <FileUpload
                            ref={fileUploadRef}
                            name="file"
                            accept=".csv,.xlsx,.xls"
                            maxFileSize={10000000}
                            customUpload
                            uploadHandler={handleBulkUpload}
                            disabled={isUploading}
                            chooseLabel="Choose File"
                            uploadLabel="Upload"
                            cancelLabel="Clear"
                            className="w-full"
                        />
                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[#212121]">
                                Upload Progress
                            </label>
                            <ProgressBar 
                                value={uploadProgress} 
                                className="!h-3 !rounded-full"
                                color="#0B77A7"
                            />
                            <p className="text-xs text-gray-500 text-center font-semibold">
                                {uploadProgress}% complete
                            </p>
                        </div>
                    )}
                    {/* Notes */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-blue-600 text-lg mt-0.5" />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                <strong className="font-bold">Note:</strong> Each row will be validated independently. 
                                Valid rows will be inserted successfully, while invalid rows will be 
                                reported in the result file with error details.
                            </p>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AddItem;
