import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";
import { useBusiness } from "../context/BusinessContext";
import {
  FaBoxOpen,
  FaKey,
  FaArrowLeft,
  FaArrowUp,
  FaArrowDown,
  FaFileInvoice,
  FaBox,
  FaWarehouse,
  FaCalendarAlt,
  FaLayerGroup,
  FaTags,
} from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_SEVERITY = {
  completed: "success",
  cancelled: "danger",
  returned: "warning",
  pending: "warning",
  active: "success",
};

const TRANSACTION_COLORS = {
  purchase: "text-emerald-600 bg-emerald-50",
  sale: "text-red-500 bg-red-50",
  return: "text-blue-500 bg-blue-50",
  adjustment: "text-amber-500 bg-amber-50",
  damage: "text-gray-500 bg-gray-100",
  gift: "text-purple-500 bg-purple-50",
};

const PRIMARY = "#0B77A7";

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

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <Skeleton height="90px" className="!rounded-2xl" />
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} height="80px" className="!rounded-xl" />)}
    </div>
    <Skeleton height="200px" className="!rounded-2xl" />
    <Skeleton height="160px" className="!rounded-2xl" />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent = PRIMARY }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm"
      style={{ backgroundColor: `${accent}15`, color: accent }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#212121] truncate">{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PurchaseItemDetailScreen = () => {
  const { itemId } = useParams();
  const { businessId } = useBusiness();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [itemDetail, setItemDetail] = useState(null);
  const [records, setRecords] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [ledgersLoading, setLedgersLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("records");
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [recordsPage, setRecordsPage] = useState(0);
  const [recordsRows] = useState(10);
  const [ledgersTotal, setLedgersTotal] = useState(0);
  const [ledgersPage, setLedgersPage] = useState(0);
  const [ledgersRows] = useState(10);

  // ── Fetch the purchase item detail (look up from the list endpoint)
  const fetchItemDetail = useCallback(async () => {
    if (!businessId || !itemId) return;
    setLoading(true);
    try {
      const res = await apiGet(`/seller/business/${businessId}/purchase/item`, {
        itemId,
        limit: 1,
      });
      if (res.data.success) {
        const data = res.data.data?.data || res.data.data || [];
        const found = Array.isArray(data) ? data.find((d) => d.itemId === itemId) || data[0] : data;
        setItemDetail(found || null);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load item details" });
    } finally {
      setLoading(false);
    }
  }, [businessId, itemId]);

  // ── Fetch purchase records for this item
  const fetchRecords = useCallback(async () => {
    if (!businessId || !itemId) return;
    setRecordsLoading(true);
    try {
      const res = await apiGet(
        `/seller/business/${businessId}/purchase/item/${itemId}/record`,
        { limit: recordsRows, offset: recordsPage * recordsRows }
      );
      if (res.data.success) {
        const d = res.data.data;
        const list =
          d?.data ||
          d?.records ||
          d?.items ||
          (Array.isArray(d) ? d : []);
        setRecords(list);
        setRecordsTotal(d?.total || list.length);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load purchase records" });
    } finally {
      setRecordsLoading(false);
    }
  }, [businessId, itemId, recordsPage, recordsRows]);

  // ── Fetch stock ledger filtered to this item
  const fetchLedgers = useCallback(async () => {
    if (!businessId || !itemId) return;
    setLedgersLoading(true);
    try {
      const res = await apiGet(`/seller/business/${businessId}/stock-ledger`, {
        itemId,
        limit: ledgersRows,
        offset: ledgersPage * ledgersRows,
      });
      if (res.data.success) {
        const d = res.data.data;
        setLedgers(d?.data || []);
        setLedgersTotal(d?.total || 0);
      }
    } catch (e) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load stock ledger" });
    } finally {
      setLedgersLoading(false);
    }
  }, [businessId, itemId, ledgersPage, ledgersRows]);

  useEffect(() => { fetchItemDetail(); }, [fetchItemDetail]);
  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { fetchLedgers(); }, [fetchLedgers]);

  // ── Derived values
  const catalogItem = itemDetail?.catalogItem;
  const isDigital = catalogItem?.itemType === "digital";
  const currentStock = isDigital
    ? catalogItem?.digitalAssets?.length ?? 0
    : catalogItem?.inventories?.[0]?.quantityAvailable ?? 0;

  const TABS = [
    { key: "records", label: "Purchase Records", icon: <FaFileInvoice /> },
    { key: "ledger", label: "Stock Ledger", icon: <MdInventory /> },
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0B77A7] transition-colors group"
        >
          <span
            className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-[#0B77A7]/30 group-hover:bg-blue-50 transition-all"
          >
            <FaArrowLeft className="text-xs" />
          </span>
          Back to Purchases
        </button>

        {/* ── Header Card ── */}
        {loading ? (
          <DetailSkeleton />
        ) : (
          <>
            {/* Hero Header */}
            <div
              className="flex justify-between items-center p-6 rounded-2xl border border-gray-100"
              style={{ backgroundColor: `${PRIMARY}10` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
                >
                  {isDigital ? <FaKey /> : <FaBoxOpen />}
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: PRIMARY }}
                  >
                    {isDigital ? "Digital Item" : "Physical Item"}
                  </p>
                  <p className="font-bold text-base text-[#212121]">
                    {catalogItem?.title || itemId}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    ID: {itemId?.slice(0, 16)}…
                  </p>
                </div>
              </div>

              <Tag
                value={isDigital ? "DIGITAL" : "PHYSICAL"}
                className="!text-xs !px-3 !py-1.5 !rounded-full !font-bold"
                style={{
                  backgroundColor: isDigital ? "#7c3aed20" : `${PRIMARY}20`,
                  color: isDigital ? "#7c3aed" : PRIMARY,
                  border: "none",
                }}
              />
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<FaWarehouse />}
                label="Current Stock"
                value={currentStock}
                sub="units available"
                accent={currentStock > 0 ? "#10b981" : "#f59e0b"}
              />
              <StatCard
                icon={<FaTags />}
                label="Expected Price"
                value={fmt(itemDetail?.expectedPurchasePrice)}
                sub="per unit"
                accent={PRIMARY}
              />
              <StatCard
                icon={<FaCalendarAlt />}
                label="Last Updated"
                value={fmtDate(itemDetail?.updatedAt)}
                sub={itemDetail?.createdAt ? `Created ${fmtDate(itemDetail.createdAt)}` : undefined}
                accent="#6366f1"
              />
            </div>

            {/* ── Digital Assets Info ── */}
            {isDigital && catalogItem?.digitalAssets?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-[#212121] flex items-center gap-2">
                  <FaKey style={{ color: "#7c3aed" }} /> Digital Assets
                  <span className="ml-auto text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {catalogItem.digitalAssets.length} keys
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {catalogItem.digitalAssets.map((asset, i) => (
                    <div
                      key={i}
                      className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 flex items-center justify-between"
                    >
                      <span className="font-mono text-xs text-purple-700 truncate max-w-[80%]">
                        {asset.key || asset.code || asset.value || `Asset #${i + 1}`}
                      </span>
                      {asset.status && (
                        <Tag
                          value={asset.status}
                          severity={asset.status === "available" ? "success" : "warning"}
                          className="!text-[9px] !px-2 !py-0.5 !rounded-full !font-bold shrink-0"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Physical Inventory Info ── */}
            {!isDigital && catalogItem?.inventories?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-[#212121] mb-3 flex items-center gap-2">
                  <FaLayerGroup style={{ color: PRIMARY }} /> Inventory Locations
                </h4>
                <div className="space-y-2">
                  {catalogItem.inventories.map((inv, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5"
                    >
                      <span className="text-xs font-semibold text-gray-600">
                        {inv.warehouseName || inv.location || `Location ${i + 1}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          Reserved: <span className="font-bold text-amber-600">{inv.quantityReserved ?? 0}</span>
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
                        >
                          {inv.quantityAvailable ?? 0} avail
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
                    ${activeTab === tab.key
                      ? "text-white shadow-lg"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#0B77A7]"}`}
                  style={activeTab === tab.key ? { backgroundColor: PRIMARY, boxShadow: `0 8px 24px ${PRIMARY}40` } : {}}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Purchase Records ── */}
            {activeTab === "records" && (
              <div className="space-y-4">
                {recordsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} height="72px" className="!rounded-xl" />)}
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <FaFileInvoice className="text-4xl text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">No purchase records found</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>Invoice</span>
                      <span>Date</span>
                      <span className="text-center">Qty</span>
                      <span className="text-right">Total</span>
                      <span className="text-right">Status</span>
                    </div>

                    {records.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 grid grid-cols-5 gap-4 items-center hover:shadow-md transition-shadow"
                      >
                        {/* Invoice */}
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Invoice</p>
                          <p className="text-sm font-bold text-[#212121] font-mono">
                            {rec.invoiceNumber || "—"}
                          </p>
                        </div>

                        {/* Date */}
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Purchase Date</p>
                          <p className="text-sm text-gray-600 font-medium">{fmtDate(rec.purchaseDate)}</p>
                        </div>

                        {/* Qty */}
                        <div className="flex justify-center">
                          <span
                            className="text-sm font-bold px-3 py-1 rounded-lg"
                            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
                          >
                            ×{rec.quantityPurchased}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 mb-0.5">Total Amount</p>
                          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
                            {fmt(rec.totalAmount)}
                          </p>
                          {rec.unitCost && (
                            <p className="text-[10px] text-gray-400">
                              {fmt(rec.unitCost)} / unit
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <div className="flex justify-end">
                          <Tag
                            value={(rec.status || "—").toUpperCase()}
                            severity={STATUS_SEVERITY[rec.status] || "info"}
                            className="!text-[9px] !px-2.5 !py-1 !rounded-full !font-bold"
                          />
                        </div>
                      </div>
                    ))}

                    {recordsTotal > recordsRows && (
                      <div className="flex justify-center mt-2">
                        <Paginator
                          first={recordsPage * recordsRows}
                          rows={recordsRows}
                          totalRecords={recordsTotal}
                          onPageChange={(e) => setRecordsPage(e.page)}
                          className="!border-none !bg-white !rounded-2xl !shadow-sm"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Tab: Stock Ledger ── */}
            {activeTab === "ledger" && (
              <div className="space-y-4">
                {ledgersLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} height="72px" className="!rounded-xl" />)}
                  </div>
                ) : ledgers.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <MdInventory className="text-4xl text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">No ledger entries found for this item</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>Date</span>
                      <span>Transaction</span>
                      <span className="text-right">Change</span>
                      <span className="text-right">Prev → New</span>
                      <span>By</span>
                    </div>

                    {ledgers.map((ledger) => {
                      const colorClass = TRANSACTION_COLORS[ledger.transactionType] || "text-gray-500 bg-gray-100";
                      const isPositive = ledger.quantityChanged > 0;

                      return (
                        <div
                          key={ledger.id}
                          className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 grid grid-cols-5 gap-4 items-center hover:shadow-md transition-shadow"
                        >
                          <div>
                            <p className="text-sm text-gray-600 font-medium">{fmtDate(ledger.createdAt)}</p>
                          </div>

                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit capitalize ${colorClass}`}>
                            {ledger.transactionType}
                          </span>

                          <div className="flex items-center justify-end gap-1.5">
                            {isPositive
                              ? <FaArrowUp className="text-emerald-500 text-xs" />
                              : <FaArrowDown className="text-red-400 text-xs" />
                            }
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

                    {ledgersTotal > ledgersRows && (
                      <div className="flex justify-center mt-2">
                        <Paginator
                          first={ledgersPage * ledgersRows}
                          rows={ledgersRows}
                          totalRecords={ledgersTotal}
                          onPageChange={(e) => setLedgersPage(e.page)}
                          className="!border-none !bg-white !rounded-2xl !shadow-sm"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseItemDetailScreen;
