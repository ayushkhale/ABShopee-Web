import { useState, useEffect, useRef } from "react";
import apiClient, { apiGet, apiPost } from "../services/api";
import { useBusiness } from "../context/BusinessContext";

// Icons
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTags,
  FaFilter,
  FaSearch,
  FaUndo,
  FaPlus,
  FaStar,
  FaKey,
  FaTimes,
  FaFileUpload, FaReceipt
} from "react-icons/fa";

// PrimeReact
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { TreeSelect } from "primereact/treeselect";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { Paginator } from "primereact/paginator";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";


//yee addd kiya he mene shivam 



// ─── GST options ───────────────────────────────────────────────────────────────
const GST_OPTIONS = [
  { label: "5%", value: 5 },
  { label: "12%", value: 12 },
  { label: "18%", value: 18 },
  { label: "28%", value: 28 },
];

const STATUS_OPTIONS = [
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];
const GST_OPTIONS_INCLUDE_EXCLUDE = [
  { label: "With GST", value: true },
  { label: "Without GST", value: false },
];



//yee addd kiya he mene shivam 

// ─── helpers ──────────────────────────────────────────────────────────────────
/** Parse a CSV / plain-text file and return an array of non-empty trimmed lines */
const parseKeysFromFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || "";
      // Split on newlines and commas; filter blanks
      const keys = text
        .split(/[\r\n,]+/)
        .map((k) => k.trim())
        .filter(Boolean);
      resolve(keys);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
