import { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useBusiness } from '../context/BusinessContext'; 
// PrimeReact & Icons
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tree } from 'primereact/tree';
import { Skeleton } from 'primereact/skeleton';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Chips } from 'primereact/chips';
import { FaSearch, FaBox, FaSitemap, FaCheck, FaSave, FaArrowLeft, FaPlus, FaTimes, FaTrash, FaLayerGroup, FaTags } from 'react-icons/fa';

const color = {
  primary: '#0B77A7',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const CategoryManager = () => {
    const { businessId } = useBusiness();
    const toast = useRef(null);

    // --- State ---
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [productsLoading, setProductsLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(null);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- Create Category Dialog State ---
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [creating, setCreating] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    //abhishek e remove krne ka bola he 
    // const [parentCategoryId, setParentCategoryId] = useState(null);

    // --- Create Attributes Dialog State ---
    const [showCreateAttributesDialog, setShowCreateAttributesDialog] = useState(false);
    const [creatingAttributes, setCreatingAttributes] = useState(false);
    const [attributeScope, setAttributeScope] = useState('business');
    const [selectedCategoryForAttribute, setSelectedCategoryForAttribute] = useState(null);
    const [newAttributes, setNewAttributes] = useState([]);

    // --- 1. Load Products (Left Panel) ---
    useEffect(() => {
        if (businessId) fetchProducts();
    }, [businessId]);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const response = await apiGet(`/seller/business/${businessId}/products`, { limit: 50 });
            if (response.data.success) {
                setProducts(response.data.data.rows);
            }
        } catch (error) {
            console.error(error); 
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
        } finally {
            setProductsLoading(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(productSearch.toLowerCase())
    );

    // --- 2. Load Categories (Right Panel) ---
    useEffect(() => {
        if (businessId) {
            fetchAllCategories();
        }
    }, [businessId]);

    const fetchAllCategories = async () => {
        try {
            const res = await apiGet(`/seller/business/${businessId}/categories`);
            if (res.data.success) {
                setCategories(transformToTreeNodes(res.data.data));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchCategoriesAndSelection = async () => {
        setCategoriesLoading(true);
        try {
            const catResponse = await apiGet(`/seller/business/${businessId}/categories`);
            const productResponse = await apiGet(`/seller/business/${businessId}/products/${selectedProduct.id}`);
            
            if (catResponse.data.success) {
                const treeNodes = transformToTreeNodes(catResponse.data.data);
                setCategories(treeNodes);

                if (productResponse.data.success) {
                    const attachedCats = productResponse.data.data.Categories || [];
                    const selectionMap = {};
                    attachedCats.forEach(cat => {
                        selectionMap[cat.id] = { checked: true, partialChecked: false };
                    });
                    setSelectedKeys(selectionMap);
                }
            }
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load category data' });
        } finally {
            setCategoriesLoading(false);
        }
    };

    const transformToTreeNodes = (nodes) => {
        return nodes.map(node => ({
            key: node.id,
            label: node.name,
            data: node,
            children: node.children && node.children.length > 0 ? transformToTreeNodes(node.children) : undefined,
            icon: 'pi pi-fw pi-folder'
        }));
    };

    const flattenCategories = (nodes, level = 0) => {
        let result = [];
        nodes.forEach(node => {
            result.push({
                id: node.data.id,
                name: '—'.repeat(level) + ' ' + node.data.name,
                level
            });
            if (node.children) {
                result = result.concat(flattenCategories(node.children, level + 1));
            }
        });
        return result;
    };

    // --- 3. Create Category Logic ---
    const handleOpenCreateDialog = () => {
        setCategoryName('');
    
    
    //remove krne ka bola he abhishek ne 
        // setParentCategoryId(null);
        setShowCreateDialog(true);
    };

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Validation', detail: 'Category name is required' });
            return;
        }

        setCreating(true);
        try {
            const payload = {
                name: categoryName.trim(),
                // parentId: parentCategoryId || null
            };

            await apiPost(`/seller/business/${businessId}/category`, payload);

            toast.current.show({ 
                severity: 'success', 
                summary: 'Success', 
                detail: `Category "${categoryName}" created successfully` 
            });

            setShowCreateDialog(false);
            
            if (selectedProduct) {
                fetchCategoriesAndSelection();
            }
        } catch (error) {
            console.error(error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Failed', 
                detail: error.response?.data?.message || 'Failed to create category' 
            });
        } finally {
            setCreating(false);
        }
    };

    // --- Create Attributes Logic ---
    const handleOpenCreateAttributesDialog = () => {
        setAttributeScope('business');
        setSelectedCategoryForAttribute(null);
        setNewAttributes([]);
        setShowCreateAttributesDialog(true);
    };

    const handleAddNewAttribute = () => {
        setNewAttributes([...newAttributes, {
            label: '',
            dataType: 'string',
            options: [],
            isSelectable: true,
            allowsMultiple: false,
            isRequiredInCart: false,
            isRequiredInOrder: false,
            isPublic: true,
            isFilterable: true
        }]);
    };

    const handleRemoveNewAttribute = (index) => {
        setNewAttributes(newAttributes.filter((_, i) => i !== index));
    };

    const handleNewAttributeChange = (index, field, value) => {
        const updated = [...newAttributes];
        updated[index][field] = value;
        setNewAttributes(updated);
    };

    const handleCreateAttributes = async () => {
        if (newAttributes.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Validation', detail: 'Please add at least one attribute' });
            return;
        }

        if (attributeScope === 'category' && !selectedCategoryForAttribute) {
            toast.current.show({ severity: 'warn', summary: 'Validation', detail: 'Please select a category' });
            return;
        }

        for (let i = 0; i < newAttributes.length; i++) {
            const attr = newAttributes[i];
            if (!attr.label) {
                toast.current.show({ 
                    severity: 'warn', 
                    summary: 'Validation', 
                    detail: `Attribute #${i + 1}: Label is required` 
                });
                return;
            }
            if ((attr.dataType === 'enum' || attr.dataType === 'array') && (!attr.options || attr.options.length === 0)) {
                toast.current.show({ 
                    severity: 'warn', 
                    summary: 'Validation', 
                    detail: `Attribute "${attr.label}": Options are required for ${attr.dataType} type` 
                });
                return;
            }
        }

        setCreatingAttributes(true);
        try {
            const payload = {
                scope: attributeScope,
                attributes: newAttributes.map(attr => ({
                    label: attr.label,
                    dataType: attr.dataType,
                    ...(attr.dataType === 'enum' || attr.dataType === 'array' ? { options: attr.options } : {}),
                    isSelectable: attr.isSelectable,
                    allowsMultiple: attr.allowsMultiple,
                    isRequiredInCart: attr.isRequiredInCart,
                    isRequiredInOrder: attr.isRequiredInOrder,
                    isPublic: attr.isPublic,
                    isFilterable: attr.isFilterable
                }))
            };

            if (attributeScope === 'category') {
                payload.categoryId = selectedCategoryForAttribute;
            }

            const response = await apiPost(`/seller/business/${businessId}/create/attributes`, payload);

            toast.current.show({ 
                severity: 'success', 
                summary: 'Success', 
                detail: response.data.message || 'Attributes created successfully' 
            });

            setShowCreateAttributesDialog(false);
            
        } catch (error) {
            console.error(error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Failed', 
                detail: error.response?.data?.message || 'Failed to create attributes' 
            });
        } finally {
            setCreatingAttributes(false);
        }
    };

    // --- 4. Save Logic ---
    const handleSaveCategories = async () => {
        if (!selectedProduct) return;
        setSaving(true);

        try {
            const categoryIds = Object.keys(selectedKeys).filter(key => selectedKeys[key].checked);

            await apiPost(`/seller/business/items/${selectedProduct.id}/categories`, { categoryIds });

            toast.current.show({ severity: 'success', summary: 'Saved', detail: `Categories updated for ${selectedProduct.title}` });
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Failed', detail: error.message });
        } finally {
            setSaving(false);
        }
    };

    // --- 5. Render ---
    const scopeOptions = [
        { label: 'Business Level', value: 'business' },
        { label: 'Category Level', value: 'category' }
    ];

    return (
        <div className="animate-fade-in max-w-[1600px] mx-auto pb-12">
            <Toast ref={toast} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#212121]">Category Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">Assign and organize products into categories</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        label="Create Attributes" 
                        icon={<FaTags className="mr-2 text-xs"/>} 
                        className="!bg-blue-50 !text-blue-600 !border-none !px-5 !py-3 !rounded-xl !font-semibold !text-sm hover:!bg-blue-100 hover:!scale-105 active:!scale-95 transition-all shadow-sm"
                        onClick={handleOpenCreateAttributesDialog}
                    />
                    <Button 
                        label="Create Category" 
                        icon={<FaPlus className="mr-2 text-xs"/>} 
                        style={{ backgroundColor: color.primary, borderColor: color.primary }}
                        className="!border-none !px-6 !py-3 !rounded-xl !font-semibold !text-sm hover:!scale-105 active:!scale-95 transition-all shadow-lg"
                        onClick={handleOpenCreateDialog}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                
                {/* Left Panel: Product Selector */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center" style={{ color: color.primary }}>
                                <FaBox className="text-lg"/>
                            </div>
                            <h3 className="font-bold text-[#212121]">Select Product</h3>
                        </div>
                        <div className="relative">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <InputText 
                                value={productSearch} 
                                onChange={(e) => setProductSearch(e.target.value)} 
                                placeholder="Search products..." 
                                className="w-full !pl-10 !pr-4 !py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {productsLoading ? (
                            [1,2,3,4,5].map(i => <Skeleton key={i} height="60px" className="!rounded-xl" />)
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">No products found</div>
                        ) : (
                            filteredProducts.map(prod => (
                                <div 
                                    key={prod.id}
                                    onClick={() => setSelectedProduct(prod)}
                                    style={selectedProduct?.id === prod.id ? { 
                                        backgroundColor: color.primary,
                                        borderColor: color.primary 
                                    } : {}}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center justify-between group ${
                                        selectedProduct?.id === prod.id 
                                            ? 'text-white shadow-lg' 
                                            : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedProduct?.id === prod.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                                            {prod.media?.[0]?.url ? (
                                                <img src={prod.media[0].url} className="w-full h-full object-contain p-1.5 rounded-lg" />
                                            ) : (
                                                <FaBox className={selectedProduct?.id === prod.id ? 'text-white/70' : 'text-gray-400'} />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-sm truncate">{prod.title}</p>
                                            <p className={`text-xs truncate mt-0.5 ${selectedProduct?.id === prod.id ? 'text-white/70' : 'text-gray-500'}`}>
                                                ID: {prod.id.slice(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                    {selectedProduct?.id === prod.id && (
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                            <FaCheck className="text-white text-xs" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Category Tree */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
                    
                    {!selectedProduct ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-4" style={{ color: color.primary }}>
                                <FaArrowLeft className="text-3xl animate-pulse" />
                            </div>
                            <p className="font-semibold text-gray-600">Select a product to manage categories</p>
                            <p className="text-sm text-gray-400 mt-1">Choose a product from the left panel</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FaSitemap className="text-lg"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#212121]">Category Tree</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Managing: <span className="font-semibold" style={{ color: color.primary }}>{selectedProduct.title}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                    <FaLayerGroup className="text-xs" />
                                    <span className="text-xs font-bold">
                                        {selectedKeys ? Object.keys(selectedKeys).length : 0} Selected
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {categoriesLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton width="40%" height="2.5rem" className="!rounded-xl" />
                                        <Skeleton width="60%" height="2.5rem" className="ml-8 !rounded-xl" />
                                        <Skeleton width="50%" height="2.5rem" className="ml-8 !rounded-xl" />
                                        <Skeleton width="40%" height="2.5rem" className="!rounded-xl" />
                                    </div>
                                ) : (
                                    <Tree 
                                        value={categories} 
                                        selectionMode="checkbox" 
                                        selectionKeys={selectedKeys} 
                                        onSelectionChange={(e) => setSelectedKeys(e.value)} 
                                        className="w-full border-none p-0"
                                        filter 
                                        filterMode="lenient" 
                                        filterPlaceholder="Filter categories..."
                                    />
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button 
                                    label="Clear Selection" 
                                    className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!bg-gray-200 transition-all" 
                                    onClick={() => setSelectedKeys(null)}
                                />
                                <Button 
                                    label={saving ? "Saving..." : "Save Categories"} 
                                    icon={saving ? "pi pi-spin pi-spinner" : <FaSave className="mr-2 text-xs"/>} 
                                    style={{ backgroundColor: color.primary, borderColor: color.primary }}
                                    className="!border-none !px-6 !py-3 !rounded-xl !font-bold !text-sm hover:!scale-105 active:!scale-95 transition-all shadow-lg"
                                    onClick={handleSaveCategories}
                                    disabled={saving}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Create Category Dialog */}
            <Dialog 
                visible={showCreateDialog} 
                onHide={() => setShowCreateDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                            <FaPlus />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">Create New Category</span>
                    </div>
                }
                style={{ width: '540px' }}
                className="!rounded-2xl"
                draggable={false}
                dismissableMask
            >
                <div className="space-y-5 pt-4">
                    <div>
                        <label className="block text-sm font-bold text-[#212121] mb-2">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <InputText 
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="e.g., Electronics, Clothing, Furniture"
                            className="w-full !py-3.5 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-bold text-[#212121] mb-2">
                            Parent Category <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                        </label>
                        <Dropdown 
                            value={parentCategoryId}
                            onChange={(e) => setParentCategoryId(e.value)}
                            options={[
                                { id: null, name: '— No Parent (Root Category) —' },
                                ...flattenCategories(categories)
                            ]}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select parent category"
                            className="w-full"
                            inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 !py-3"
                        />
                    </div> */}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            label="Cancel"
                            className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-5 !py-3 !font-semibold hover:!bg-gray-200 transition-all"
                            onClick={() => setShowCreateDialog(false)}
                            disabled={creating}
                        />
                        <Button 
                            label={creating ? "Creating..." : "Create Category"}
                            icon={creating ? "pi pi-spin pi-spinner" : <FaPlus className="mr-2 text-xs"/>}
                            style={{ backgroundColor: color.primary, borderColor: color.primary }}
                            className="!border-none !px-6 !py-3 !rounded-xl !font-bold hover:!scale-105 active:!scale-95 transition-all shadow-lg"
                            onClick={handleCreateCategory}
                            disabled={creating}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Create Attributes Dialog */}
            <Dialog 
                visible={showCreateAttributesDialog} 
                onHide={() => setShowCreateAttributesDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaTags />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">Create Product Attributes</span>
                    </div>
                }
                style={{ width: '800px', maxHeight: '90vh' }}
                className="!rounded-2xl"
                draggable={false}
                dismissableMask
            >
                <div className="space-y-5 pt-4">
                    {/* Scope Selection */}
                    <div>
                        <label className="block text-sm font-bold text-[#212121] mb-2">
                            Attribute Scope <span className="text-red-500">*</span>
                        </label>
                        <Dropdown 
                            value={attributeScope}
                            onChange={(e) => {
                                setAttributeScope(e.value);
                                if (e.value === 'business') {
                                    setSelectedCategoryForAttribute(null);
                                }
                            }}
                            options={scopeOptions}
                            className="w-full"
                            inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 !py-3"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {attributeScope === 'business' 
                                ? '✓ Available for all products in your business' 
                                : '✓ Specific to a selected category'}
                        </p>
                    </div>

                    {/* Category Selection */}
                    {attributeScope === 'category' && (
                        <div>
                            <label className="block text-sm font-bold text-[#212121] mb-2">
                                Select Category <span className="text-red-500">*</span>
                            </label>
                            <Dropdown 
                                value={selectedCategoryForAttribute}
                                onChange={(e) => setSelectedCategoryForAttribute(e.value)}
                                options={flattenCategories(categories)}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Choose a category"
                                className="w-full"
                                inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 !py-3"
                            />
                        </div>
                    )}

                    {/* Attributes Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold text-[#212121]">
                                Attributes <span className="text-red-500">*</span>
                            </label>
                            <Button 
                                label="Add Attribute"
                                icon={<FaPlus className="mr-2 text-xs"/>}
                                className="!bg-blue-50 !text-blue-600 !border-none !px-4 !py-2 !rounded-xl !text-xs !font-semibold hover:!bg-blue-100 transition-all"
                                onClick={handleAddNewAttribute}
                            />
                        </div>

                        {newAttributes.length === 0 ? (
                            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                                <FaTags className="text-4xl text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 font-medium">No attributes added yet</p>
                                <p className="text-xs text-gray-400 mt-1">Click "Add Attribute" to start</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {newAttributes.map((attr, index) => (
                                    <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 space-y-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                                Attribute #{index + 1}
                                            </span>
                                            <Button 
                                                icon={<FaTrash className="text-xs"/>}
                                                className="!bg-red-50 !text-red-500 !border-none !p-2 hover:!bg-red-100 !rounded-lg transition-all"
                                                onClick={() => handleRemoveNewAttribute(index)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#212121] mb-2">Label *</label>
                                            <InputText 
                                                value={attr.label}
                                                onChange={(e) => handleNewAttributeChange(index, 'label', e.target.value)}
                                                placeholder="e.g., Color, Size, Material"
                                                className="w-full !py-3 !text-sm !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#212121] mb-2">Data Type *</label>
                                            <Dropdown 
                                                value={attr.dataType}
                                                onChange={(e) => handleNewAttributeChange(index, 'dataType', e.value)}
                                                options={[
                                                    { label: 'String', value: 'string' },
                                                    { label: 'Number', value: 'number' },
                                                    { label: 'Boolean', value: 'boolean' },
                                                    { label: 'Enum (Dropdown)', value: 'enum' },
                                                    { label: 'Array (Multi-select)', value: 'array' },
                                                    { label: 'JSON', value: 'json' }
                                                ]}


                                                // agr changes krna he  to 2 hi rkahna he to 
// options={[
//     { label: 'String', value: 'string' },
//     { label: 'JSON', value: 'json' }
//     // Removed: number, boolean, enum, array
// ]}

                                                className="w-full"
                                                inputClassName="!text-sm !rounded-xl !bg-white !border !border-gray-200 !py-2.5"
                                            />
                                        </div>

                                        {(attr.dataType === 'enum' || attr.dataType === 'array') && (
                                            <div>
                                                <label className="block text-xs font-bold text-[#212121] mb-2">Options *</label>
                                                <Chips 
                                                    value={attr.options}
                                                    onChange={(e) => handleNewAttributeChange(index, 'options', e.value)}
                                                    placeholder="Type and press Enter"
                                                    className="w-full !text-sm"
                                                    separator=","
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Press Enter after each option</p>
                                            </div>
                                        )}
 
 {/* ye nya code he agr do chaiye to nya code he */}
{/* Options field hidden — enum & array types removed */}
{/* {(attr.dataType === 'enum' || attr.dataType === 'array') && (
    <div>
        <label className="block text-xs font-bold text-[#212121] mb-2">Options *</label>
        <Chips 
            value={attr.options}
            onChange={(e) => handleNewAttributeChange(index, 'options', e.value)}
            placeholder="Type and press Enter"
            className="w-full !text-sm"
            separator=","
        />
        <p className="text-xs text-gray-500 mt-2">Press Enter after each option</p>
    </div>
)} */}

                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    inputId={`selectable-${index}`}
                                                    checked={attr.isSelectable}
                                                    onChange={(e) => handleNewAttributeChange(index, 'isSelectable', e.checked)}
                                                />
                                                <label htmlFor={`selectable-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Selectable</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    inputId={`allows-multiple-${index}`}
                                                    checked={attr.allowsMultiple}
                                                    onChange={(e) => handleNewAttributeChange(index, 'allowsMultiple', e.checked)}
                                                />
                                                <label htmlFor={`allows-multiple-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Allows Multiple</label>
                                            </div>
                                            <div className="flex items-center gap-2">

 {/* // ye code he remove krne ka ye nya code he */}
 {/* <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200"> */}
    {/* Selectable & Allows Multiple hidden for now */}
    {/* <div className="flex items-center gap-2">
        <Checkbox 
            inputId={`selectable-${index}`}
            checked={attr.isSelectable}
            onChange={(e) => handleNewAttributeChange(index, 'isSelectable', e.checked)}
        />
        <label htmlFor={`selectable-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Selectable</label>
    </div>
    <div className="flex items-center gap-2">
        <Checkbox 
            inputId={`allows-multiple-${index}`}
            checked={attr.allowsMultiple}
            onChange={(e) => handleNewAttributeChange(index, 'allowsMultiple', e.checked)}
        />
        <label htmlFor={`allows-multiple-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Allows Multiple</label>
    </div> */}
    {/* <div className="flex items-center gap-2"> */}



                                                <Checkbox 
                                                    inputId={`required-cart-${index}`}
                                                    checked={attr.isRequiredInCart}
                                                    onChange={(e) => handleNewAttributeChange(index, 'isRequiredInCart', e.checked)}
                                                />
                                                <label htmlFor={`required-cart-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Required in Cart</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    inputId={`required-order-${index}`}
                                                    checked={attr.isRequiredInOrder}
                                                    onChange={(e) => handleNewAttributeChange(index, 'isRequiredInOrder', e.checked)}
                                                />
                                                <label htmlFor={`required-order-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Required in Order</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    inputId={`new-public-${index}`}
                                                    checked={attr.isPublic}
                                                    onChange={(e) => handleNewAttributeChange(index, 'isPublic', e.checked)}
                                                />
                                                <label htmlFor={`new-public-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Public</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    inputId={`new-filterable-${index}`}
                                                    checked={attr.isFilterable}
                                                    onChange={(e) => handleNewAttributeChange(index, 'isFilterable', e.checked)}
                                                />
                                                <label htmlFor={`new-filterable-${index}`} className="text-xs font-medium text-gray-700 cursor-pointer">Filterable</label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            label="Cancel"
                            className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-5 !py-3 !font-semibold hover:!bg-gray-200 transition-all"
                            onClick={() => setShowCreateAttributesDialog(false)}
                            disabled={creatingAttributes}
                        />
                        <Button 
                            label={creatingAttributes ? "Creating..." : "Create Attributes"}
                            icon={creatingAttributes ? "pi pi-spin pi-spinner" : <FaPlus className="mr-2 text-xs"/>}
                            className="!bg-blue-600 !border-none !rounded-xl !px-6 !py-3 !font-bold hover:!bg-blue-700 hover:!scale-105 active:!scale-95 transition-all shadow-lg"
                            onClick={handleCreateAttributes}
                            disabled={creatingAttributes}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default CategoryManager;



//// import { useState, useEffect, useRef } from 'react';
// import { apiGet, apiPost } from '../services/api';
// import { useBusiness } from '../context/BusinessContext';

// // PrimeReact & Icons
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Toast } from 'primereact/toast';
// import { Tree } from 'primereact/tree'; // PrimeReact's powerful Tree component
// import { Skeleton } from 'primereact/skeleton';
// import { FaSearch, FaBox, FaSitemap, FaCheck, FaSave, FaArrowRight,FaArrowLeft  } from 'react-icons/fa';

// const CategoryManager = () => {
//     const { businessId } = useBusiness();
//     const toast = useRef(null);

//     // --- State ---
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [productSearch, setProductSearch] = useState('');
//     const [productsLoading, setProductsLoading] = useState(false);

//     const [categories, setCategories] = useState([]);
//     const [selectedKeys, setSelectedKeys] = useState(null); // PrimeReact Tree selection format
//     const [categoriesLoading, setCategoriesLoading] = useState(false);
//     const [saving, setSaving] = useState(false);

//     // --- 1. Load Products (Left Panel) ---
//     useEffect(() => {
//         if (businessId) fetchProducts();
//     }, [businessId]);

//     const fetchProducts = async () => {
//         setProductsLoading(true);
//         try {
//             const response = await apiGet(`/seller/business/${businessId}/products`, { limit: 50 });
//             if (response.data.success) {
//                 setProducts(response.data.data.rows);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
//         } finally {
//             setProductsLoading(false);
//         }
//     };

//     // Filter products based on search
//     const filteredProducts = products.filter(p => 
//         p.title.toLowerCase().includes(productSearch.toLowerCase())
//     );

//     // --- 2. Load Categories (Right Panel) ---
//     // Triggered when a product is selected
//     useEffect(() => {
//         if (selectedProduct) {
//             fetchCategoriesAndSelection();
//         } else {
//             setCategories([]);
//             setSelectedKeys(null);
//         }
//     }, [selectedProduct]);

//     const fetchCategoriesAndSelection = async () => {
//         setCategoriesLoading(true);
//         try {
//             // A. Fetch All Available Categories for this Business
//             const catResponse = await apiGet(`/seller/business/${businessId}/categories`);
            
//             // B. Fetch Currently Attached Categories for the selected Product
//             // Assuming endpoint returns list of category IDs attached to item
//             // Adjust endpoint if needed: e.g., GET /items/:id (and extract categories)
//             const productResponse = await apiGet(`/seller/business/${businessId}/products/${selectedProduct.id}`);
            
//             if (catResponse.data.success) {
//                 const treeNodes = transformToTreeNodes(catResponse.data.data);
//                 setCategories(treeNodes);

//                 // Map currently attached categories to selection keys
//                 if (productResponse.data.success) {
//                     const attachedCats = productResponse.data.data.Categories || [];
//                     const selectionMap = {};
//                     attachedCats.forEach(cat => {
//                         selectionMap[cat.id] = { checked: true, partialChecked: false };
//                     });
//                     setSelectedKeys(selectionMap);
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//             toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load category data' });
//         } finally {
//             setCategoriesLoading(false);
//         }
//     };

//     // Helper: Convert Backend Data to PrimeReact TreeNodes
//     const transformToTreeNodes = (nodes) => {
//         return nodes.map(node => ({
//             key: node.id,
//             label: node.name,
//             data: node, // Keep raw data if needed
//             children: node.children && node.children.length > 0 ? transformToTreeNodes(node.children) : undefined,
//             icon: 'pi pi-fw pi-folder' // PrimeIcon class
//         }));
//     };

//     // --- 3. Save Logic ---
//     const handleSaveCategories = async () => {
//         if (!selectedProduct) return;
//         setSaving(true);

//         try {
//             // Extract IDs from PrimeReact selection object
//             // Format: { "id1": { checked: true }, "id2": { checked: true } }
//             const categoryIds = Object.keys(selectedKeys).filter(key => selectedKeys[key].checked);

//             await apiPost(`/seller/business/items/${selectedProduct.id}/categories`, { categoryIds });

//             toast.current.show({ severity: 'success', summary: 'Saved', detail: `Categories updated for ${selectedProduct.title}` });
//         } catch (error) {
//             console.error(error);
//             toast.current.show({ severity: 'error', summary: 'Failed', detail: error.message });
//         } finally {
//             setSaving(false);
//         }
//     };

//     // --- 4. Render ---
//     return (
//         <div className="animate-fade-in max-w-[1600px] mx-auto pb-12 px-4 mt-6">
//             <Toast ref={toast} />

//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-[#1a1a2e] font-playfair">Category Manager</h1>
//                     <p className="text-gray-500 text-sm">Assign and organize products into categories.</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[600px]">
                
//                 {/* --- Left Panel: Product Selector --- */}
//                 <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="p-6 border-b border-gray-100 bg-gray-50/50">
//                         <h3 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
//                             <FaBox className="text-indigo-500"/> Select Product
//                         </h3>
//                         <div className="relative">
//                             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                             <InputText 
//                                 value={productSearch} 
//                                 onChange={(e) => setProductSearch(e.target.value)} 
//                                 placeholder="Search products..." 
//                                 className="w-full !pl-9 !py-2.5 !rounded-xl !border-gray-200 focus:!border-indigo-500 !text-sm"
//                             />
//                         </div>
//                     </div>

//                     {/* Product List */}
//                     <div className="flex-1 overflow-y-auto p-4 space-y-2">
//                         {productsLoading ? (
//                             [1,2,3,4,5].map(i => <Skeleton key={i} height="60px" className="!rounded-xl" />)
//                         ) : filteredProducts.length === 0 ? (
//                             <div className="text-center py-10 text-gray-400 text-sm">No products found</div>
//                         ) : (
//                             filteredProducts.map(prod => (
//                                 <div 
//                                     key={prod.id}
//                                     onClick={() => setSelectedProduct(prod)}
//                                     className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center justify-between group ${
//                                         selectedProduct?.id === prod.id 
//                                             ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-md' 
//                                             : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-700'
//                                     }`}
//                                 >
//                                     <div className="flex items-center gap-3 overflow-hidden">
//                                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedProduct?.id === prod.id ? 'bg-white/10' : 'bg-gray-100'}`}>
//                                             {prod.media?.[0]?.url ? (
//                                                 <img src={prod.media[0].url} className="w-full h-full object-contain p-1" />
//                                             ) : (
//                                                 <FaBox className={selectedProduct?.id === prod.id ? 'text-white/50' : 'text-gray-400'} />
//                                             )}
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="font-bold text-sm truncate">{prod.title}</p>
//                                             <p className={`text-xs truncate ${selectedProduct?.id === prod.id ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 ID: {prod.id.slice(0, 6)}...
//                                             </p>
//                                         </div>
//                                     </div>
//                                     {selectedProduct?.id === prod.id && <FaCheck className="text-green-400" />}
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>

//                 {/* --- Right Panel: Category Tree --- */}
//                 <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
                    
//                     {!selectedProduct ? (
//                         /* Empty State */
//                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//                             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                                 <FaArrowLeft className="text-3xl text-gray-300 animate-pulse" />
//                             </div>
//                             <p className="font-medium">Select a product from the left to manage categories</p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Header */}
//                             <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                                 <div>
//                                     <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2">
//                                         <FaSitemap className="text-blue-500"/> Category Tree
//                                     </h3>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         Managing categories for: <span className="font-bold text-indigo-600">{selectedProduct.title}</span>
//                                     </p>
//                                 </div>
//                                 <div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full">
//                                     {selectedKeys ? Object.keys(selectedKeys).length : 0} Selected
//                                 </div>
//                             </div>

//                             {/* Tree Content */}
//                             <div className="flex-1 overflow-y-auto p-6">
//                                 {categoriesLoading ? (
//                                     <div className="space-y-3">
//                                         <Skeleton width="40%" height="2rem" />
//                                         <Skeleton width="60%" height="2rem" className="ml-8" />
//                                         <Skeleton width="50%" height="2rem" className="ml-8" />
//                                         <Skeleton width="40%" height="2rem" />
//                                     </div>
//                                 ) : (
//                                     <Tree 
//                                         value={categories} 
//                                         selectionMode="checkbox" 
//                                         selectionKeys={selectedKeys} 
//                                         onSelectionChange={(e) => setSelectedKeys(e.value)} 
//                                         className="w-full border-none p-0"
//                                         filter 
//                                         filterMode="lenient" 
//                                         filterPlaceholder="Filter categories..."
//                                     />
//                                 )}
//                             </div>

//                             {/* Footer Actions */}
//                             <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
//                                 <Button 
//                                     label="Clear Selection" 
//                                     className="p-button-text !text-gray-500 !text-sm" 
//                                     onClick={() => setSelectedKeys(null)}
//                                 />
//                                 <Button 
//                                     label={saving ? "Saving..." : "Save Categories"} 
//                                     icon={saving ? "pi pi-spin pi-spinner" : <FaSave className="mr-2"/>} 
//                                     className="!bg-[#1a1a2e] !border-[#1a1a2e] !px-6 !py-3 !rounded-xl !font-bold !text-sm shadow-lg hover:!bg-[#2d2d44]"
//                                     onClick={handleSaveCategories}
//                                     disabled={saving}
//                                 />
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CategoryManager;
