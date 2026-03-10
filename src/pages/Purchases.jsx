// // // // import { useState, useEffect, useRef, useCallback } from "react";
// // // // import { apiGet } from "../services/api";
// // // // import { useBusiness } from "../context/BusinessContext";
// // // // import {
// // // //   FaShoppingCart,
// // // //   FaFileInvoice,
// // // //   FaBook,
// // // //   FaSearch,
// // // //   FaFilter,
// // // //   FaBoxOpen,
// // // //   FaKey,
// // // //   FaChevronDown,
// // // //   FaChevronUp,
// // // //   FaArrowUp,
// // // //   FaArrowDown,
// // // // } from "react-icons/fa";
// // // // import { MdInventory } from "react-icons/md";
// // // // import { Skeleton } from "primereact/skeleton";
// // // // import { Tag } from "primereact/tag";
// // // // import { Paginator } from "primereact/paginator";
// // // // import { Dropdown } from "primereact/dropdown";
// // // // import { Toast } from "primereact/toast";

// // // // // ─── Constants ────────────────────────────────────────────────────────────────
// // // // const TABS = [
// // // //   { key: "items", label: "Purchase Items", icon: <FaShoppingCart /> },
// // // //   { key: "records", label: "Purchase Records", icon: <FaFileInvoice /> },
// // // //   { key: "ledger", label: "Stock Ledger", icon: <FaBook /> },
// // // // ];

// // // // const STATUS_SEVERITY = {
// // // //   completed: "success",
// // // //   cancelled: "danger",
// // // //   returned: "warning",
// // // // };

// // // // const TRANSACTION_COLORS = {
// // // //   purchase: "text-emerald-600 bg-emerald-50",
// // // //   sale: "text-red-500 bg-red-50",
// // // //   return: "text-blue-500 bg-blue-50",
// // // //   adjustment: "text-amber-500 bg-amber-50",
// // // //   damage: "text-gray-500 bg-gray-100",
// // // //   gift: "text-purple-500 bg-purple-50",
// // // // };

// // // // const fmt = (n) =>
// // // //   Number(n || 0).toLocaleString("en-IN", {
// // // //     style: "currency",
// // // //     currency: "INR",
// // // //     maximumFractionDigits: 2,
// // // //   });

// // // // const fmtDate = (d) =>
// // // //   d
// // // //     ? new Date(d).toLocaleDateString("en-IN", {
// // // //         day: "2-digit",
// // // //         month: "short",
// // // //         year: "numeric",
// // // //       })
// // // //     : "—";

// // // // // ─── Sub-components ──────────────────────────────────────────────────────────

// // // // const EmptyState = ({ message = "No data found" }) => (
// // // //   <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
// // // //     <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
// // // //     <p className="text-gray-400 font-medium">{message}</p>
// // // //   </div>
// // // // );

// // // // const LoadingGrid = ({ rows = 5, cols = 5 }) => (
// // // //   <div className="space-y-3">
// // // //     {Array.from({ length: rows }).map((_, i) => (
// // // //       <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
// // // //         {Array.from({ length: cols }).map((__, j) => (
// // // //           <Skeleton key={j} height="44px" className="!rounded-xl" />
// // // //         ))}
// // // //       </div>
// // // //     ))}
// // // //   </div>
// // // // );

// // // // // ─── Tab: Purchase Items ──────────────────────────────────────────────────────
// // // // const PurchaseItemsTab = ({ businessId, toast }) => {
// // // //   const [items, setItems] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [total, setTotal] = useState(0);
// // // //   const [page, setPage] = useState(0);
// // // //   const [rows, setRows] = useState(20);
// // // //   const [expandedItemId, setExpandedItemId] = useState(null);
// // // //   const [recordsMap, setRecordsMap] = useState({});
// // // //   const [recordsLoading, setRecordsLoading] = useState({});

// // // //   const fetchItems = useCallback(async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
// // // //         limit: rows,
// // // //         offset: page * rows,
// // // //       });
// // // //       if (res.data.success) {
// // // //         setItems(res.data.data.items || []);
// // // //         setTotal(res.data.data.total || 0);
// // // //       }
// // // //     } catch (e) {
// // // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase items" });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }, [businessId, page, rows]);

// // // //   useEffect(() => { fetchItems(); }, [fetchItems]);