const PurchaseDetailsSection = ({ form, setForm }) => (
  <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50/60">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
      <FaReceipt className="text-[#0B77A7]" /> Purchase Details
    </p>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Unit Cost (₹) *</label>
        <InputNumber
          value={form.actualUnitCost}
          onValueChange={(e) => setForm({ ...form, actualUnitCost: e.value })}
          placeholder="0.00"
          minFractionDigits={2}
          maxFractionDigits={2}
          min={0}
          inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
          className="w-full"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">GST % *</label>
        <Dropdown
          value={form.gstPercentage}
          options={GST_OPTIONS}
          onChange={(e) => setForm({ ...form, gstPercentage: e.value })}
          placeholder="Select GST"
          className="w-full"
          inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">With GST/Without GST</label>
      <Dropdown
        value={form.isGstIncluded}
        options={GST_OPTIONS_INCLUDE_EXCLUDE}
        onChange={(e) => setForm({ ...form, isGstIncluded: e.value })}
        placeholder="Select GST INCLUDE/EXCLUDE"
        className="w-full"
        inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2 !text-sm"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">GST Amount (₹) *</label>
        <InputNumber
          value={form.actualGstAmount}
          readOnly
          placeholder="0.00"
          minFractionDigits={2}
          maxFractionDigits={2}
          min={0}
          inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
          className="w-full"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Total Amount (₹) *</label>
        <InputNumber
          value={form.totalAmount}
          readOnly
          placeholder="0.00"
          minFractionDigits={2}
          maxFractionDigits={2}
          min={0}
          inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
          className="w-full"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Purchase Date *</label>
      <InputText
        type="datetime-local"
        value={form.purchaseDate}
        onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
        className="w-full !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Supplier Name</label>
        <InputText
          value={form.supplierBusinessName}
          onChange={(e) => setForm({ ...form, supplierBusinessName: e.target.value })}
          placeholder="e.g. Tech Suppliers Ltd"
          maxLength={255}
          className="w-full !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Invoice #</label>
        <InputText
          value={form.invoiceNumber}
          onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
          placeholder="e.g. INV-0099"
          maxLength={100}
          className="w-full !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
        />
      </div>
    </div>
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
      <Dropdown
        value={form.status}
        options={STATUS_OPTIONS}
        onChange={(e) => setForm({ ...form, status: e.value })}
        placeholder="Select Status"
        className="w-full"
        inputClassName="!rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2 !text-sm"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes</label>
      <InputText
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Optional notes"
        className="w-full !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
      />
    </div>
  </div>
);
const DashboardHome = () => {
  const navigate = useNavigate();
  const { businessId, setGlobalCategories } = useBusiness();
  // console.log("businessId:", businessId);
  // console.log("TYPE:", typeof businessId, "VALUE:", businessId);
  // --- State ---
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const fileUploadRef = useRef(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedBulkFile, setSelectedBulkFile] = useState(null);

  // --- Inventory/Digital Dialog State ---
  const [showInvDialog, setShowInvDialog] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  // const [invForm, setInvForm] = useState({
  //   mode: "simple",
  //   variantId: "",
  //   quantity: 0,
  //   licenseKeys: [""],
  // });

  // ye add kiya he mene 
  const defaultPhysicalForm = {
    mode: "simple",
    variantId: "",
    quantityPurchased: 1,
    actualUnitCost: null,
    gstPercentage: 18,
    isGstIncluded: true,
    actualGstAmount: null,
    totalAmount: null,
    supplierBusinessName: "",
    invoiceNumber: "",
    purchaseDate: new Date().toISOString().slice(0, 16),
    status: "completed",
    notes: "",
  };

  const defaultDigitalForm = {
    licenseKeys: [""],
    actualUnitCost: null,
    gstPercentage: 18,
    actualGstAmount: null,
    isGstIncluded: null,
    totalAmount: null,
    supplierBusinessName: "",
    invoiceNumber: "",
    purchaseDate: new Date().toISOString().slice(0, 16),
    status: "completed",
    notes: "",
  };

  const [physicalForm, setPhysicalForm] = useState(defaultPhysicalForm);
  const [digitalForm, setDigitalForm] = useState(defaultDigitalForm);



  const [invLoading, setInvLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // --- Filter States ---
  const [filters, setFilters] = useState({
    search: "",
    categoryKey: null,
    stockStatus: null,
    minPrice: null,
    maxPrice: null,
    itemType: null,
  });

  // --- 1. Fetch Logic ---
  // useEffect(() => {
  //   if (!businessId) return;   // ← yeh add karo
  //   if (businessId) fetchData();
  // }, [businessId, currentPage, rowsPerPage]);
  useEffect(() => {
    if (businessId && typeof businessId === 'string' && businessId.length > 10) {
      fetchData();
    }
  }, [businessId, currentPage, rowsPerPage]);
  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        apiGet(`/seller/business/${businessId}/categories`),
        apiGet(`/seller/business/${businessId}/products`, {
          limit: rowsPerPage,
          offset: currentPage * rowsPerPage,
        }),
      ]);

      console.log(prodRes)

      if (catRes.data.success) {
        const treeData = transformCategoriesToTree(catRes.data.data);
        setCategories(treeData);
        setGlobalCategories(catRes.data.data);
      }

      if (prodRes.data.success && prodRes.data.data.rows) {
        const rows = prodRes.data.data.rows;
        setProducts(rows);
        setDisplayProducts(rows);
        setTotalCount(prodRes.data.data.count || 0);

        const uniqueBrands = [
          ...new Set(
            rows
              .map((p) => p.attributes?.find((a) => a.key === "brand")?.value)
              .filter(Boolean),
          ),
        ];
        setBrands(uniqueBrands.map((b) => ({ label: b, value: b })));
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const transformCategoriesToTree = (nodes) => {
    return nodes.map((node) => ({
      key: node.id,
      label: node.name,
      data: node,
      children: node.children
        ? transformCategoriesToTree(node.children)
        : undefined,
    }));
  };

  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      fetchData();
      return;
    }

    if (query.trim().length < 3) {
      return;
    }

    setSearchLoading(true);
    try {
      const response = await apiGet(
        `/seller/business/${businessId}/search/items`,
        { q: query.trim(), limit: 100 },
      );

      if (response.data.success) {
        setDisplayProducts(response.data.items || []);
        setTotalCount(response.data.items?.length || 0);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Search Failed",
        detail: error.message || "Could not perform search",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const searchQuery = filters.search.trim();

    if (searchQuery.length === 0) {
      fetchData();
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(filters.search);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.search]);

  // // --- 2. Inventory/Digital Asset Logic ---
  // const openInventoryDialog = (product) => {
  //   setTargetProduct(product);
  //   setInvForm({
  //     mode: "simple",
  //     variantId: "",
  //     quantity: 0,
  //     licenseKeys: [""],
  //   });
  //   setShowInvDialog(true);
  // };


  //nya add kiya he mene

  // ─── 2. Dialog open ──────────
  const openInventoryDialog = (product) => {
    setTargetProduct(product);
    setPhysicalForm(defaultPhysicalForm);
    setDigitalForm(defaultDigitalForm);
    setSelectedBulkFile(null);
    setShowInvDialog(true);
  };

  //   const handleAddInventory = async () => {
  //     const isDigital = targetProduct.itemType === "digital";

  //     // if (isDigital) {
  //     //   const validKeys = invForm.licenseKeys.filter((key) => key.trim() !== "");

  //     //   if (validKeys.length === 0) {
  //     //     toast.current.show({
  //     //       severity: "warn",
  //     //       summary: "Invalid Keys",
  //     //       detail: "Please enter at least one license key.",
  //     //     });
  //     //     return;
  //     //   }
  //     // }
  //     if (isDigital) {

  //   // 🔥 CASE 1 — Bulk File Selected
  //   if (selectedBulkFile) {
  //     await uploadBulkFile(selectedBulkFile);
  //     return;
  //   }

  //   // 🔥 CASE 2 — Manual Keys
  //   const validKeys = invForm.licenseKeys.filter(
  //     (key) => key.trim() !== ""
  //   );

  //   if (validKeys.length === 0) {
  //     toast.current.show({
  //       severity: "warn",
  //       summary: "Invalid Keys",
  //       detail: "Please enter at least one license key.",
  //     });
  //     return;
  //   }
  // } else {
  //       if (!invForm.quantity || invForm.quantity < 0) {
  //         toast.current.show({
  //           severity: "warn",
  //           summary: "Invalid Quantity",
  //           detail: "Please enter a valid quantity.",
  //         });
  //         return;
  //       }
  //     }

  //     setInvLoading(true);
  //     try {
  //       if (isDigital) {
  //         const validKeys = invForm.licenseKeys
  //           .map((key) => key.trim())
  //           .filter((key) => key !== "");

  //         const payload = {
  //           keys: validKeys,
  //         };
  //         const response = await apiPost(
  //           `/seller/business/${businessId}/items/${targetProduct.id}/assets/digital`,
  //           payload,
  //         );

  //         const addedCount = response.data?.data?.addedCount || validKeys.length;
  //         const totalKeys = response.data?.data?.totalKeys || 0;

  //         toast.current.show({
  //           severity: "success",
  //           summary: "Keys Added",
  //           detail: `Added ${addedCount} key(s). Total keys: ${totalKeys}`,
  //         });
  //       } else {
  //         const payload = {
  //           quantityAvailable: invForm.quantity,
  //           variantId: invForm.mode === "variant" ? invForm.variantId : null,
  //         };
  //         await apiPost(
  //           `/seller/business/${businessId}/inventory/${targetProduct.id}`,
  //           payload,
  //         );
  //         toast.current.show({
  //           severity: "success",
  //           summary: "Stock Added",
  //           detail: `Added ${invForm.quantity} units to ${targetProduct.title}`,
  //         });
  //       }

  //       setShowInvDialog(false);
  //       fetchData();
  //     } catch (error) {
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Failed",
  //         detail: error.message || "Could not update inventory",
  //       });
  //     } finally {
  //       setInvLoading(false);
  //     }
  //   };

  // const handleBulkUpload = async (event) => {

  //   const file = event.files[0];

  //   if (!file) {
  //     toast.current.show({
  //       severity: "warn",
  //       summary: "No File Selected",
  //       detail: "Please select a CSV or Excel file to upload.",
  //     });
  //     return;
  //   }

  //   const validTypes = [
  //     "text/csv",
  //     "application/vnd.ms-excel",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   ];

  //   if (!validTypes.includes(file.type)) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Invalid File Type",
  //       detail: "Please upload a CSV or Excel (.xlsx) file.",
  //     });
  //     fileUploadRef.current?.clear();
  //     return;
  //   }

  //   setBulkUploadLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await apiClient.post(
  //       `/seller/business/${businessId}/items/${targetProduct.id}/digital/keys/bulk/upload`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     let filename = "bulk_upload_result.csv";
  //     const contentDisposition = response.headers["content-disposition"];
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?(.+)"?/);
  //       if (match) filename = match[1];
  //     }

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //     toast.current.show({
  //       severity: "success",
  //       summary: "Bulk Upload Complete",
  //       detail: "Keys processed. Result file downloaded.",
  //     });

  //     fileUploadRef.current?.clear();
  //     fetchData();
  //   } catch (error) {
  //     console.error("Bulk upload error:", error);
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Upload Failed",
  //       detail: error.message || "Failed to upload bulk keys",
  //     });
  //   } finally {
  //     setBulkUploadLoading(false);
  //   }
  // };
  //  const uploadBulkFile = async (file) => {
  //   setBulkUploadLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await apiClient.post(
  //       `/seller/business/${businessId}/items/${targetProduct.id}/digital/keys/bulk/upload`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         responseType: "blob",
  //       }
  //     );

  //     let filename = "bulk_upload_result.csv";
  //     const contentDisposition = response.headers["content-disposition"];
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?(.+)"?/);
  //       if (match) filename = match[1];
  //     }

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //     toast.current.show({
  //       severity: "success",
  //       summary: "Bulk Upload Complete",
  //       detail: "Keys processed. Result file downloaded.",
  //     });

  //     setSelectedBulkFile(null);
  //     fileUploadRef.current?.clear();
  //     setShowInvDialog(false);
  //     fetchData();

  //   } catch (error) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Upload Failed",
  //       detail: error.message || "Failed to upload bulk keys",
  //     });
  //   } finally {
  //     setBulkUploadLoading(false);
  //   }
  // }; 

  const calculateGST = ({ quantity, unitCost, gstPercentage, isGstIncluded }) => {
    const gstRate = gstPercentage / 100

    let gstPerUnit
    let totalAmount
    let actualGstAmount

    if (isGstIncluded) {
      const baseUnitCost = unitCost / (1 + gstRate)
      gstPerUnit = unitCost - baseUnitCost
      actualGstAmount = gstPerUnit * quantity
      totalAmount = unitCost * quantity
    } else {
      gstPerUnit = unitCost * gstRate
      actualGstAmount = gstPerUnit * quantity
      totalAmount = (unitCost + gstPerUnit) * quantity
    }

    return {
      actualGstAmount: Number(actualGstAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2))
    }
  }

  const handleAddPhysical = async () => {
    const { quantityPurchased, actualUnitCost, gstPercentage, purchaseDate, isGstIncluded } = physicalForm;
    if (!quantityPurchased || quantityPurchased < 1) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Quantity must be at least 1." });
    }
    if (!actualUnitCost || actualUnitCost <= 0) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please enter a valid unit cost." });
    }
    if (!gstPercentage) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please select GST percentage." });
    }

    const { actualGstAmount, totalAmount } = calculateGST({
      quantity: quantityPurchased,
      unitCost: actualUnitCost,
      gstPercentage,
      isGstIncluded
    })

    setInvLoading(true);
    try {
      const record = {
        itemId: targetProduct.id,
        quantityPurchased,
        actualUnitCost,
        gstPercentage,
        actualGstAmount,
        totalAmount,
        isGstIncluded,
        // isGstIncluded: true,
        purchaseDate: new Date(purchaseDate).toISOString(),
        ...(physicalForm.supplierBusinessName && { supplierBusinessName: physicalForm.supplierBusinessName }),
        ...(physicalForm.invoiceNumber && { invoiceNumber: physicalForm.invoiceNumber }),
        ...(physicalForm.status && { status: physicalForm.status }),
        ...(physicalForm.notes && { notes: physicalForm.notes }),
        ...(physicalForm.mode === "variant" && physicalForm.variantId && { variantId: physicalForm.variantId }),
      };
      console.log(record);
      const response = await apiPost(
        `/seller/business/${businessId}/purchase/record/physical/bulk`,
        [record],
      );

      if (response.data.success) {
        toast.current.show({
          severity: "success",
          summary: "Stock Added",
          detail: `Purchase recorded for ${quantityPurchased} unit(s) of "${targetProduct.title}"`,
        });
        setShowInvDialog(false);
        fetchData();
      }
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Failed", detail: error.message || "Could not record purchase" });
    } finally {
      setInvLoading(false);
    }
  };



  const handleAddDigitalKeys = async (keys) => {
    const { actualUnitCost, gstPercentage, purchaseDate, isGstIncluded } = digitalForm;

    const quantity = keys.length

    const { actualGstAmount, totalAmount } = calculateGST({
      quantity,
      unitCost: actualUnitCost,
      gstPercentage,
      isGstIncluded
    })

    if (!actualUnitCost || actualUnitCost <= 0) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please enter a valid unit cost." });
    }
    if (!gstPercentage) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please select GST percentage." });
    }
    if (!actualGstAmount || actualGstAmount < 0) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please enter GST amount." });
    }
    if (!totalAmount || totalAmount <= 0) {
      return toast.current.show({ severity: "warn", summary: "Invalid", detail: "Please enter total amount." });
    }


    const record = {
      itemId: targetProduct.id,
      keys,
      actualUnitCost,
      gstPercentage,
      actualGstAmount,
      totalAmount,
      isGstIncluded,
      purchaseDate: new Date(purchaseDate).toISOString(),
      ...(digitalForm.supplierBusinessName && { supplierBusinessName: digitalForm.supplierBusinessName }),
      ...(digitalForm.invoiceNumber && { invoiceNumber: digitalForm.invoiceNumber }),
      ...(digitalForm.status && { status: digitalForm.status }),
      ...(digitalForm.notes && { notes: digitalForm.notes }),
    };

    const response = await apiPost(
      `/seller/business/${businessId}/purchase/record/digital/bulk`,
      [record],
    );
    console.log(record);
    if (response.data.success) {
      const { totalKeysInserted } = response.data.data;
      toast.current.show({
        severity: "success",
        summary: "Keys Added",
        detail: `${totalKeysInserted} key(s) added for "${targetProduct.title}"`,
      });
      setShowInvDialog(false);
      fetchData();
    }
  };

  const uploadBulkFile = async (file) => {
    setBulkUploadLoading(true);
    try {
      const keys = await parseKeysFromFile(file);
      if (keys.length === 0) {
        toast.current.show({ severity: "warn", summary: "Empty File", detail: "No keys found in the uploaded file." });
        return;
      }
      await handleAddDigitalKeys(keys);
      setSelectedBulkFile(null);
      fileUploadRef.current?.clear();
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Upload Failed", detail: error.message || "Failed to process file" });
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const handleAddInventory = async () => {
    const isDigital = targetProduct?.itemType === "digital";
    if (isDigital) {
      if (selectedBulkFile) {
        await uploadBulkFile(selectedBulkFile);
        return;
      }
      const validKeys = digitalForm.licenseKeys.map((k) => k.trim()).filter(Boolean);
      if (validKeys.length === 0) {
        toast.current.show({ severity: "warn", summary: "No Keys", detail: "Please enter at least one license key." });
        return;
      }
      setInvLoading(true);
      try {
        await handleAddDigitalKeys(validKeys);
      } finally {
        setInvLoading(false);
      }
    } else {
      await handleAddPhysical();
    }
  };



  // --- 3. Filter Logic ---
  const applyServerFilters = async () => {
    setLoading(true);
    const params = {
      limit: rowsPerPage,
      offset: currentPage * rowsPerPage,
    };
    if (filters.categoryKey) params.categoryId = filters.categoryKey;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.stockStatus === "in") params.inStock = true;
    if (filters.stockStatus === "out") params.inStock = false;
    if (filters.itemType) params.itemType = filters.itemType;
    try {
      const response = await apiGet(
        `/seller/business/${businessId}/products`,
        params,
      );
      if (response.data.success) {
        setProducts(response.data.data.rows);
        setDisplayProducts(response.data.data.rows);
        setTotalCount(response.data.data.count || 0);
        toast.current?.show({
          severity: "info",
          summary: "Updated",
          detail: "Filters applied",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (filters.itemType)
      result = result.filter((p) => p.itemType === filters.itemType);

    if (!filters.search || filters.search.trim().length < 3) {
      setDisplayProducts(result);
    }
  }, [products, filters.itemType]);


  useEffect(() => {
    const { quantityPurchased, actualUnitCost, gstPercentage, isGstIncluded } = physicalForm

    if (!quantityPurchased || !actualUnitCost || !gstPercentage || isGstIncluded === null) return

    const { actualGstAmount, totalAmount } = calculateGST({
      quantity: quantityPurchased,
      unitCost: actualUnitCost,
      gstPercentage,
      isGstIncluded
    })

    setPhysicalForm((prev) => ({
      ...prev,
      actualGstAmount,
      totalAmount
    }))
  }, [
    physicalForm.quantityPurchased,
    physicalForm.actualUnitCost,
    physicalForm.gstPercentage,
    physicalForm.isGstIncluded
  ])

  useEffect(() => {
    const { actualUnitCost, gstPercentage, isGstIncluded, licenseKeys } = digitalForm

    const quantity = licenseKeys.filter(k => k.trim()).length

    if (!quantity || !actualUnitCost || !gstPercentage || isGstIncluded === null) return

    const { actualGstAmount, totalAmount } = calculateGST({
      quantity,
      unitCost: actualUnitCost,
      gstPercentage,
      isGstIncluded
    })

    setDigitalForm((prev) => ({
      ...prev,
      actualGstAmount,
      totalAmount
    }))
  }, [
    digitalForm.actualUnitCost,
    digitalForm.gstPercentage,
    digitalForm.isGstIncluded,
    digitalForm.licenseKeys
  ])


  // --- 4. Render Helpers ---
  const renderStatsBar = () => {
    const total = totalCount;
    const inStock = products.filter((p) => {
      if (p.itemType === "digital") {
        return (p.digitalAssets?.length || 0) > 0;
      }
      const available = p.inventories?.[0]?.quantityAvailable || 0
      const reserved = p.inventories?.[0]?.quantityReserved || 0
      return (available - reserved) > 0
    }).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaBoxOpen />}
          label="Total Products"
          value={total}
          color="text-[#0B77A7]"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="In Stock (Current Page)"
          value={inStock}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<FaTags />}
          label="Categories"
          value={categories.length}
          color="text-[#0B77A7]"
          bg="bg-blue-50"
        />
      </div>
    );
  };

  const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl ${color} ${bg}`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-3xl font-bold text-[#212121]">{value}</h4>
        <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );

  // --- 5. Product Card ---
  const ProductCard = ({ product }) => {
    const isDigital = product.itemType === "digital";
    const imgUrl =
      product.media?.find((m) => m.role === "primary")?.url ||
      product.media?.[0]?.url;
    const price = product.prices?.[0];

    const stockQty = isDigital
      ? product.digitalAssets?.length || 0
      : product.inventories?.[0]?.quantityAvailable || 0;

    const isFeatured = product.attributes?.find(
      (a) => a.key === "is_featured",
    )?.value;

    return (
      <div
        onClick={() => navigate(`/dashboard/product/${product.id}`)}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group cursor-pointer h-full"
      >
        <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center p-4">
          {isFeatured && (
            <span className="absolute top-3 left-3 bg-[#0B77A7] text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 shadow-md flex items-center gap-1">
              <FaStar className="text-[8px]" /> PREMIUM
            </span>
          )}
          {stockQty === 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
              {isDigital ? "NO KEYS" : "SOLD OUT"}
            </span>
          )}
          {isDigital && (
            <span className="absolute bottom-3 right-3 bg-purple-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 shadow-md flex items-center gap-1.5">
              <FaKey className="text-[8px]" /> DIGITAL
            </span>
          )}
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.title}
              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <FaBoxOpen className="text-5xl text-gray-300" />
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
            <Tag
              value={
                stockQty > 0
                  ? `${isDigital ? "Keys" : "Stock"}: ${stockQty}`
                  : isDigital
                    ? "No Keys"
                    : "Out of Stock"
              }
              severity={stockQty > 0 ? "success" : "danger"}
              className="!text-[10px] !px-3 !py-1.5 !font-bold !rounded-full"
            />
          </div>
          <h3 className="text-base font-bold text-[#212121] mb-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
            {product.description || "No description available."}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            {/* <div className="text-xl font-bold text-[#0B77A7]">
              {price
                ? price.amount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })
                : "N/A"}
            </div> */}

            {/* //ye discount add kiya he  */}
            <div className="flex flex-col gap-0.5">
              {product.discountPricing?.discountTotal > 0 ? (
                <>
                  {/* Discount badge */}
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
                    {product.discountPricing.discounts[0]?.value}% OFF
                  </span>
                  {/* Strikethrough original price */}
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.discountPricing.basePrice.toLocaleString("en-IN")}
                  </span>
                  {/* Final discounted price */}
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.discountPricing.finalPrice.toLocaleString("en-IN")}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#0B77A7]">
                  {price
                    ? `₹${Number(price.amount).toLocaleString("en-IN")}`
                    : "N/A"}
                </span>
              )}
            </div>


            <Button
              label={isDigital ? "Add Key" : "Add Stock"}
              icon={
                isDigital ? (
                  <FaKey className="text-[10px] mr-2" />
                ) : (
                  <FaPlus className="text-[10px] mr-2" />
                )
              }
              className="!bg-[#0B77A7] !text-white !border-none !text-[11px] !font-bold !py-2.5 !px-4 !rounded-xl hover:!bg-[#0057ae] hover:!scale-105 active:!scale-95 transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                openInventoryDialog(product);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
  };

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setShowInvDialog(false)}
        className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-6 !py-3 !font-semibold hover:!bg-gray-200 transition-all"
      />
      <Button
        label={targetProduct?.itemType === "digital" ? "Add Keys" : "Add Stock"}
        icon="pi pi-check"
        onClick={handleAddInventory}
        // loading={invLoading}

        loading={invLoading || bulkUploadLoading}
        className="!bg-[#0B77A7] !border-none !rounded-xl !px-6 !py-3 !font-semibold hover:!bg-[#0057ae] transition-all shadow-md"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto">
        {renderStatsBar()}

        {/* ===== TOP ACTION BAR ===== */}
        <div className="sticky top-0 z-40 mb-8">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl px-6 py-5 shadow-lg flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <InputText
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Search products..."
                className="w-full !pl-11 !pr-4 !py-3.5 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm transition-all"
              />
              {searchLoading && (
                <i className="pi pi-spin pi-spinner absolute right-4 top-1/2 -translate-y-1/2 text-[#0B77A7]" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                icon={<FaFilter className="mr-2 text-xs" />}
                label={showFilters ? "Hide Filters" : "Filters"}
                onClick={() => setShowFilters((p) => !p)}
                className={`!rounded-xl !px-5 !py-3 !text-sm !font-semibold transition-all shadow-sm
                  ${showFilters
                    ? "!bg-[#0B77A7] !text-white !border-none shadow-md"
                    : "!bg-white !text-gray-600 !border !border-gray-200 hover:!border-[#0B77A7] hover:!text-[#0B77A7]"
                  }`}
              />

              <Button
                icon={<FaPlus className="mr-2 text-xs" />}
                label="Add Product"
                onClick={() => navigate("/dashboard/add-item")}
                className="!bg-[#0B77A7] !border-none !rounded-xl !px-6 !py-3 !text-sm !font-semibold hover:!bg-[#0057ae] hover:!scale-105 active:!scale-95 transition-all shadow-lg"
              />
            </div>
          </div>

          {/* ===== EXPANDABLE FILTER PANEL ===== */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-xl p-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <TreeSelect
                  value={filters.categoryKey}
                  options={categories}
                  onChange={(e) =>
                    setFilters({ ...filters, categoryKey: e.value })
                  }
                  placeholder="Select Category"
                  className="w-full"
                  inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !py-3"
                  showClear
                />

                <Dropdown
                  value={filters.itemType}
                  options={[
                    { label: "Physical", value: "physical" },
                    { label: "Digital", value: "digital" },
                  ]}
                  onChange={(e) => setFilters({ ...filters, itemType: e.value })}
                  placeholder="Item Type"
                  className="w-full"
                  inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-3"
                  showClear
                />

                <InputNumber
                  value={filters.minPrice}
                  onValueChange={(e) =>
                    setFilters({ ...filters, minPrice: e.value })
                  }
                  placeholder="Min Price"
                  className="w-full"
                  inputClassName="!py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                />

                <InputNumber
                  value={filters.maxPrice}
                  onValueChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.value })
                  }
                  placeholder="Max Price"
                  className="w-full"
                  inputClassName="!py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <Dropdown
                  value={filters.stockStatus}
                  options={[
                    { label: "In Stock", value: "in" },
                    { label: "Out of Stock", value: "out" },
                  ]}
                  onChange={(e) =>
                    setFilters({ ...filters, stockStatus: e.value })
                  }
                  placeholder="Stock Status"
                  className="!rounded-xl"
                  inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5"
                  showClear
                />

                <div className="flex items-center gap-3">
                  <Button
                    label="Reset"
                    icon={<FaUndo className="mr-2 text-xs" />}
                    onClick={() => {
                      setFilters({
                        search: "",
                        categoryKey: null,
                        stockStatus: null,
                        minPrice: null,
                        maxPrice: null,
                        itemType: null,
                      });
                      setCurrentPage(0);
                      fetchData();
                    }}
                    className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !px-5 !py-2.5 !text-sm !font-semibold hover:!bg-gray-200 transition-all"
                  />

                  <Button
                    label="Apply Filters"
                    icon={<FaFilter className="mr-2 text-xs" />}
                    onClick={() => {
                      setCurrentPage(0);
                      applyServerFilters();
                      setShowFilters(false);
                    }}
                    className="!bg-[#0B77A7] !border-none !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold hover:!bg-[#0057ae] transition-all shadow-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} height="380px" className="!rounded-2xl" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <FaBoxOpen className="text-6xl text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No products found.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Pagination */}
              {totalCount > rowsPerPage && (
                <div className="mt-8 flex justify-center">
                  <Paginator
                    first={currentPage * rowsPerPage}
                    rows={rowsPerPage}
                    totalRecords={totalCount}
                    rowsPerPageOptions={[20, 50, 100]}
                    onPageChange={onPageChange}
                    className="!border-none !bg-white !rounded-2xl !shadow-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center">
              {targetProduct?.itemType === "digital" ? (
                <FaKey className="text-[#0B77A7]" />
              ) : (
                <FaBoxOpen className="text-[#0B77A7]" />
              )}
            </div>
            <span className="text-lg font-bold text-[#212121]">
              {targetProduct?.itemType === "digital"
                ? "Add License Keys"
                : "Manage Inventory"}
            </span>
          </div>
        }
        visible={showInvDialog}
        style={{ width: "880px" }}
        footer={dialogFooter}
        onHide={() => setShowInvDialog(false)}
        className="p-fluid"
        modal={true}
        blockScroll={true}
      >
        {/* {targetProduct && (
          <div className="flex flex-col gap-5 pt-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">
                {targetProduct.itemType === "digital"
                  ? "Adding keys for:"
                  : "Updating stock for:"}
              </span>
              <span className="font-bold text-[#212121] text-base block mb-2">
                {targetProduct.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">
                {targetProduct.itemType === "digital" ? <FaKey className="text-[8px]" /> : <FaBoxOpen className="text-[8px]" />}
                {targetProduct.itemType.toUpperCase()}
              </span>
            </div>
            {targetProduct.itemType === "digital" ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-[#212121]">
                    License Keys
                  </label>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-semibold">
                    {invForm.licenseKeys.length} key(s)
                  </span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {invForm.licenseKeys.map((key, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <span className="text-xs font-bold text-gray-400 w-6">
                        {index + 1}.
                      </span>
                      <InputText
                        value={key}
                        onChange={(e) => {
                          const newKeys = [...invForm.licenseKeys];
                          newKeys[index] = e.target.value;
                          setInvForm({ ...invForm, licenseKeys: newKeys });
                        }}
                        placeholder={`Enter license key ${index + 1}`}
                        className="flex-1 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !py-3"
                      />
                      {invForm.licenseKeys.length > 1 && (
                        <Button
                          icon={<FaTimes />}
                          className="!p-3 !bg-red-50 !text-red-500 !border-none !rounded-xl hover:!bg-red-100 transition-all"
                          onClick={() => {
                            const newKeys = invForm.licenseKeys.filter(
                              (_, i) => i !== index,
                            );
                            setInvForm({ ...invForm, licenseKeys: newKeys });
                          }}
                          type="button"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  {invForm.licenseKeys.length < 5 && (
                    <Button
                      label="Add Another Key"
                      icon={<FaPlus className="mr-2 text-xs" />}
                      className="flex-1 !bg-purple-50 !text-purple-700 !border-none hover:!bg-purple-100 !rounded-xl !text-sm !py-3 !font-semibold transition-all"
                      onClick={() => {
                        if (invForm.licenseKeys.length < 5) {
                          setInvForm({
                            ...invForm,
                            licenseKeys: [...invForm.licenseKeys, ""],
                          });
                        }
                      }}
                      type="button"
                    />
                  )} */}
        {/* <FileUpload
                    ref={fileUploadRef}
                    mode="basic"
                    accept=".csv,.xlsx"
                    maxFileSize={10000000}
                    customUpload
                    uploadHandler={handleBulkUpload}
                    auto={false}
                    chooseLabel="Bulk Upload"
                    className="flex-1"
                    chooseOptions={{
                      icon: <FaFileUpload className="mr-2 text-xs" />,
                      className:
                        "!w-full !bg-blue-50 !text-blue-700 !border-none hover:!bg-blue-100 !rounded-xl !text-sm !py-3 !font-semibold transition-all",
                    }}
                    disabled={bulkUploadLoading}
                  /> */}
        {/* <FileUpload
  ref={fileUploadRef}
  mode="basic"
  accept=".csv,.xlsx"
  maxFileSize={10000000}
  auto={false}
  customUpload={false}   // important
  chooseLabel="Bulk Upload"
  onSelect={(e) => {
    if (e.files && e.files.length > 0) {
      setSelectedBulkFile(e.files[0]);
    }
  }}
  onClear={() => {
    setSelectedBulkFile(null);
  }}
  chooseOptions={{
    icon: <FaFileUpload className="mr-2 text-xs" />,
    className:
      "!w-full !bg-blue-50 !text-blue-700 !border-none hover:!bg-blue-100 !rounded-xl !text-sm !py-3 !font-semibold transition-all",
  }}
  disabled={bulkUploadLoading}
/>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center flex-1 gap-2 cursor-pointer">
                    <RadioButton
                      inputId="modeS"
                      name="mode"
                      value="simple"
                      onChange={(e) =>
                        setInvForm({ ...invForm, mode: e.value })
                      }
                      checked={invForm.mode === "simple"}
                      className="!border-2 !border-gray-300"
                    />
                    <label htmlFor="modeS" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Simple
                    </label>
                  </div>
                  <div className="flex items-center flex-1 gap-2 cursor-pointer">
                    <RadioButton
                      inputId="modeV"
                      name="mode"
                      value="variant"
                      onChange={(e) =>
                        setInvForm({ ...invForm, mode: e.value })
                      }
                      checked={invForm.mode === "variant"}
                      className="!border-2 !border-gray-300"
                    />
                    <label htmlFor="modeV" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Variant
                    </label>
                  </div>
                </div>

                {invForm.mode === "variant" && (
                  <InputText
                    value={invForm.variantId}
                    onChange={(e) =>
                      setInvForm({ ...invForm, variantId: e.target.value })
                    }
                    placeholder="Enter Variant UUID"
                    className="!rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !py-3"
                  />
                )}

                <div>
                  <label className="text-sm font-bold text-[#212121] mb-3 block">
                    Quantity
                  </label>
                  <InputNumber
                    value={invForm.quantity}
                    onValueChange={(e) =>
                      setInvForm({ ...invForm, quantity: e.value })
                    }
                    min={1}
                    showButtons
                    buttonLayout="horizontal"
                    className="w-full"
                    inputClassName="!text-center !font-bold !text-lg !py-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7]"
                    incrementButtonClassName="!bg-[#0B77A7] !text-white !border-none hover:!bg-[#0057ae] !rounded-r-xl"
                    decrementButtonClassName="!bg-gray-200 !text-gray-700 !border-none hover:!bg-gray-300 !rounded-l-xl"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Dialog> */}

        {targetProduct && (
          <div className="flex flex-col gap-5 pt-4 max-h-[75vh] overflow-y-auto pr-1">

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">
                {targetProduct.itemType === "digital" ? "Adding keys for:" : "Updating stock for:"}
              </span>
              <span className="font-bold text-[#212121] text-base block mb-2">{targetProduct.title}</span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">
                {targetProduct.itemType === "digital" ? <FaKey className="text-[8px]" /> : <FaBoxOpen className="text-[8px]" />}
                {targetProduct.itemType.toUpperCase()}
              </span>
            </div>

            {targetProduct.itemType === "digital" ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-[#212121]">License Keys</label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-semibold">
                      {selectedBulkFile ? `File: ${selectedBulkFile.name}` : `${digitalForm.licenseKeys.length} key(s)`}
                    </span>
                  </div>

                  {selectedBulkFile ? (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <FaFileUpload className="text-blue-600 text-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-800 truncate">{selectedBulkFile.name}</p>
                        <p className="text-xs text-blue-600 mt-0.5">
                          {(selectedBulkFile.size / 1024).toFixed(1)} KB — Keys will be parsed on submit
                        </p>
                      </div>
                      <Button
                        icon={<FaTimes />}
                        className="!p-2 !bg-blue-100 !text-blue-600 !border-none !rounded-lg hover:!bg-blue-200 transition-all"
                        onClick={() => { setSelectedBulkFile(null); fileUploadRef.current?.clear(); }}
                        type="button"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {digitalForm.licenseKeys.map((key, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <span className="text-xs font-bold text-gray-400 w-6">{index + 1}.</span>
                          <InputText
                            value={key}
                            onChange={(e) => {
                              const newKeys = [...digitalForm.licenseKeys];
                              newKeys[index] = e.target.value;
                              setDigitalForm({ ...digitalForm, licenseKeys: newKeys });
                            }}
                            placeholder={`Enter license key ${index + 1}`}
                            className="flex-1 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-3"
                          />
                          {digitalForm.licenseKeys.length > 1 && (
                            <Button
                              icon={<FaTimes />}
                              className="!p-3 !bg-red-50 !text-red-500 !border-none !rounded-xl hover:!bg-red-100 transition-all"
                              onClick={() => setDigitalForm({ ...digitalForm, licenseKeys: digitalForm.licenseKeys.filter((_, i) => i !== index) })}
                              type="button"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!selectedBulkFile && (
                    <div className="flex gap-3 mt-4">
                      {digitalForm.licenseKeys.length < 50 && (
                        <Button
                          label="Add Another Key"
                          icon={<FaPlus className="mr-2 text-xs" />}
                          className="flex-1 !bg-purple-50 !text-purple-700 !border-none hover:!bg-purple-100 !rounded-xl !text-sm !py-3 !font-semibold transition-all"
                          onClick={() => setDigitalForm({ ...digitalForm, licenseKeys: [...digitalForm.licenseKeys, ""] })}
                          type="button"
                        />
                      )}
                      <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        accept=".csv,.txt"
                        maxFileSize={10000000}
                        auto={false}
                        customUpload={false}
                        chooseLabel="Bulk Upload (CSV)"
                        onSelect={(e) => { if (e.files?.[0]) setSelectedBulkFile(e.files[0]); }}
                        onClear={() => setSelectedBulkFile(null)}
                        chooseOptions={{
                          icon: <FaFileUpload className="mr-2 text-xs" />,
                          className: "!w-full !bg-blue-50 !text-blue-700 !border-none hover:!bg-blue-100 !rounded-xl !text-sm !py-3 !font-semibold transition-all",
                        }}
                        disabled={bulkUploadLoading}
                      />
                    </div>
                  )}
                  {!selectedBulkFile && (
                    <p className="text-xs text-gray-400 mt-2">💡 CSV format: one key per line, or comma-separated</p>
                  )}
                </div>

                <PurchaseDetailsSection form={digitalForm} setForm={setDigitalForm} />
              </>
            ) : (
              <>
                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center flex-1 gap-2 cursor-pointer">
                    <RadioButton inputId="modeS" name="mode" value="simple"
                      onChange={(e) => setPhysicalForm({ ...physicalForm, mode: e.value })}
                      checked={physicalForm.mode === "simple"} />
                    <label htmlFor="modeS" className="text-sm font-semibold text-gray-700 cursor-pointer">Simple</label>
                  </div>
                  {/* <div className="flex items-center flex-1 gap-2 cursor-pointer">
                    <RadioButton inputId="modeV" name="mode" value="variant"
                      onChange={(e) => setPhysicalForm({ ...physicalForm, mode: e.value })}
                      checked={physicalForm.mode === "variant"} />
                    <label htmlFor="modeV" className="text-sm font-semibold text-gray-700 cursor-pointer">Variant</label>
                  </div> */}
                </div>

                {physicalForm.mode === "variant" && (
                  <InputText
                    value={physicalForm.variantId}
                    onChange={(e) => setPhysicalForm({ ...physicalForm, variantId: e.target.value })}
                    placeholder="Enter Variant UUID"
                    className="!rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-3"
                  />
                )}

                <div>
                  <label className="text-sm font-bold text-[#212121] mb-3 block">Quantity *</label>
                  <InputNumber
                    value={physicalForm.quantityPurchased}
                    onValueChange={(e) => setPhysicalForm({ ...physicalForm, quantityPurchased: e.value })}
                    min={1}
                    showButtons
                    buttonLayout="horizontal"
                    className="w-full"
                    inputClassName="!text-center !font-bold !text-lg !py-4 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7]"
                    incrementButtonClassName="!bg-[#0B77A7] !text-white !border-none hover:!bg-[#0057ae] !rounded-r-xl"
                    decrementButtonClassName="!bg-gray-200 !text-gray-700 !border-none hover:!bg-gray-300 !rounded-l-xl"
                  />
                </div>

                <PurchaseDetailsSection form={physicalForm} setForm={setPhysicalForm} />
              </>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};
export default DashboardHome;




//     </div>
//   );
// };
// export default DashboardHome;
