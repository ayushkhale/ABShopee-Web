import { useState, useEffect, useRef, useCallback } from "react";
import { apiGet } from "../services/api";
import { useBusiness } from "../context/BusinessContext";
// PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
// Icons
import {
  FaMoneyCheckAlt,
  FaUndo,
  FaFilter,
  FaClock,
  FaSearch,
  FaCreditCard,
  FaBox,
  FaArrowDown,
  FaArrowUp,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaReceipt,
} from "react-icons/fa";

// --- Static Constants (Moved outside to prevent production re-render loops) ---
const color = {
  primary: "#0B77A7",
  secondary: "#0057ae",
  background: "#F5F5F5",
  text: "#212121",
};

const statusOptions = [
  { label: "Success", value: "success" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

const typeOptions = [
  { label: "Payment", value: "payment" },
  { label: "Refund", value: "refund" },
];

const providerOptions = [
  { label: "Razorpay", value: "razorpay" },
  { label: "Stripe", value: "stripe" },
];

const Transactions = () => {
  const { businessId } = useBusiness();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  // --- Data State ---
  const [transactions, setTransactions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // --- Query Params ---
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [dates, setDates] = useState(null);
  const [status, setStatus] = useState(null);
  const [type, setType] = useState(null);
  const [provider, setProvider] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // --- Fetch Logic (Wrapped in useCallback to prevent infinite loops) ---
  const fetchTransactions = useCallback(
    async (isMounted = true) => {
      if (!businessId) return;
      setLoading(true);
      try {
        const params = {
          page,
          limit: rows,
        };
        if (status) params.status = status;
        if (type) params.transactionType = type;
        if (provider) params.provider = provider;
        if (searchId && searchId.trim()) params.transactionId = searchId.trim();
        if (dates?.[0]) params.fromDate = dates[0].toISOString();
        if (dates?.[1]) params.toDate = dates[1].toISOString();

        const response = await apiGet(
          `/seller/business/${businessId}/transactions`,
          params,
        );

        if (!isMounted) return;

        if (searchId && searchId.trim()) {
          const transaction = response.data?.data?.transaction;
          if (transaction) {
            setTransactions([
              {
                transactionId: transaction.id,
                orderId: transaction.orderId,
                type: transaction.transactionType,
                status: transaction.status,
                provider: transaction.provider,
                method: transaction.method,
                amount: transaction.amount,
                currency: transaction.currency,
                createdAt: transaction.createdAt,
                orderPreview: transaction.orderPreview,
              },
            ]);
            setTotalRecords(1);
          } else {
            setTransactions([]);
            setTotalRecords(0);
          }
        } else {
          if (response.data?.data?.transactions) {
            setTransactions(response.data.data.transactions);
            setTotalRecords(response.data.data.total || 0);
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.current?.show({
            severity: "error",
            summary: "Failed",
            detail: "Could not load transactions",
          });
          setTransactions([]);
          setTotalRecords(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    },
    [businessId, page, rows, status, type, provider, searchId, dates],
  );

  // --- Lifecycle ---
  useEffect(() => {
    let isMounted = true;
    fetchTransactions(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchTransactions]);

  const fetchSingleTransaction = async (transactionId) => {
    setLoading(true);
    try {
      const response = await apiGet(
        `/seller/business/${businessId}/transactions`,
        { transactionId },
      );
      const transaction = response.data?.data?.transaction;
      if (transaction) {
        setSelectedTransaction(transaction);
        setShowDetailDialog(true);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Failed",
        detail: "Could not load transaction details",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Templates (Performance Optimized) ---
  const transactionIdTemplate = (row) => (
    <div className="flex flex-col gap-1">
      <span
        className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg w-fit"
        style={{ backgroundColor: `${color.primary}15`, color: color.primary }}
      >
        #{row.transactionId.slice(0, 8)}
      </span>
      <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
        <FaClock className="text-[8px]" />
        {new Date(row.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );

  const typeTemplate = (row) => (
    <Tag
      value={row.type.toUpperCase()}
      severity={row.type === "payment" ? "success" : "warning"}
      className="!text-[10px] !px-3 !py-1 !rounded-full !font-bold"
    />
  );

  const statusTemplate = (row) => {
    const map = { success: "success", pending: "warning", failed: "danger" };
    return (
      <Tag
        value={row.status.toUpperCase()}
        severity={map[row.status]}
        className="!text-[10px] !px-3 !py-1 !rounded-full !font-bold"
      />
    );
  };

  const amountTemplate = (row) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          row.type === "refund" ? "bg-red-100" : "bg-emerald-100"
        }`}
      >
        {row.type === "refund" ? (
          <FaArrowDown className="text-xs text-red-600" />
        ) : (
          <FaArrowUp className="text-xs text-emerald-600" />
        )}
      </div>
      <span className="font-bold text-sm text-[#212121]">
        {row.amount.toLocaleString("en-IN", {
          style: "currency",
          currency: row.currency || "INR",
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );

  const orderPreviewTemplate = (row) => (
    <div className="flex flex-col gap-1.5">
      {row.orderPreview?.items?.slice(0, 2).map((item, i) => (
        <span
          key={i}
          className="text-xs text-[#212121] font-semibold truncate max-w-[200px]"
        >
          {item.quantity}x {item.title}
        </span>
      ))}
      {row.orderPreview?.items?.length > 2 && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
          style={{
            backgroundColor: `${color.primary}15`,
            color: color.primary,
          }}
        >
          +{row.orderPreview.items.length - 2} more
        </span>
      )}
    </div>
  );

  const onRowSelect = (e) => {
    fetchSingleTransaction(e.data.transactionId);
  };

  return (
    <div className="pb-20 animate-fade-in">
      <Toast ref={toast} />
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Payments & refunds across your business
          </p>
        </div>
        <Button
          icon={<FaFilter className="mr-2 text-xs" />}
          label={showFilters ? "Hide Filters" : "Show Filters"}
          onClick={() => setShowFilters((p) => !p)}
          className={`!rounded-xl !px-5 !py-3 !text-sm !font-semibold transition-all shadow-sm ${
            showFilters
              ? "!border-none !text-white shadow-md"
              : "!bg-gray-100 !text-gray-600 !border-none"
          }`}
          style={showFilters ? { backgroundColor: color.primary } : {}}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 px-6 py-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <Dropdown
              value={type}
              options={typeOptions}
              onChange={(e) => {
                setType(e.value);
                setPage(1);
              }}
              placeholder="Type"
              className="w-52"
              showClear
            />
            <Dropdown
              value={status}
              options={statusOptions}
              onChange={(e) => {
                setStatus(e.value);
                setPage(1);
              }}
              placeholder="Status"
              className="w-44"
              showClear
            />
            <Dropdown
              value={provider}
              options={providerOptions}
              onChange={(e) => {
                setProvider(e.value);
                setPage(1);
              }}
              placeholder="Provider"
              className="w-52"
              showClear
            />
            <Calendar
              value={dates}
              onChange={(e) => setDates(e.value)}
              selectionMode="range"
              readOnlyInput
              placeholder="Select date range"
              className="w-64"
              showIcon
            />
            <div className="relative flex-1 min-w-[240px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <InputText
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchTransactions()}
                placeholder="Search by transaction ID"
                className="w-full !pl-10 !pr-4 !py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 text-sm"
              />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                icon={<FaUndo />}
                onClick={() => {
                  setStatus(null);
                  setType(null);
                  setProvider(null);
                  setDates(null);
                  setSearchId("");
                  setPage(1);
                }}
                className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !w-10 !h-10"
              />
              <Button
                label="Apply Filters"
                onClick={() => fetchTransactions()}
                className="!border-none !rounded-xl !px-6 !py-3 !text-sm !font-bold"
                style={{ backgroundColor: color.primary }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xs">
        <DataTable
          value={transactions}
          loading={loading}
          selectionMode="single"
          onRowSelect={onRowSelect}
          dataKey="transactionId"
          className="p-datatable-sm"
          rowClassName={() =>
            "cursor-pointer hover:bg-blue-50/50 transition-colors"
          }
          emptyMessage={
            <div className="py-24 text-center">
              <FaReceipt className="mx-auto mb-4 text-5xl text-gray-200" />
              <p className="font-medium text-gray-500">No transactions found</p>
            </div>
          }
        >
          <Column
            header="TRANSACTION ID"
            body={transactionIdTemplate}
            style={{ width: "180px" }}
            className="pl-6"
          />
          <Column header="ORDER ITEMS" body={orderPreviewTemplate} />
          <Column
            header="DATE"
            body={(r) => (
              <span className="text-xs font-semibold text-gray-600">
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          />
          <Column header="TYPE" body={typeTemplate} />
          <Column header="STATUS" body={statusTemplate} />
          <Column
            header="AMOUNT"
            body={amountTemplate}
            className="pr-6"
            style={{ width: "160px" }}
          />
        </DataTable>
        <Paginator
          first={(page - 1) * rows}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={(e) => {
            setPage(e.page + 1);
            setRows(e.rows);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          className="!border-t !border-gray-100 !py-4"
        />
      </div>

      {/* Detail Dialog - ALL ORIGINAL CONTENT RESTORED */}
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                backgroundColor: `${color.primary}15`,
                color: color.primary,
              }}
            >
              <FaReceipt />
            </div>
            <span className="text-lg font-bold text-[#212121]">
              Transaction Details
            </span>
          </div>
        }
        visible={showDetailDialog}
        style={{ width: "600px" }}
        onHide={() => {
          setShowDetailDialog(false);
          setSelectedTransaction(null);
        }}
        className="rounded-2xl"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <i
              className="mb-4 text-3xl pi pi-spin pi-spinner"
              style={{ color: color.primary }}
            ></i>
            <span className="text-sm font-semibold text-gray-600">
              Loading transaction details…
            </span>
          </div>
        )}
        {!loading && selectedTransaction && (
          <div className="pt-4 space-y-6">
            {/* Header Card */}
            <div
              className="p-5 border border-gray-100 rounded-2xl"
              style={{ backgroundColor: `${color.primary}10` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: color.primary }}
                  >
                    Transaction ID
                  </p>
                  <p className="font-mono text-sm font-bold text-[#212121] break-all">
                    #{selectedTransaction.id}
                  </p>
                </div>
                <Tag
                  value={selectedTransaction.status.toUpperCase()}
                  severity={
                    selectedTransaction.status === "success"
                      ? "success"
                      : selectedTransaction.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                  className="!text-xs !px-3 !py-1.5 !rounded-full !font-bold"
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTransaction.transactionType === "refund" ? "bg-red-100" : "bg-emerald-100"}`}
                  >
                    {selectedTransaction.transactionType === "refund" ? (
                      <FaArrowDown className="text-sm text-red-600" />
                    ) : (
                      <FaArrowUp className="text-sm text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">
                      Amount
                    </p>
                    <p className="text-2xl font-bold text-[#212121]">
                      {Number(selectedTransaction.amount).toLocaleString(
                        "en-IN",
                        {
                          style: "currency",
                          currency: selectedTransaction.currency || "INR",
                          maximumFractionDigits: 0,
                        },
                      )}
                    </p>
                  </div>
                </div>
                <Tag
                  value={selectedTransaction.transactionType.toUpperCase()}
                  severity={
                    selectedTransaction.transactionType === "payment"
                      ? "success"
                      : "warning"
                  }
                  className="!text-xs !px-3 !py-1.5 !rounded-full !font-bold"
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                <p className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500">
                  <FaCreditCard className="text-gray-400" /> Provider
                </p>
                <p className="font-bold text-sm text-[#212121] capitalize">
                  {selectedTransaction.provider}
                </p>
              </div>
              <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                <p className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500">
                  <FaShieldAlt className="text-gray-400" /> Payment Method
                </p>
                <p className="font-bold text-sm text-[#212121] capitalize">
                  {selectedTransaction.method}
                </p>
              </div>
            </div>

            {/* Order ID */}
            <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                Order ID
              </p>
              <p className="font-mono text-xs font-bold text-[#212121] break-all">
                {selectedTransaction.orderId}
              </p>
            </div>
            <Divider className="!my-4" />

            {/* Provider References */}
            <div>
              <h4 className="text-sm font-bold text-[#212121] mb-3 flex items-center gap-2">
                <FaCheckCircle style={{ color: color.primary }} /> Provider
                References
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="mb-1 text-xs font-semibold text-gray-500">
                    Payment ID
                  </p>
                  <p className="font-mono text-xs text-[#212121] break-all">
                    {selectedTransaction.providerPaymentId || "—"}
                  </p>
                </div>
                {selectedTransaction.orderPayment?.providerOrderId && (
                  <div className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <p className="mb-1 text-xs font-semibold text-gray-500">
                      Order ID
                    </p>
                    <p className="font-mono text-xs text-[#212121] break-all">
                      {selectedTransaction.orderPayment.providerOrderId}
                    </p>
                  </div>
                )}
                {selectedTransaction.providerRefundId && (
                  <div className="p-3 border border-red-100 rounded-lg bg-red-50">
                    <p className="mb-1 text-xs font-semibold text-red-600">
                      Refund ID
                    </p>
                    <p className="font-mono text-xs text-[#212121] break-all">
                      {selectedTransaction.providerRefundId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Refund Info */}
            {selectedTransaction.transactionType === "refund" &&
              selectedTransaction.metadata?.refundId && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FaExclamationCircle className="text-blue-600 text-lg mt-0.5" />
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-bold text-blue-900">
                        Refund Information
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-blue-700">Refund ID</p>
                          <p className="font-mono text-xs font-semibold text-blue-900 break-all">
                            {selectedTransaction.metadata.refundId}
                          </p>
                        </div>
                        {selectedTransaction.orderPayment && (
                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs text-blue-700">
                              Payment Status:
                            </span>
                            <Tag
                              value={selectedTransaction.orderPayment.status.toUpperCase()}
                              severity={
                                selectedTransaction.orderPayment.status ===
                                "captured"
                                  ? "success"
                                  : "warning"
                              }
                              className="!text-[9px] !px-2 !py-0.5 !rounded-full !font-bold"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Timeline */}
            <div className="p-4 border border-blue-100 bg-blue-50 rounded-xl">
              <p
                className="flex items-center gap-2 mb-2 text-xs font-semibold"
                style={{ color: color.primary }}
              >
                <FaClock /> Created At
              </p>
              <p className="text-sm font-bold text-[#212121]">
                {new Date(selectedTransaction.createdAt).toLocaleString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            {/* Order Items */}
            {selectedTransaction.orderPreview?.items && (
              <div>
                <h4 className="text-sm font-bold text-[#212121] mb-3 flex items-center gap-2">
                  <FaBox style={{ color: color.primary }} /> Order Items
                </h4>
                <div className="p-4 space-y-2 border border-gray-100 bg-gray-50 rounded-xl">
                  {selectedTransaction.orderPreview.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                    >
                      <span className="text-sm font-semibold text-[#212121]">
                        {item.title}
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${color.primary}15`,
                          color: color.primary,
                        }}
                      >
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Transactions;