// // // //   const fetchRecords = async (itemId) => {
// // // //     if (recordsMap[itemId]) {
// // // //       setExpandedItemId(expandedItemId === itemId ? null : itemId);
// // // //       return;
// // // //     }
// // // //     setRecordsLoading((p) => ({ ...p, [itemId]: true }));
// // // //     try {
// // // //       const res = await apiGet(
// // // //         `/seller/business/${businessId}/purchase/item/${itemId}/record`,
// // // //         { limit: 10 }
// // // //       );
// // // //       if (res.data.success) {
// // // //         setRecordsMap((p) => ({ ...p, [itemId]: res.data.data.records || [] }));
// // // //         setExpandedItemId(itemId);
// // // //       }
// // // //     } catch (e) {
// // // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load records" });
// // // //     } finally {
// // // //       setRecordsLoading((p) => ({ ...p, [itemId]: false }));
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       {loading ? (
// // // //         <LoadingGrid rows={5} cols={5} />
// // // //       ) : items.length === 0 ? (
// // // //         <EmptyState message="No purchase items found" />
// // // //       ) : (
// // // //         <>
// // // //           {/* Table Header */}
// // // //           <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// // // //             <span>Item</span>
// // // //             <span className="text-center">Type</span>
// // // //             <span className="text-right">Avg Unit Cost</span>
// // // //             <span className="text-right">Total Qty</span>
// // // //             <span className="text-right">Last Purchase</span>
// // // //           </div>

// // // //           {items.map((item) => (
// // // //             <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// // // //               <div
// // // //                 className="grid grid-cols-5 gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/40 transition-colors items-center"
// // // //                 onClick={() => fetchRecords(item.itemId)}
// // // //               >
// // // //                 <div className="flex items-center gap-3">
// // // //                   <div className="w-9 h-9 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center text-[#0B77A7]">
// // // //                     {item.itemType === "digital" ? <FaKey className="text-xs" /> : <FaBoxOpen className="text-xs" />}
// // // //                   </div>
// // // //                   <span className="text-sm font-semibold text-[#212121] truncate max-w-[140px]">
// // // //                     {item.itemId?.slice(0, 8)}…
// // // //                   </span>
// // // //                 </div>

// // // //                 <div className="flex justify-center">
// // // //                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// // // //                     {item.itemType?.toUpperCase()}
// // // //                   </span>
// // // //                 </div>

// // // //                 <span className="text-sm font-semibold text-right text-[#212121]">{fmt(item.averageUnitCost)}</span>
// // // //                 <span className="text-sm font-bold text-right text-emerald-600">{item.totalQuantityPurchased}</span>

// // // //                 <div className="flex items-center justify-end gap-2">
// // // //                   <span className="text-sm text-gray-500">{fmtDate(item.lastPurchaseDate)}</span>
// // // //                   {recordsLoading[item.itemId] ? (
// // // //                     <i className="pi pi-spin pi-spinner text-[#0B77A7] text-xs" />
// // // //                   ) : expandedItemId === item.itemId ? (
// // // //                     <FaChevronUp className="text-[#0B77A7] text-xs" />
// // // //                   ) : (
// // // //                     <FaChevronDown className="text-gray-400 text-xs" />
// // // //                   )}
// // // //                 </div>
// // // //               </div>

// // // //               {/* Expanded Records */}
// // // //               {expandedItemId === item.itemId && recordsMap[item.itemId] && (
// // // //                 <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
// // // //                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purchase Records</p>
// // // //                   {recordsMap[item.itemId].length === 0 ? (
// // // //                     <p className="text-sm text-gray-400">No records found.</p>
// // // //                   ) : (
// // // //                     recordsMap[item.itemId].map((rec) => (
// // // //                       <div key={rec.id} className="grid grid-cols-5 gap-3 bg-white rounded-xl p-4 border border-gray-100 text-sm">
// // // //                         <div>
// // // //                           <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
// // // //                           <p className="font-semibold text-[#212121]">{rec.invoiceNumber || "—"}</p>
// // // //                         </div>
// // // //                         <div>
// // // //                           <p className="text-xs text-gray-400 mb-0.5">Date</p>
// // // //                           <p className="font-medium text-gray-600">{fmtDate(rec.purchaseDate)}</p>
// // // //                         </div>
// // // //                         <div>
// // // //                           <p className="text-xs text-gray-400 mb-0.5">Qty</p>
// // // //                           <p className="font-bold text-emerald-600">{rec.quantityPurchased}</p>
// // // //                         </div>
// // // //                         <div>
// // // //                           <p className="text-xs text-gray-400 mb-0.5">Total</p>
// // // //                           <p className="font-semibold text-[#0B77A7]">{fmt(rec.totalAmount)}</p>
// // // //                         </div>
// // // //                         <div>
// // // //                           <p className="text-xs text-gray-400 mb-0.5">Status</p>
// // // //                           <Tag
// // // //                             value={rec.status}
// // // //                             severity={STATUS_SEVERITY[rec.status] || "info"}
// // // //                             className="!text-[10px] !px-2.5 !py-1 !rounded-full !font-bold capitalize"
// // // //                           />
// // // //                         </div>
// // // //                       </div>
// // // //                     ))
// // // //                   )}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ))}

// // // //           {total > rows && (
// // // //             <div className="flex justify-center mt-4">
// // // //               <Paginator
// // // //                 first={page * rows}
// // // //                 rows={rows}
// // // //                 totalRecords={total}
// // // //                 rowsPerPageOptions={[20, 50, 100]}
// // // //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// // // //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// // // //               />
// // // //             </div>
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // ─── Tab: Stock Ledger ────────────────────────────────────────────────────────
// // // // const StockLedgerTab = ({ businessId, toast }) => {
// // // //   const [ledgers, setLedgers] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [total, setTotal] = useState(0);
// // // //   const [page, setPage] = useState(0);
// // // //   const [rows, setRows] = useState(20);
// // // //   const [filters, setFilters] = useState({
// // // //     transactionType: null,
// // // //     itemType: null,
// // // //   });

// // // //   const fetchLedger = useCallback(async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const params = { limit: rows, offset: page * rows };
// // // //       if (filters.transactionType) params.transactionType = filters.transactionType;
// // // //       if (filters.itemType) params.itemType = filters.itemType;

// // // //       const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, params);
// // // //       if (res.data.success) {
// // // //         setLedgers(res.data.data.ledgers || []);
// // // //         setTotal(res.data.data.total || 0);
// // // //       }
// // // //     } catch (e) {
// // // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load ledger" });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }, [businessId, page, rows, filters]);

// // // //   useEffect(() => { fetchLedger(); }, [fetchLedger]);

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       {/* Filters */}
// // // //       <div className="flex items-center gap-3 flex-wrap">
// // // //         <Dropdown
// // // //           value={filters.transactionType}
// // // //           options={[
// // // //             { label: "Purchase", value: "purchase" },
// // // //             { label: "Sale", value: "sale" },
// // // //             { label: "Return", value: "return" },
// // // //             { label: "Adjustment", value: "adjustment" },
// // // //             { label: "Damage", value: "damage" },
// // // //             { label: "Gift", value: "gift" },
// // // //           ]}
// // // //           onChange={(e) => { setFilters({ ...filters, transactionType: e.value }); setPage(0); }}
// // // //           placeholder="Transaction Type"
// // // //           showClear
// // // //           className="!rounded-xl"
// // // //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// // // //         />
// // // //         <Dropdown
// // // //           value={filters.itemType}
// // // //           options={[
// // // //             { label: "Physical", value: "physical" },
// // // //             { label: "Digital", value: "digital" },
// // // //           ]}
// // // //           onChange={(e) => { setFilters({ ...filters, itemType: e.value }); setPage(0); }}
// // // //           placeholder="Item Type"
// // // //           showClear
// // // //           className="!rounded-xl"
// // // //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// // // //         />
// // // //       </div>

// // // //       {loading ? (
// // // //         <LoadingGrid rows={6} cols={6} />
// // // //       ) : ledgers.length === 0 ? (
// // // //         <EmptyState message="No ledger entries found" />
// // // //       ) : (
// // // //         <>
// // // //           {/* Table Header */}
// // // //           <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// // // //             <span>Date</span>
// // // //             <span>Type</span>
// // // //             <span className="text-center">Item Type</span>
// // // //             <span className="text-right">Change</span>
// // // //             <span className="text-right">Prev → New</span>
// // // //             <span>Role</span>
// // // //           </div>

// // // //           {ledgers.map((ledger) => {
// // // //             const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
// // // //             const isPositive = ledger.quantityChange > 0;

// // // //             return (
// // // //               <div
// // // //                 key={ledger.id}
// // // //                 className="grid grid-cols-6 gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow"
// // // //               >
// // // //                 <span className="text-sm text-gray-500">{fmtDate(ledger.createdAt)}</span>

// // // //                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
// // // //                   {ledger.transactionType}
// // // //                 </span>

// // // //                 <div className="flex justify-center">
// // // //                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ledger.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// // // //                     {ledger.itemType?.toUpperCase()}
// // // //                   </span>
// // // //                 </div>

// // // //                 <div className="flex items-center justify-end gap-1.5">
// // // //                   {isPositive ? (
// // // //                     <FaArrowUp className="text-emerald-500 text-xs" />
// // // //                   ) : (
// // // //                     <FaArrowDown className="text-red-400 text-xs" />
// // // //                   )}
// // // //                   <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
// // // //                     {isPositive ? "+" : ""}{ledger.quantityChange}
// // // //                   </span>
// // // //                 </div>

// // // //                 <div className="flex items-center justify-end gap-1 text-sm">
// // // //                   <span className="text-gray-400">{ledger.previousStock}</span>
// // // //                   <span className="text-gray-300 mx-1">→</span>
// // // //                   <span className="font-bold text-[#212121]">{ledger.newStock}</span>
// // // //                 </div>

// // // //                 <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2.5 py-1 rounded-full font-medium w-fit">
// // // //                   {ledger.initiatedByRole || "—"}
// // // //                 </span>
// // // //               </div>
// // // //             );
// // // //           })}

// // // //           {total > rows && (
// // // //             <div className="flex justify-center mt-4">
// // // //               <Paginator
// // // //                 first={page * rows}
// // // //                 rows={rows}
// // // //                 totalRecords={total}
// // // //                 rowsPerPageOptions={[20, 50, 100]}
// // // //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// // // //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// // // //               />
// // // //             </div>
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // ─── Main Page ────────────────────────────────────────────────────────────────
// // // // const Purchases = () => {
// // // //   const { businessId } = useBusiness();
// // // //   const toast = useRef(null);
// // // //   const [activeTab, setActiveTab] = useState("items");

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
// // // //       <Toast ref={toast} />

// // // //       <div className="max-w-7xl mx-auto space-y-6">

// // // //         {/* Stats Bar */}
// // // //         <div className="grid grid-cols-3 gap-6">
// // // //           {[
// // // //             { icon: <FaShoppingCart />, label: "Purchase Items", color: "text-[#0B77A7]", bg: "bg-blue-50" },
// // // //             { icon: <FaFileInvoice />, label: "Purchase Records", color: "text-emerald-600", bg: "bg-emerald-50" },
// // // //             { icon: <MdInventory />, label: "Stock Ledger", color: "text-purple-600", bg: "bg-purple-50" },
// // // //           ].map((s) => (
// // // //             <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
// // // //               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.bg}`}>
// // // //                 {s.icon}
// // // //               </div>
// // // //               <p className="text-sm font-semibold text-gray-500">{s.label}</p>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* Tab Bar */}
// // // //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
// // // //           {TABS.map((tab) => (
// // // //             <button
// // // //               key={tab.key}
// // // //               onClick={() => setActiveTab(tab.key)}
// // // //               className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
// // // //                 ${activeTab === tab.key
// // // //                   ? "bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30"
// // // //                   : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
// // // //             >
// // // //               <span className="text-base">{tab.icon}</span>
// // // //               {tab.label}
// // // //             </button>
// // // //           ))}
// // // //         </div>

// // // //         {/* Tab Content */}
// // // //         <div>
// // // //           {activeTab === "items" && (
// // // //             <PurchaseItemsTab businessId={businessId} toast={toast} />
// // // //           )}
// // // //           {activeTab === "records" && (
// // // //             <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
// // // //               Item select karo "Purchase Items" tab se records dekhne ke liye — ya seedha Item ID se filter lagao.
// // // //             </div>
// // // //           )}
// // // //           {activeTab === "ledger" && (
// // // //             <StockLedgerTab businessId={businessId} toast={toast} />
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Purchases;


// // // import { useState, useEffect, useRef, useCallback } from "react";
// // // import { apiGet } from "../services/api";
// // // import { useBusiness } from "../context/BusinessContext";
// // // import {
// // //   FaShoppingCart,
// // //   FaFileInvoice,
// // //   FaBook,
// // //   FaSearch,
// // //   FaFilter,
// // //   FaBoxOpen,
// // //   FaKey,
// // //   FaChevronDown,
// // //   FaChevronUp,
// // //   FaArrowUp,
// // //   FaArrowDown,
// // // } from "react-icons/fa";
// // // import { MdInventory } from "react-icons/md";
// // // import { Skeleton } from "primereact/skeleton";
// // // import { Tag } from "primereact/tag";
// // // import { Paginator } from "primereact/paginator";
// // // import { Dropdown } from "primereact/dropdown";
// // // import { Toast } from "primereact/toast";

// // // // ─── Constants ────────────────────────────────────────────────────────────────
// // // const TABS = [
// // //   { key: "items", label: "Purchase Items", icon: <FaShoppingCart /> },
// // //   { key: "records", label: "Purchase Records", icon: <FaFileInvoice /> },
// // //   { key: "ledger", label: "Stock Ledger", icon: <FaBook /> },
// // // ];

// // // const STATUS_SEVERITY = {
// // //   completed: "success",
// // //   cancelled: "danger",
// // //   returned: "warning",
// // // };

// // // const TRANSACTION_COLORS = {
// // //   purchase: "text-emerald-600 bg-emerald-50",
// // //   sale: "text-red-500 bg-red-50",
// // //   return: "text-blue-500 bg-blue-50",
// // //   adjustment: "text-amber-500 bg-amber-50",
// // //   damage: "text-gray-500 bg-gray-100",
// // //   gift: "text-purple-500 bg-purple-50",
// // // };

// // // const fmt = (n) =>
// // //   Number(n || 0).toLocaleString("en-IN", {
// // //     style: "currency",
// // //     currency: "INR",
// // //     maximumFractionDigits: 2,
// // //   });

// // // const fmtDate = (d) =>
// // //   d
// // //     ? new Date(d).toLocaleDateString("en-IN", {
// // //         day: "2-digit",
// // //         month: "short",
// // //         year: "numeric",
// // //       })
// // //     : "—";

// // // // ─── Sub-components ──────────────────────────────────────────────────────────

// // // const EmptyState = ({ message = "No data found" }) => (
// // //   <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
// // //     <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
// // //     <p className="text-gray-400 font-medium">{message}</p>
// // //   </div>
// // // );

// // // const LoadingGrid = ({ rows = 5, cols = 5 }) => (
// // //   <div className="space-y-3">
// // //     {Array.from({ length: rows }).map((_, i) => (
// // //       <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
// // //         {Array.from({ length: cols }).map((__, j) => (
// // //           <Skeleton key={j} height="44px" className="!rounded-xl" />
// // //         ))}
// // //       </div>
// // //     ))}
// // //   </div>
// // // );

// // // // ─── Tab: Purchase Items ──────────────────────────────────────────────────────
// // // const PurchaseItemsTab = ({ businessId, toast }) => {
// // //   const [items, setItems] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [total, setTotal] = useState(0);
// // //   const [page, setPage] = useState(0);
// // //   const [rows, setRows] = useState(20);
// // //   const [expandedItemId, setExpandedItemId] = useState(null);
// // //   const [recordsMap, setRecordsMap] = useState({});
// // //   const [recordsLoading, setRecordsLoading] = useState({});

// // //   const fetchItems = useCallback(async () => {
// // //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
// // //     setLoading(true);
// // //     try {
// // //       const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
// // //         limit: rows,
// // //         offset: page * rows,
// // //       });
// // //       if (res.data.success) {
// // //         setItems(res.data.data.data || []);
// // //         setTotal(res.data.data.total || 0);
// // //       }
// // //     } catch (e) {
// // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase items" });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [businessId, page, rows]);

// // //   useEffect(() => { fetchItems(); }, [fetchItems]);

// // //   const fetchRecords = async (itemId) => {
// // //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
// // //     if (recordsMap[itemId]) {
// // //       setExpandedItemId(expandedItemId === itemId ? null : itemId);
// // //       return;
// // //     }
// // //     setRecordsLoading((p) => ({ ...p, [itemId]: true }));
// // //     try {
// // //       const res = await apiGet(
// // //         `/seller/business/${businessId}/purchase/item/${itemId}/record`,
// // //         { limit: 10 }
// // //       );
// // //       if (res.data.success) {
// // //         setRecordsMap((p) => ({ ...p, [itemId]: res.data.data.data || res.data.data.records || [] }));
// // //         setExpandedItemId(itemId);
// // //       }
// // //     } catch (e) {
// // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load records" });
// // //     } finally {
// // //       setRecordsLoading((p) => ({ ...p, [itemId]: false }));
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       {loading ? (
// // //         <LoadingGrid rows={5} cols={5} />
// // //       ) : items.length === 0 ? (
// // //         <EmptyState message="No purchase items found" />
// // //       ) : (
// // //         <>
// // //           {/* Table Header */}
// // //           <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// // //             <span>Item</span>
// // //             <span className="text-center">Type</span>
// // //             <span className="text-right">Expected Price</span>
// // //             <span className="text-right">Current Stock</span>
// // //             <span className="text-right">Last Updated</span>
// // //           </div>

// // //           {items.map((item) => (
// // //             <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// // //               <div
// // //                 className="grid grid-cols-5 gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/40 transition-colors items-center"
// // //                 onClick={() => fetchRecords(item.itemId)}
// // //               >
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="w-9 h-9 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center text-[#0B77A7]">
// // //                     {item.catalogItem?.itemType === "digital" ? <FaKey className="text-xs" /> : <FaBoxOpen className="text-xs" />}
// // //                   </div>
// // //                   <span className="text-sm font-semibold text-[#212121] truncate max-w-[140px]">
// // //                     {item.catalogItem?.title || item.itemId?.slice(0, 8) + "…"}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex justify-center">
// // //                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.catalogItem?.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// // //                     {item.catalogItem?.itemType?.toUpperCase()}
// // //                   </span>
// // //                 </div>

// // //                 <span className="text-sm font-semibold text-right text-[#212121]">{fmt(item.expectedPurchasePrice)}</span>
// // //                 <span className="text-sm font-bold text-right text-emerald-600">
// // //                   {item.catalogItem?.itemType === "digital"
// // //                     ? item.catalogItem?.digitalAssets?.length ?? 0
// // //                     : item.catalogItem?.inventories?.[0]?.quantityAvailable ?? 0}
// // //                 </span>

// // //                 <div className="flex items-center justify-end gap-2">
// // //                   <span className="text-sm text-gray-500">{fmtDate(item.updatedAt)}</span>
// // //                   {recordsLoading[item.itemId] ? (
// // //                     <i className="pi pi-spin pi-spinner text-[#0B77A7] text-xs" />
// // //                   ) : expandedItemId === item.itemId ? (
// // //                     <FaChevronUp className="text-[#0B77A7] text-xs" />
// // //                   ) : (
// // //                     <FaChevronDown className="text-gray-400 text-xs" />
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Expanded Records */}
// // //               {expandedItemId === item.itemId && recordsMap[item.itemId] && (
// // //                 <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
// // //                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purchase Records</p>
// // //                   {recordsMap[item.itemId].length === 0 ? (
// // //                     <p className="text-sm text-gray-400">No records found.</p>
// // //                   ) : (
// // //                     recordsMap[item.itemId].map((rec) => (
// // //                       <div key={rec.id} className="grid grid-cols-5 gap-3 bg-white rounded-xl p-4 border border-gray-100 text-sm">
// // //                         <div>
// // //                           <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
// // //                           <p className="font-semibold text-[#212121]">{rec.invoiceNumber || "—"}</p>
// // //                         </div>
// // //                         <div>
// // //                           <p className="text-xs text-gray-400 mb-0.5">Date</p>
// // //                           <p className="font-medium text-gray-600">{fmtDate(rec.purchaseDate)}</p>
// // //                         </div>
// // //                         <div>
// // //                           <p className="text-xs text-gray-400 mb-0.5">Qty</p>
// // //                           <p className="font-bold text-emerald-600">{rec.quantityPurchased}</p>
// // //                         </div>
// // //                         <div>
// // //                           <p className="text-xs text-gray-400 mb-0.5">Total</p>
// // //                           <p className="font-semibold text-[#0B77A7]">{fmt(rec.totalAmount)}</p>
// // //                         </div>
// // //                         <div>
// // //                           <p className="text-xs text-gray-400 mb-0.5">Status</p>
// // //                           <Tag
// // //                             value={rec.status}
// // //                             severity={STATUS_SEVERITY[rec.status] || "info"}
// // //                             className="!text-[10px] !px-2.5 !py-1 !rounded-full !font-bold capitalize"
// // //                           />
// // //                         </div>
// // //                       </div>
// // //                     ))
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}

// // //           {total > rows && (
// // //             <div className="flex justify-center mt-4">
// // //               <Paginator
// // //                 first={page * rows}
// // //                 rows={rows}
// // //                 totalRecords={total}
// // //                 rowsPerPageOptions={[20, 50, 100]}
// // //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// // //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// // //               />
// // //             </div>
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // ─── Tab: Stock Ledger ────────────────────────────────────────────────────────
// // // const StockLedgerTab = ({ businessId, toast }) => {
// // //   const [ledgers, setLedgers] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [total, setTotal] = useState(0);
// // //   const [page, setPage] = useState(0);
// // //   const [rows, setRows] = useState(20);
// // //   const [filters, setFilters] = useState({
// // //     transactionType: null,
// // //     itemType: null,
// // //   });

// // //   const fetchLedger = useCallback(async () => {
// // //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
// // //     setLoading(true);
// // //     try {
// // //       const params = { limit: rows, offset: page * rows };
// // //       if (filters.transactionType) params.transactionType = filters.transactionType;
// // //       if (filters.itemType) params.itemType = filters.itemType;

// // //       const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, params);
// // //       if (res.data.success) {
// // //         setLedgers(res.data.data.data || []);
// // //         setTotal(res.data.data.total || 0);
// // //       }
// // //     } catch (e) {
// // //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load ledger" });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [businessId, page, rows, filters]);

// // //   useEffect(() => { fetchLedger(); }, [fetchLedger]);

// // //   return (
// // //     <div className="space-y-4">
// // //       {/* Filters */}
// // //       <div className="flex items-center gap-3 flex-wrap">
// // //         <Dropdown
// // //           value={filters.transactionType}
// // //           options={[
// // //             { label: "Purchase", value: "purchase" },
// // //             { label: "Sale", value: "sale" },
// // //             { label: "Return", value: "return" },
// // //             { label: "Adjustment", value: "adjustment" },
// // //             { label: "Damage", value: "damage" },
// // //             { label: "Gift", value: "gift" },
// // //           ]}
// // //           onChange={(e) => { setFilters({ ...filters, transactionType: e.value }); setPage(0); }}
// // //           placeholder="Transaction Type"
// // //           showClear
// // //           className="!rounded-xl"
// // //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// // //         />
// // //         <Dropdown
// // //           value={filters.itemType}
// // //           options={[
// // //             { label: "Physical", value: "physical" },
// // //             { label: "Digital", value: "digital" },
// // //           ]}
// // //           onChange={(e) => { setFilters({ ...filters, itemType: e.value }); setPage(0); }}
// // //           placeholder="Item Type"
// // //           showClear
// // //           className="!rounded-xl"
// // //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// // //         />
// // //       </div>

// // //       {loading ? (
// // //         <LoadingGrid rows={6} cols={6} />
// // //       ) : ledgers.length === 0 ? (
// // //         <EmptyState message="No ledger entries found" />
// // //       ) : (
// // //         <>
// // //           {/* Table Header */}
// // //           <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// // //             <span>Item / Date</span>
// // //             <span>Transaction</span>
// // //             <span className="text-center">Type</span>
// // //             <span className="text-right">Change</span>
// // //             <span className="text-right">Prev → New</span>
// // //             <span>Role</span>
// // //           </div>

// // //           {ledgers.map((ledger) => {
// // //             const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
// // //             const isPositive = ledger.quantityChanged > 0;

// // //             return (
// // //               <div
// // //                 key={ledger.id}
// // //                 className="grid grid-cols-6 gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow"
// // //               >
// // //                 <div>
// // //                   <p className="text-sm text-gray-700 font-semibold truncate">{ledger.CatalogItem?.title || "—"}</p>
// // //                   <p className="text-xs text-gray-400 mt-0.5">{fmtDate(ledger.createdAt)}</p>
// // //                 </div>

// // //                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
// // //                   {ledger.transactionType}
// // //                 </span>

// // //                 <div className="flex justify-center">
// // //                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ledger.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// // //                     {ledger.itemType?.toUpperCase()}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex items-center justify-end gap-1.5">
// // //                   {isPositive ? (
// // //                     <FaArrowUp className="text-emerald-500 text-xs" />
// // //                   ) : (
// // //                     <FaArrowDown className="text-red-400 text-xs" />
// // //                   )}
// // //                   <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
// // //                     {isPositive ? "+" : ""}{ledger.quantityChanged}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex items-center justify-end gap-1 text-sm">
// // //                   <span className="text-gray-400">{ledger.balanceBefore}</span>
// // //                   <span className="text-gray-300 mx-1">→</span>
// // //                   <span className="font-bold text-[#212121]">{ledger.balanceAfter}</span>
// // //                 </div>

// // //                 <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2.5 py-1 rounded-full font-medium w-fit">
// // //                   {ledger.initiatedByRole || "—"}
// // //                 </span>
// // //               </div>
// // //             );
// // //           })}

// // //           {total > rows && (
// // //             <div className="flex justify-center mt-4">
// // //               <Paginator
// // //                 first={page * rows}
// // //                 rows={rows}
// // //                 totalRecords={total}
// // //                 rowsPerPageOptions={[20, 50, 100]}
// // //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// // //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// // //               />
// // //             </div>
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // ─── Main Page ────────────────────────────────────────────────────────────────
// // // const Purchases = () => {
// // //   const { businessId } = useBusiness();
// // //   const toast = useRef(null);
// // //   const [activeTab, setActiveTab] = useState("items");

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
// // //       <Toast ref={toast} />

// // //       <div className="max-w-7xl mx-auto space-y-6">

// // //         {/* Stats Bar */}
// // //         <div className="grid grid-cols-3 gap-6">
// // //           {[
// // //             { icon: <FaShoppingCart />, label: "Purchase Items", color: "text-[#0B77A7]", bg: "bg-blue-50" },
// // //             { icon: <FaFileInvoice />, label: "Purchase Records", color: "text-emerald-600", bg: "bg-emerald-50" },
// // //             { icon: <MdInventory />, label: "Stock Ledger", color: "text-purple-600", bg: "bg-purple-50" },
// // //           ].map((s) => (
// // //             <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
// // //               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.bg}`}>
// // //                 {s.icon}
// // //               </div>
// // //               <p className="text-sm font-semibold text-gray-500">{s.label}</p>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Tab Bar */}
// // //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
// // //           {TABS.map((tab) => (
// // //             <button
// // //               key={tab.key}
// // //               onClick={() => setActiveTab(tab.key)}
// // //               className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
// // //                 ${activeTab === tab.key
// // //                   ? "bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30"
// // //                   : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
// // //             >
// // //               <span className="text-base">{tab.icon}</span>
// // //               {tab.label}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Tab Content */}
// // //         <div>
// // //           {activeTab === "items" && (
// // //             <PurchaseItemsTab businessId={businessId} toast={toast} />
// // //           )}
// // //           {activeTab === "records" && (
// // //             <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
// // //               Item select karo "Purchase Items" tab se records dekhne ke liye — ya seedha Item ID se filter lagao.
// // //             </div>
// // //           )}
// // //           {activeTab === "ledger" && (
// // //             <StockLedgerTab businessId={businessId} toast={toast} />
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Purchases;


// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { apiGet } from "../services/api";
// // import { useBusiness } from "../context/BusinessContext";
// // import {
// //   FaShoppingCart,
// //   FaFileInvoice,
// //   FaBook,
// //   FaSearch,
// //   FaFilter,
// //   FaBoxOpen,
// //   FaKey,
// //   FaChevronDown,
// //   FaChevronUp,
// //   FaArrowUp,
// //   FaArrowDown,
// // } from "react-icons/fa";
// // import { MdInventory } from "react-icons/md";
// // import { Skeleton } from "primereact/skeleton";
// // import { Tag } from "primereact/tag";
// // import { Paginator } from "primereact/paginator";
// // import { Dropdown } from "primereact/dropdown";
// // import { Toast } from "primereact/toast";

// // // ─── Constants ────────────────────────────────────────────────────────────────
// // const TABS = [
// //   { key: "items", label: "Purchase Items", icon: <FaShoppingCart /> },
// // //   { key: "records", label: "Purchase Records", icon: <FaFileInvoice /> },
// //   { key: "ledger", label: "Stock Ledger", icon: <FaBook /> },
// // ];

// // const STATUS_SEVERITY = {
// //   completed: "success",
// //   cancelled: "danger",
// //   returned: "warning",
// // };

// // const TRANSACTION_COLORS = {
// //   purchase: "text-emerald-600 bg-emerald-50",
// //   sale: "text-red-500 bg-red-50",
// //   return: "text-blue-500 bg-blue-50",
// //   adjustment: "text-amber-500 bg-amber-50",
// //   damage: "text-gray-500 bg-gray-100",
// //   gift: "text-purple-500 bg-purple-50",
// // };

// // const fmt = (n) =>
// //   Number(n || 0).toLocaleString("en-IN", {
// //     style: "currency",
// //     currency: "INR",
// //     maximumFractionDigits: 2,
// //   });

// // const fmtDate = (d) =>
// //   d
// //     ? new Date(d).toLocaleDateString("en-IN", {
// //         day: "2-digit",
// //         month: "short",
// //         year: "numeric",
// //       })
// //     : "—";

// // // ─── Sub-components ──────────────────────────────────────────────────────────

// // const EmptyState = ({ message = "No data found" }) => (
// //   <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
// //     <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
// //     <p className="text-gray-400 font-medium">{message}</p>
// //   </div>
// // );

// // const LoadingGrid = ({ rows = 5, cols = 5 }) => (
// //   <div className="space-y-3">
// //     {Array.from({ length: rows }).map((_, i) => (
// //       <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
// //         {Array.from({ length: cols }).map((__, j) => (
// //           <Skeleton key={j} height="44px" className="!rounded-xl" />
// //         ))}
// //       </div>
// //     ))}
// //   </div>
// // );

// // // ─── Tab: Purchase Items ──────────────────────────────────────────────────────
// // const PurchaseItemsTab = ({ businessId, toast }) => {
// //   const [items, setItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(0);
// //   const [rows, setRows] = useState(20);
// //   const [expandedItemId, setExpandedItemId] = useState(null);
// //   const [recordsMap, setRecordsMap] = useState({});
// //   const [recordsLoading, setRecordsLoading] = useState({});

// //   const fetchItems = useCallback(async () => {
// //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
// //     setLoading(true);
// //     try {
// //       const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
// //         limit: rows,
// //         offset: page * rows,
// //       });
// //       if (res.data.success) {
// //         setItems(res.data.data.data || []);
// //         setTotal(res.data.data.total || 0);
// //       }
// //     } catch (e) {
// //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase items" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [businessId, page, rows]);

// //   useEffect(() => { fetchItems(); }, [fetchItems]);

// //   const fetchRecords = async (purchaseItemId, catalogItemId) => {
// //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;

// //     // Toggle close if already expanded
// //     if (expandedItemId === catalogItemId) {
// //       setExpandedItemId(null);
// //       return;
// //     }

// //     // Use cached data if already fetched
// //     if (recordsMap[catalogItemId]) {
// //       setExpandedItemId(catalogItemId);
// //       return;
// //     }

// //     setRecordsLoading((p) => ({ ...p, [catalogItemId]: true }));
// //     try {
// //       const res = await apiGet(
// //         `/seller/business/${businessId}/purchase/item/${purchaseItemId}/record`,
// //         { limit: 10 }
// //       );
// //       console.log("Purchase Records Response:", res.data);
// //       if (res.data.success) {
// //         const records =
// //           res.data.data?.data ||
// //           res.data.data?.records ||
// //           res.data.data?.items ||
// //           res.data.data ||
// //           [];
// //         setRecordsMap((p) => ({ ...p, [catalogItemId]: Array.isArray(records) ? records : [] }));
// //         setExpandedItemId(catalogItemId);
// //       }
// //     } catch (e) {
// //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load records" });
// //     } finally {
// //       setRecordsLoading((p) => ({ ...p, [catalogItemId]: false }));
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {loading ? (
// //         <LoadingGrid rows={5} cols={5} />
// //       ) : items.length === 0 ? (
// //         <EmptyState message="No purchase items found" />
// //       ) : (
// //         <>
// //           {/* Table Header */}
// //           <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// //             <span>Item</span>
// //             <span className="text-center">Type</span>
// //             {/* <span className="text-right">Expected Price</span> */}
// //             <span className="text-right">Current Stock</span>
// //             <span className="text-right">Last Updated</span>
// //           </div>

// //           {items.map((item) => (
// //             <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// //               <div
// //                 className="grid grid-cols-5 gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/40 transition-colors items-center"
// //                 onClick={() => fetchRecords(item.id, item.itemId)}
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-9 h-9 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center text-[#0B77A7]">
// //                     {item.catalogItem?.itemType === "digital" ? <FaKey className="text-xs" /> : <FaBoxOpen className="text-xs" />}
// //                   </div>
// //                   <span className="text-sm font-semibold text-[#212121] truncate max-w-[140px]">
// //                     {item.catalogItem?.title || item.itemId?.slice(0, 8) + "…"}
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-center">
// //                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.catalogItem?.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// //                     {item.catalogItem?.itemType?.toUpperCase()}
// //                   </span>
// //                 </div>

// //                 {/* <span className="text-sm font-semibold text-right text-[#212121]">{fmt(item.expectedPurchasePrice)}</span> */}
// //                 <span className="text-sm font-bold text-right text-emerald-600">
// //                   {item.catalogItem?.itemType === "digital"
// //                     ? item.catalogItem?.digitalAssets?.length ?? 0
// //                     : item.catalogItem?.inventories?.[0]?.quantityAvailable ?? 0}
// //                 </span>

// //                 <div className="flex items-center justify-end gap-2">
// //                   <span className="text-sm text-gray-500">{fmtDate(item.updatedAt)}</span>
// //                   {recordsLoading[item.itemId] ? (
// //                     <i className="pi pi-spin pi-spinner text-[#0B77A7] text-xs" />
// //                   ) : expandedItemId === item.itemId ? (
// //                     <FaChevronUp className="text-[#0B77A7] text-xs" />
// //                   ) : (
// //                     <FaChevronDown className="text-gray-400 text-xs" />
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Expanded Records */}
// //               {expandedItemId === item.itemId && recordsMap[item.itemId] && (
// //                 <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
// //                   {/* <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purchase Records</p> */}
// //                   {recordsMap[item.itemId].length === 0 ? (
// //                     <p className="text-sm text-gray-400">No records found.</p>
// //                   ) : (
// //                     recordsMap[item.itemId].map((rec) => (
// //                       <div key={rec.id} className="grid grid-cols-5 gap-3 bg-white rounded-xl p-4 border border-gray-100 text-sm">
// //                         <div>
// //                           <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
// //                           <p className="font-semibold text-[#212121]">{rec.invoiceNumber || "—"}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-400 mb-0.5">Date</p>
// //                           <p className="font-medium text-gray-600">{fmtDate(rec.purchaseDate)}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-400 mb-0.5">Qty</p>
// //                           <p className="font-bold text-emerald-600">{rec.quantityPurchased}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-400 mb-0.5">Total</p>
// //                           <p className="font-semibold text-[#0B77A7]">{fmt(rec.totalAmount)}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-400 mb-0.5">Status</p>
// //                           <Tag
// //                             value={rec.status}
// //                             severity={STATUS_SEVERITY[rec.status] || "info"}
// //                             className="!text-[10px] !px-2.5 !py-1 !rounded-full !font-bold capitalize"
// //                           />
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //           {total > rows && (
// //             <div className="flex justify-center mt-4">
// //               <Paginator
// //                 first={page * rows}
// //                 rows={rows}
// //                 totalRecords={total}
// //                 rowsPerPageOptions={[20, 50, 100]}
// //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// //               />
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // // ─── Tab: Stock Ledger ────────────────────────────────────────────────────────
// // const StockLedgerTab = ({ businessId, toast }) => {
// //   const [ledgers, setLedgers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(0);
// //   const [rows, setRows] = useState(20);
// //   const [filters, setFilters] = useState({
// //     transactionType: null,
// //     itemType: null,
// //   });

// //   const fetchLedger = useCallback(async () => {
// //     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
// //     setLoading(true);
// //     try {
// //       const params = { limit: rows, offset: page * rows };
// //       if (filters.transactionType) params.transactionType = filters.transactionType;
// //       if (filters.itemType) params.itemType = filters.itemType;

// //       const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, params);
// //       if (res.data.success) {
// //         setLedgers(res.data.data.data || []);
// //         setTotal(res.data.data.total || 0);
// //       }
// //     } catch (e) {
// //       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load ledger" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [businessId, page, rows, filters]);

// //   useEffect(() => { fetchLedger(); }, [fetchLedger]);

// //   return (
// //     <div className="space-y-4">
// //       {/* Filters */}
// //       <div className="flex items-center gap-3 flex-wrap">
// //         <Dropdown
// //           value={filters.transactionType}
// //           options={[
// //             { label: "Purchase", value: "purchase" },
// //             { label: "Sale", value: "sale" },
// //             { label: "Return", value: "return" },
// //             { label: "Adjustment", value: "adjustment" },
// //             { label: "Damage", value: "damage" },
// //             { label: "Gift", value: "gift" },
// //           ]}
// //           onChange={(e) => { setFilters({ ...filters, transactionType: e.value }); setPage(0); }}
// //           placeholder="Transaction Type"
// //           showClear
// //           className="!rounded-xl"
// //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// //         />
// //         <Dropdown
// //           value={filters.itemType}
// //           options={[
// //             { label: "Physical", value: "physical" },
// //             { label: "Digital", value: "digital" },
// //           ]}
// //           onChange={(e) => { setFilters({ ...filters, itemType: e.value }); setPage(0); }}
// //           placeholder="Item Type"
// //           showClear
// //           className="!rounded-xl"
// //           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
// //         />
// //       </div>

// //       {loading ? (
// //         <LoadingGrid rows={6} cols={6} />
// //       ) : ledgers.length === 0 ? (
// //         <EmptyState message="No ledger entries found" />
// //       ) : (
// //         <>
// //           {/* Table Header */}
// //           <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
// //             <span>Item / Date</span>
// //             <span>Transaction</span>
// //             <span className="text-center">Type</span>
// //             <span className="text-right">Change</span>
// //             <span className="text-right">Prev → New</span>
// //             <span>Role</span>
// //           </div>

// //           {ledgers.map((ledger) => {
// //             const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
// //             const isPositive = ledger.quantityChanged > 0;

// //             return (
// //               <div
// //                 key={ledger.id}
// //                 className="grid grid-cols-6 gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow"
// //               >
// //                 <div>
// //                   <p className="text-sm text-gray-700 font-semibold truncate">{ledger.CatalogItem?.title || "—"}</p>
// //                   <p className="text-xs text-gray-400 mt-0.5">{fmtDate(ledger.createdAt)}</p>
// //                 </div>

// //                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
// //                   {ledger.transactionType}
// //                 </span>

// //                 <div className="flex justify-center">
// //                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ledger.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
// //                     {ledger.itemType?.toUpperCase()}
// //                   </span>
// //                 </div>

// //                 <div className="flex items-center justify-end gap-1.5">
// //                   {isPositive ? (
// //                     <FaArrowUp className="text-emerald-500 text-xs" />
// //                   ) : (
// //                     <FaArrowDown className="text-red-400 text-xs" />
// //                   )}
// //                   <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
// //                     {isPositive ? "+" : ""}{ledger.quantityChanged}
// //                   </span>
// //                 </div>

// //                 <div className="flex items-center justify-end gap-1 text-sm">
// //                   <span className="text-gray-400">{ledger.balanceBefore}</span>
// //                   <span className="text-gray-300 mx-1">→</span>
// //                   <span className="font-bold text-[#212121]">{ledger.balanceAfter}</span>
// //                 </div>

// //                 <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2.5 py-1 rounded-full font-medium w-fit">
// //                   {ledger.initiatedByRole || "—"}
// //                 </span>
// //               </div>
// //             );
// //           })}

// //           {total > rows && (
// //             <div className="flex justify-center mt-4">
// //               <Paginator
// //                 first={page * rows}
// //                 rows={rows}
// //                 totalRecords={total}
// //                 rowsPerPageOptions={[20, 50, 100]}
// //                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
// //                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
// //               />
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // // ─── Main Page ────────────────────────────────────────────────────────────────
// // const Purchases = () => {
// //   const { businessId } = useBusiness();
// //   const toast = useRef(null);
// //   const [activeTab, setActiveTab] = useState("items");

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
// //       <Toast ref={toast} />

// //       <div className="max-w-7xl mx-auto space-y-6">

// //         {/* Stats Bar */}
// //         <div className="grid grid-cols-3 gap-6">
// //           {[
// //             { icon: <FaShoppingCart />, label: "Purchase Items", color: "text-[#0B77A7]", bg: "bg-blue-50" },
// //             // { icon: <FaFileInvoice />, label: "Purchase Records", color: "text-emerald-600", bg: "bg-emerald-50" },
// //             { icon: <MdInventory />, label: "Stock Ledger", color: "text-purple-600", bg: "bg-purple-50" },
// //           ].map((s) => (
// //             <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
// //               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.bg}`}>
// //                 {s.icon}
// //               </div>
// //               <p className="text-sm font-semibold text-gray-500">{s.label}</p>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Tab Bar */}
// //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
// //           {TABS.map((tab) => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setActiveTab(tab.key)}
// //               className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
// //                 ${activeTab === tab.key
// //                   ? "bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30"
// //                   : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
// //             >
// //               <span className="text-base">{tab.icon}</span>
// //               {tab.label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Tab Content */}
// //         <div>
// //           {activeTab === "items" && (
// //             <PurchaseItemsTab businessId={businessId} toast={toast} />
// //           )}
// //           {activeTab === "records" && (
// //             <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
// //               Item select karo "Purchase Items" tab se records dekhne ke liye — ya seedha Item ID se filter lagao.
// //             </div>
// //           )}
// //           {activeTab === "ledger" && (
// //             <StockLedgerTab businessId={businessId} toast={toast} />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Purchases;

// import { useState, useEffect, useRef, useCallback } from "react";
// import { apiGet } from "../services/api";
// import { useBusiness } from "../context/BusinessContext";
// import {
//   FaShoppingCart,
//   FaFileInvoice,
//   FaBook,
//   FaSearch,
//   FaFilter,
//   FaBoxOpen,
//   FaKey,
//   FaChevronDown,
//   FaChevronUp,
//   FaArrowUp,
//   FaArrowDown,
// } from "react-icons/fa";
// import { MdInventory } from "react-icons/md";
// import { Skeleton } from "primereact/skeleton";
// import { Tag } from "primereact/tag";
// import { Paginator } from "primereact/paginator";
// import { Dropdown } from "primereact/dropdown";
// import { Toast } from "primereact/toast";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const TABS = [
//   { key: "items", label: "Purchase Items", icon: <FaShoppingCart /> },
//   { key: "records", label: "Purchase Records", icon: <FaFileInvoice /> },
//   { key: "ledger", label: "Stock Ledger", icon: <FaBook /> },
// ];

// const STATUS_SEVERITY = {
//   completed: "success",
//   cancelled: "danger",
//   returned: "warning",
// };

// const TRANSACTION_COLORS = {
//   purchase: "text-emerald-600 bg-emerald-50",
//   sale: "text-red-500 bg-red-50",
//   return: "text-blue-500 bg-blue-50",
//   adjustment: "text-amber-500 bg-amber-50",
//   damage: "text-gray-500 bg-gray-100",
//   gift: "text-purple-500 bg-purple-50",
// };

// const fmt = (n) =>
//   Number(n || 0).toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   });

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// // ─── Sub-components ──────────────────────────────────────────────────────────

// const EmptyState = ({ message = "No data found" }) => (
//   <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
//     <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
//     <p className="text-gray-400 font-medium">{message}</p>
//   </div>
// );

// const LoadingGrid = ({ rows = 5, cols = 5 }) => (
//   <div className="space-y-3">
//     {Array.from({ length: rows }).map((_, i) => (
//       <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
//         {Array.from({ length: cols }).map((__, j) => (
//           <Skeleton key={j} height="44px" className="!rounded-xl" />
//         ))}
//       </div>
//     ))}
//   </div>
// );

// // ─── Tab: Purchase Items ──────────────────────────────────────────────────────
// const PurchaseItemsTab = ({ businessId, toast }) => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const [rows, setRows] = useState(20);
//   const [expandedItemId, setExpandedItemId] = useState(null);
//   const [recordsMap, setRecordsMap] = useState({});
//   const [recordsLoading, setRecordsLoading] = useState({});

//   const fetchItems = useCallback(async () => {
//     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
//     setLoading(true);
//     try {
//       const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
//         limit: rows,
//         offset: page * rows,
//       });
//       if (res.data.success) {
//         setItems(res.data.data.data || []);
//         setTotal(res.data.data.total || 0);
//       }
//     } catch (e) {
//       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase items" });
//     } finally {
//       setLoading(false);
//     }
//   }, [businessId, page, rows]);

//   useEffect(() => { fetchItems(); }, [fetchItems]);

//   const fetchRecords = async (itemId) => {
//     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;

//     // Toggle close if already expanded
//     if (expandedItemId === itemId) {
//       setExpandedItemId(null);
//       return;
//     }

//     // Use cached data if already fetched
//     if (recordsMap[itemId]) {
//       setExpandedItemId(itemId);
//       return;
//     }

//     setRecordsLoading((p) => ({ ...p, [itemId]: true }));
//     try {
//       const res = await apiGet(
//         `/seller/business/${businessId}/purchase/item/${itemId}/record`,
//         { limit: 50 }
//       );
//       console.log("Purchase Records Response:", res.data);
//       if (res.data.success) {
//         const records =
//           res.data.data?.data ||
//           res.data.data?.records ||
//           res.data.data?.items ||
//           (Array.isArray(res.data.data) ? res.data.data : []);
//         setRecordsMap((p) => ({ ...p, [itemId]: records }));
//         setExpandedItemId(itemId);
//       }
//     } catch (e) {
//       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load records" });
//     } finally {
//       setRecordsLoading((p) => ({ ...p, [itemId]: false }));
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {loading ? (
//         <LoadingGrid rows={5} cols={5} />
//       ) : items.length === 0 ? (
//         <EmptyState message="No purchase items found" />
//       ) : (
//         <>
//           {/* Table Header */}
//           <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
//             <span>Item</span>
//             <span className="text-center">Type</span>
//             <span className="text-right">Expected Price</span>
//             <span className="text-right">Current Stock</span>
//             <span className="text-right">Last Updated</span>
//           </div>

//           {items.map((item) => (
//             <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//               <div
//                 className="grid grid-cols-5 gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/40 transition-colors items-center"
//                 onClick={() => fetchRecords(item.itemId)}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center text-[#0B77A7]">
//                     {item.catalogItem?.itemType === "digital" ? <FaKey className="text-xs" /> : <FaBoxOpen className="text-xs" />}
//                   </div>
//                   <span className="text-sm font-semibold text-[#212121] truncate max-w-[140px]">
//                     {item.catalogItem?.title || item.itemId?.slice(0, 8) + "…"}
//                   </span>
//                 </div>

//                 <div className="flex justify-center">
//                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.catalogItem?.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
//                     {item.catalogItem?.itemType?.toUpperCase()}
//                   </span>
//                 </div>

//                 <span className="text-sm font-semibold text-right text-[#212121]">{fmt(item.expectedPurchasePrice)}</span>
//                 <span className="text-sm font-bold text-right text-emerald-600">
//                   {item.catalogItem?.itemType === "digital"
//                     ? item.catalogItem?.digitalAssets?.length ?? 0
//                     : item.catalogItem?.inventories?.[0]?.quantityAvailable ?? 0}
//                 </span>

//                 <div className="flex items-center justify-end gap-2">
//                   <span className="text-sm text-gray-500">{fmtDate(item.updatedAt)}</span>
//                   {recordsLoading[item.itemId] ? (
//                     <i className="pi pi-spin pi-spinner text-[#0B77A7] text-xs" />
//                   ) : expandedItemId === item.itemId ? (
//                     <FaChevronUp className="text-[#0B77A7] text-xs" />
//                   ) : (
//                     <FaChevronDown className="text-gray-400 text-xs" />
//                   )}
//                 </div>
//               </div>

//               {/* Expanded Records */}
//               {expandedItemId === item.itemId && recordsMap[item.itemId] && (
//                 <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
//                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
//                     Purchase Records ({recordsMap[item.itemId].length})
//                   </p>
//                   {recordsMap[item.itemId].length === 0 ? (
//                     <p className="text-sm text-gray-400">No records found.</p>
//                   ) : (
//                     recordsMap[item.itemId].map((rec) => (
//                       <div key={rec.id} className="grid grid-cols-5 gap-3 bg-white rounded-xl p-4 border border-gray-100 text-sm">
//                         <div>
//                           <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
//                           <p className="font-semibold text-[#212121]">{rec.invoiceNumber || "—"}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 mb-0.5">Date</p>
//                           <p className="font-medium text-gray-600">{fmtDate(rec.purchaseDate)}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 mb-0.5">Qty</p>
//                           <p className="font-bold text-emerald-600">{rec.quantityPurchased}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 mb-0.5">Total</p>
//                           <p className="font-semibold text-[#0B77A7]">{fmt(rec.totalAmount)}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 mb-0.5">Status</p>
//                           <Tag
//                             value={rec.status}
//                             severity={STATUS_SEVERITY[rec.status] || "info"}
//                             className="!text-[10px] !px-2.5 !py-1 !rounded-full !font-bold capitalize"
//                           />
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}

//           {total > rows && (
//             <div className="flex justify-center mt-4">
//               <Paginator
//                 first={page * rows}
//                 rows={rows}
//                 totalRecords={total}
//                 rowsPerPageOptions={[20, 50, 100]}
//                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
//                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ─── Tab: Stock Ledger ────────────────────────────────────────────────────────
// const StockLedgerTab = ({ businessId, toast }) => {
//   const [ledgers, setLedgers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const [rows, setRows] = useState(20);
//   const [filters, setFilters] = useState({
//     transactionType: null,
//     itemType: null,
//   });

//   const fetchLedger = useCallback(async () => {
//     if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
//     setLoading(true);
//     try {
//       const params = { limit: rows, offset: page * rows };
//       if (filters.transactionType) params.transactionType = filters.transactionType;
//       if (filters.itemType) params.itemType = filters.itemType;

//       const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, params);
//       if (res.data.success) {
//         setLedgers(res.data.data.data || []);
//         setTotal(res.data.data.total || 0);
//       }
//     } catch (e) {
//       toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load ledger" });
//     } finally {
//       setLoading(false);
//     }
//   }, [businessId, page, rows, filters]);

//   useEffect(() => { fetchLedger(); }, [fetchLedger]);

//   return (
//     <div className="space-y-4">
//       {/* Filters */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <Dropdown
//           value={filters.transactionType}
//           options={[
//             { label: "Purchase", value: "purchase" },
//             { label: "Sale", value: "sale" },
//             { label: "Return", value: "return" },
//             { label: "Adjustment", value: "adjustment" },
//             { label: "Damage", value: "damage" },
//             { label: "Gift", value: "gift" },
//           ]}
//           onChange={(e) => { setFilters({ ...filters, transactionType: e.value }); setPage(0); }}
//           placeholder="Transaction Type"
//           showClear
//           className="!rounded-xl"
//           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
//         />
//         <Dropdown
//           value={filters.itemType}
//           options={[
//             { label: "Physical", value: "physical" },
//             { label: "Digital", value: "digital" },
//           ]}
//           onChange={(e) => { setFilters({ ...filters, itemType: e.value }); setPage(0); }}
//           placeholder="Item Type"
//           showClear
//           className="!rounded-xl"
//           inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
//         />
//       </div>

//       {loading ? (
//         <LoadingGrid rows={6} cols={6} />
//       ) : ledgers.length === 0 ? (
//         <EmptyState message="No ledger entries found" />
//       ) : (
//         <>
//           {/* Table Header */}
//           <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
//             <span>Item / Date</span>
//             <span>Transaction</span>
//             <span className="text-center">Type</span>
//             <span className="text-right">Change</span>
//             <span className="text-right">Prev → New</span>
//             <span>Role</span>
//           </div>

//           {ledgers.map((ledger) => {
//             const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
//             const isPositive = ledger.quantityChanged > 0;

//             return (
//               <div
//                 key={ledger.id}
//                 className="grid grid-cols-6 gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow"
//               >
//                 <div>
//                   <p className="text-sm text-gray-700 font-semibold truncate">{ledger.CatalogItem?.title || "—"}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{fmtDate(ledger.createdAt)}</p>
//                 </div>

//                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
//                   {ledger.transactionType}
//                 </span>

//                 <div className="flex justify-center">
//                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ledger.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
//                     {ledger.itemType?.toUpperCase()}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-end gap-1.5">
//                   {isPositive ? (
//                     <FaArrowUp className="text-emerald-500 text-xs" />
//                   ) : (
//                     <FaArrowDown className="text-red-400 text-xs" />
//                   )}
//                   <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
//                     {isPositive ? "+" : ""}{ledger.quantityChanged}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-end gap-1 text-sm">
//                   <span className="text-gray-400">{ledger.balanceBefore}</span>
//                   <span className="text-gray-300 mx-1">→</span>
//                   <span className="font-bold text-[#212121]">{ledger.balanceAfter}</span>
//                 </div>

//                 <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2.5 py-1 rounded-full font-medium w-fit">
//                   {ledger.initiatedByRole || "—"}
//                 </span>
//               </div>
//             );
//           })}

//           {total > rows && (
//             <div className="flex justify-center mt-4">
//               <Paginator
//                 first={page * rows}
//                 rows={rows}
//                 totalRecords={total}
//                 rowsPerPageOptions={[20, 50, 100]}
//                 onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
//                 className="!border-none !bg-white !rounded-2xl !shadow-sm"
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ─── Main Page ────────────────────────────────────────────────────────────────
// const Purchases = () => {
//   const { businessId } = useBusiness();
//   const toast = useRef(null);
//   const [activeTab, setActiveTab] = useState("items");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
//       <Toast ref={toast} />

//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* Stats Bar */}
//         <div className="grid grid-cols-3 gap-6">
//           {[
//             { icon: <FaShoppingCart />, label: "Purchase Items", color: "text-[#0B77A7]", bg: "bg-blue-50" },
//             { icon: <FaFileInvoice />, label: "Purchase Records", color: "text-emerald-600", bg: "bg-emerald-50" },
//             { icon: <MdInventory />, label: "Stock Ledger", color: "text-purple-600", bg: "bg-purple-50" },
//           ].map((s) => (
//             <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.bg}`}>
//                 {s.icon}
//               </div>
//               <p className="text-sm font-semibold text-gray-500">{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Tab Bar */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
//                 ${activeTab === tab.key
//                   ? "bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30"
//                   : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
//             >
//               <span className="text-base">{tab.icon}</span>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div>
//           {activeTab === "items" && (
//             <PurchaseItemsTab businessId={businessId} toast={toast} />
//           )}
//           {activeTab === "records" && (
//             <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
//               Item select karo "Purchase Items" tab se records dekhne ke liye — ya seedha Item ID se filter lagao.
//             </div>
//           )}
//           {activeTab === "ledger" && (
//             <StockLedgerTab businessId={businessId} toast={toast} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Purchases;


import { useState, useEffect, useRef, useCallback } from "react";
import { apiGet } from "../services/api";
import { useBusiness } from "../context/BusinessContext";
import {
  FaShoppingCart,
  FaBook,
  FaBoxOpen,
  FaKey,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "items", label: "Purchase Items", icon: <FaShoppingCart /> },
  { key: "ledger", label: "Stock Ledger", icon: <FaBook /> },
];

const STATUS_SEVERITY = {
  completed: "success",
  cancelled: "danger",
  returned: "warning",
};

const TRANSACTION_COLORS = {
  purchase: "text-emerald-600 bg-emerald-50",
  sale: "text-red-500 bg-red-50",
  return: "text-blue-500 bg-blue-50",
  adjustment: "text-amber-500 bg-amber-50",
  damage: "text-gray-500 bg-gray-100",
  gift: "text-purple-500 bg-purple-50",
};

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Sub-components ──────────────────────────────────────────────────────────

const EmptyState = ({ message = "No data found" }) => (
  <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
    <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
    <p className="text-gray-400 font-medium">{message}</p>
  </div>
);

const LoadingGrid = ({ rows = 5, cols = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((__, j) => (
          <Skeleton key={j} height="44px" className="!rounded-xl" />
        ))}
      </div>
    ))}
  </div>
);

// ─── Tab: Purchase Items ──────────────────────────────────────────────────────
const PurchaseItemsTab = ({ businessId, toast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(20);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [recordsMap, setRecordsMap] = useState({});
  const [recordsLoading, setRecordsLoading] = useState({});
  const navigate = useNavigate()

  const fetchItems = useCallback(async () => {
    if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
    setLoading(true);
    try {
      const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
        limit: rows,
        offset: page * rows,
      });
      if (res.data.success) {
        setItems(res.data.data.data || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase items" });
    } finally {
      setLoading(false);
    }
  }, [businessId, page, rows]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const fetchRecords = async (itemId) => {
    if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;

    // Toggle close if already expanded
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      return;
    }

    // Use cached data if already fetched
    if (recordsMap[itemId]) {
      setExpandedItemId(itemId);
      return;
    }

    setRecordsLoading((p) => ({ ...p, [itemId]: true }));
    try {
      const res = await apiGet(
        `/seller/business/${businessId}/purchase/item/${itemId}/record`,
        { limit: 50 }
      );
      console.log("Purchase Records Response:", res.data);
      if (res.data.success) {
        const records =
          res.data.data?.data ||
          res.data.data?.records ||
          res.data.data?.items ||
          (Array.isArray(res.data.data) ? res.data.data : []);
        setRecordsMap((p) => ({ ...p, [itemId]: records }));
        setExpandedItemId(itemId);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load records" });
    } finally {
      setRecordsLoading((p) => ({ ...p, [itemId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <LoadingGrid rows={5} cols={5} />
      ) : items.length === 0 ? (
        <EmptyState message="No purchase items found" />
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Item</span>
            <span className="text-center">Type</span>
            <span className="text-right">Current Stock</span>
            <span className="text-right">Last Updated</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="grid grid-cols-4 gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/40 transition-colors items-center"
                onClick={() => navigate(`/dashboard/purchase-item/${item.itemId}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0B77A7]/10 flex items-center justify-center text-[#0B77A7]">
                    {item.catalogItem?.itemType === "digital" ? <FaKey className="text-xs" /> : <FaBoxOpen className="text-xs" />}
                  </div>
                  <span className="text-sm font-semibold text-[#212121] truncate max-w-[140px]">
                    {item.catalogItem?.title || item.itemId?.slice(0, 8) + "…"}
                  </span>
                </div>

                <div className="flex justify-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.catalogItem?.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {item.catalogItem?.itemType?.toUpperCase()}
                  </span>
                </div>

                <span className="text-sm font-bold text-right text-emerald-600">
                  {item.catalogItem?.itemType === "digital"
                    ? item.catalogItem?.digitalAssets?.length ?? 0
                    : item.catalogItem?.inventories?.[0]?.quantityAvailable ?? 0}
                </span>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-gray-500">{fmtDate(item.updatedAt)}</span>
                  {recordsLoading[item.itemId] ? (
                    <i className="pi pi-spin pi-spinner text-[#0B77A7] text-xs" />
                  ) : expandedItemId === item.itemId ? (
                    <FaChevronUp className="text-[#0B77A7] text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  )}
                </div>
              </div>

              {/* Expanded Records */}
              {expandedItemId === item.itemId && recordsMap[item.itemId] && (
                <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Purchase Records ({recordsMap[item.itemId].length})
                  </p>
                  {recordsMap[item.itemId].length === 0 ? (
                    <p className="text-sm text-gray-400">No records found.</p>
                  ) : (
                    recordsMap[item.itemId].map((rec) => (
                      <div key={rec.id} className="grid grid-cols-5 gap-3 bg-white rounded-xl p-4 border border-gray-100 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
                          <p className="font-semibold text-[#212121]">{rec.invoiceNumber || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Date</p>
                          <p className="font-medium text-gray-600">{fmtDate(rec.purchaseDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Qty</p>
                          <p className="font-bold text-emerald-600">{rec.quantityPurchased}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Total</p>
                          <p className="font-semibold text-[#0B77A7]">{fmt(rec.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Status</p>
                          <Tag
                            value={rec.status}
                            severity={STATUS_SEVERITY[rec.status] || "info"}
                            className="!text-[10px] !px-2.5 !py-1 !rounded-full !font-bold capitalize"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}

          {total > rows && (
            <div className="flex justify-center mt-4">
              <Paginator
                first={page * rows}
                rows={rows}
                totalRecords={total}
                rowsPerPageOptions={[20, 50, 100]}
                onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
                className="!border-none !bg-white !rounded-2xl !shadow-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Tab: Stock Ledger ────────────────────────────────────────────────────────
const StockLedgerTab = ({ businessId, toast }) => {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(20);
  const [filters, setFilters] = useState({
    transactionType: null,
    itemType: null,
  });

  const fetchLedger = useCallback(async () => {
    if (!businessId || typeof businessId !== "string" || businessId.length < 10) return;
    setLoading(true);
    try {
      const params = { limit: rows, offset: page * rows };
      if (filters.transactionType) params.transactionType = filters.transactionType;
      if (filters.itemType) params.itemType = filters.itemType;

      const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, params);
      if (res.data.success) {
        setLedgers(res.data.data.data || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load ledger" });
    } finally {
      setLoading(false);
    }
  }, [businessId, page, rows, filters]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Dropdown
          value={filters.transactionType}
          options={[
            { label: "Purchase", value: "purchase" },
            { label: "Sale", value: "sale" },
            { label: "Return", value: "return" },
            { label: "Adjustment", value: "adjustment" },
            { label: "Damage", value: "damage" },
            { label: "Gift", value: "gift" },
          ]}
          onChange={(e) => { setFilters({ ...filters, transactionType: e.value }); setPage(0); }}
          placeholder="Transaction Type"
          showClear
          className="!rounded-xl"
          inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
        />
        <Dropdown
          value={filters.itemType}
          options={[
            { label: "Physical", value: "physical" },
            { label: "Digital", value: "digital" },
          ]}
          onChange={(e) => { setFilters({ ...filters, itemType: e.value }); setPage(0); }}
          placeholder="Item Type"
          showClear
          className="!rounded-xl"
          inputClassName="!bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] !py-2.5 !text-sm"
        />
      </div>

      {loading ? (
        <LoadingGrid rows={6} cols={6} />
      ) : ledgers.length === 0 ? (
        <EmptyState message="No ledger entries found" />
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Item / Date</span>
            <span>Transaction</span>
            <span className="text-center">Type</span>
            <span className="text-right">Change</span>
            <span className="text-right">Prev → New</span>
            <span>Role</span>
          </div>

          {ledgers.map((ledger) => {
            const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
            const isPositive = ledger.quantityChanged > 0;

            return (
              <div
                key={ledger.id}
                className="grid grid-cols-6 gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-700 font-semibold truncate">{ledger.CatalogItem?.title || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtDate(ledger.createdAt)}</p>
                </div>

                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
                  {ledger.transactionType}
                </span>

                <div className="flex justify-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ledger.itemType === "digital" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {ledger.itemType?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1.5">
                  {isPositive ? (
                    <FaArrowUp className="text-emerald-500 text-xs" />
                  ) : (
                    <FaArrowDown className="text-red-400 text-xs" />
                  )}
                  <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{ledger.quantityChanged}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1 text-sm">
                  <span className="text-gray-400">{ledger.balanceBefore}</span>
                  <span className="text-gray-300 mx-1">→</span>
                  <span className="font-bold text-[#212121]">{ledger.balanceAfter}</span>
                </div>

                <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2.5 py-1 rounded-full font-medium w-fit">
                  {ledger.initiatedByRole || "—"}
                </span>
              </div>
            );
          })}

          {total > rows && (
            <div className="flex justify-center mt-4">
              <Paginator
                first={page * rows}
                rows={rows}
                totalRecords={total}
                rowsPerPageOptions={[20, 50, 100]}
                onPageChange={(e) => { setPage(e.page); setRows(e.rows); }}
                className="!border-none !bg-white !rounded-2xl !shadow-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Purchases = () => {
  const { businessId } = useBusiness();
  const toast = useRef(null);
  const [activeTab, setActiveTab] = useState("items");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] p-6 animate-fade-in">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { icon: <FaShoppingCart />, label: "Purchase Items", color: "text-[#0B77A7]", bg: "bg-blue-50" },
            { icon: <MdInventory />, label: "Stock Ledger", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.bg}`}>
                {s.icon}
              </div>
              <p className="text-sm font-semibold text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
                ${activeTab === tab.key
                  ? "bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "items" && (
            <PurchaseItemsTab businessId={businessId} toast={toast} />
          )}
          {activeTab === "ledger" && (
            <StockLedgerTab businessId={businessId} toast={toast} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;