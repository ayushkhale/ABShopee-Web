import { useState, useEffect, useRef } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

// Icons
import {
    FaClipboardList, FaFilter, FaSearch, FaEye,
    FaUndo, FaUser, FaCreditCard, FaBox, FaClock, FaPrint,
    FaMoneyBillWave, FaTruck, FaCheckCircle, FaMapMarkerAlt
} from 'react-icons/fa';

const color = {
    primary: '#0B77A7',
    secondary: '#0057ae',
    background: '#F5F5F5',
    text: '#212121',
};

const Orders = () => {
    const { businessId } = useBusiness();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    // --- Data State ---
    const [orders, setOrders] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    // --- Query Parameters ---
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(20);
    const [status, setStatus] = useState(null);
    const [dates, setDates] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [orderDetailLoading, setOrderDetailLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // --- Refund State ---
    const [showRefundDialog, setShowRefundDialog] = useState(false);
    const [refundAmount, setRefundAmount] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [refundLoading, setRefundLoading] = useState(false);

    // --- Refund Statistics State ---
    const [refundStats, setRefundStats] = useState({
        totalRefunded: 0,
        totalRefunds: 0,
        currency: 'INR'
    });
    const [showRefundStats, setShowRefundStats] = useState(false);
    const [refundStatsLoading, setRefundStatsLoading] = useState(false);
    const [showShipDialog, setShowShipDialog] = useState(false);
    const [shipItem, setShipItem] = useState(null);
    const [carrier, setCarrier] = useState('');
    const [trackingId, setTrackingId] = useState('');

    const openShipDialog = (item) => {
        setShipItem(item);
        setCarrier('');
        setTrackingId('');
        setShowShipDialog(true);
    };

    const statusOptions = [
        { label: 'Created', value: 'created' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' }
    ];

    useEffect(() => {
        if (businessId) fetchOrders();
    }, [businessId, status, page, rows]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: rows,
                sortBy: 'createdAt',
                sortOrder: 'DESC'
            };

            if (status) params.status = status;
            if (dates?.[0]) params.fromDate = dates[0].toISOString();
            if (dates?.[1]) params.toDate = dates[1].toISOString();
            if (searchId) params.orderId = searchId;

            const response = await apiGet(`/seller/business/${businessId}/orders`, params);

            if (response.data.success && response.data.data) {
                setOrders(response.data.data.orders || []);
                setTotalRecords(response.data.data.total || 0);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Sync Failed', detail: 'Could not load orders' });
        } finally {
            setLoading(false);
        }
    };

    const fetchRefundStats = async (orderId) => {
        setRefundStatsLoading(true);
        try {
            const params = { orderId: orderId };
            const response = await apiGet(`/seller/business/${businessId}/refunds`, params);

            if (response.data?.success && response.data?.data?.refunds) {
                const refunds = response.data.data.refunds;
                const totalRefunded = refunds.reduce((sum, refund) => {
                    return sum + (Number(refund.amount) || 0);
                }, 0);

                setRefundStats({
                    totalRefunded,
                    totalRefunds: refunds.length,
                    currency: refunds[0]?.currency || selectedOrder?.pricing?.currency || 'INR'
                });
                setShowRefundStats(true);
            } else {
                setRefundStats({
                    totalRefunded: 0,
                    totalRefunds: 0,
                    currency: selectedOrder?.pricing?.currency || 'INR'
                });
                setShowRefundStats(true);
            }
        } catch (error) {
            console.error('Failed to fetch refund stats:', error);
            setRefundStats({
                totalRefunded: 0,
                totalRefunds: 0,
                currency: selectedOrder?.pricing?.currency || 'INR'
            });
            setShowRefundStats(true);
        } finally {
            setRefundStatsLoading(false);
        }
    };

    const openRefundDialog = (order) => {
        setRefundAmount(order.pricing.amount);
        setRefundReason('');
        setShowRefundStats(false);
        setShowRefundDialog(true);
        fetchRefundStats(order.orderId);
    };

    const handleRefund = async () => {
        if (!refundAmount || refundAmount <= 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Invalid Amount',
                detail: 'Please enter a valid refund amount'
            });
            return;
        }

        if (refundAmount > selectedOrder.pricing.amount) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Amount Exceeded',
                detail: 'Refund amount cannot exceed order amount'
            });
            return;
        }

        setRefundLoading(true);
        try {
            const payload = {
                amount: refundAmount,
                reason: refundReason || undefined,
                notes: refundReason ? { userReason: refundReason } : undefined
            };

            await apiPost(
                `/seller/business/${businessId}/orders/${selectedOrder.orderId}/refunds`,
                payload
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Refund Initiated',
                detail: 'Refund processed successfully'
            });

            setShowRefundDialog(false);
            setShowDetailDialog(false);
            fetchOrders();
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Refund Failed',
                detail: err.message || 'Could not process refund'
            });
        } finally {
            setRefundLoading(false);
        }
    };

    const handleItemAction = async (action, item, extra = {}) => {
        try {
            await apiPost(
                `/seller/business/${businessId}/orders/${selectedOrder.orderId}/action`,
                {
                    action,
                    items: [
                        {
                            orderItemId: item.id,
                            ...extra
                        }
                    ]
                }
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: `Item ${action}ed successfully`
            });

            fetchSingleOrder(selectedOrder.orderId);
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Action Failed',
                detail: err.message || 'Could not process action'
            });
        }
    };

    const fetchSingleOrder = async (orderId) => {
        setOrderDetailLoading(true);
        setShowDetailDialog(true);

        try {
            const response = await apiGet(
                `/seller/business/${businessId}/orders`,
                { orderId }
            );
            console.log(response)

            if (response.data?.success && response.data?.data?.order) {
                const rawOrder = response.data.data.order;

                const freeGiftIds = new Set(
                    rawOrder.metadata?.freeGifts?.map(g => g.itemId)
                )

                const seen = new Set()

                const filteredItems = rawOrder.items
                    .filter(item => {
                        if (!freeGiftIds.has(item.itemId)) return true

                        if (!seen.has(item.itemId)) {
                            seen.add(item.itemId)
                            return true
                        }

                        return false
                    })
                    .map(item => ({
                        ...item,
                        title: item.itemSnapshot?.title,
                        itemType: item.itemSnapshot?.itemType
                    }))

                const normalizedOrder = {
                    ...rawOrder,
                    orderId: rawOrder.id,
                    customerId: rawOrder.customerId,
                    paymentStatus: rawOrder.payments?.[0]?.status || 'pending',
                    pricing: {
                        ...rawOrder.pricing,
                        amount: Number(rawOrder.pricing.amount),
                        currency: rawOrder.pricing.currency || 'INR'
                    },
                    items: filteredItems,
                    freeGifts: rawOrder.metadata?.freeGifts || [],
                    shippingAddress: rawOrder.addresses?.find(a => a.type === 'shipping')
                };



                setSelectedOrder(normalizedOrder);
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Not Found',
                    detail: 'Order details not available'
                });
                setShowDetailDialog(false);
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Failed',
                detail: 'Could not load order details'
            });
            setShowDetailDialog(false);
        } finally {
            setOrderDetailLoading(false);
        }
    };

    const onRowSelect = (event) => {
        fetchSingleOrder(event.data.orderId);
    };

    const handleDownloadInvoice = async (order) => {
        try {
            if (!order.customerId) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Missing Customer ID',
                    detail: 'Cannot generate invoice without customer reference'
                });
                return;
            }

            toast.current?.show({
                severity: 'info',
                summary: 'Downloading...',
                detail: 'Preparing invoice PDF',
                life: 2000
            });

            const token =
                localStorage.getItem('accessToken') ||
                localStorage.getItem('token');

            const response = await fetch(
                `https://ab-shoppy.icompunic.com/seller/business/${businessId}/orders/${order.orderId}/invoice/${order.customerId}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/pdf',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to download invoice');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${order.orderId.slice(0, 8)}.pdf`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.current?.show({
                severity: 'success',
                summary: 'Downloaded',
                detail: 'Invoice saved successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Invoice download error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Download Failed',
                detail: error.message || 'Could not download invoice'
            });
        }
    };

    const orderIdTemplate = (rowData) => (
        <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg w-fit" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                #{rowData.orderId.slice(0, 8)}
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
                <FaClock className="text-[8px]" />
                {new Date(rowData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );

    const itemsTemplate = (rowData) => (
        <div className="flex flex-col gap-1.5">
            {rowData.items?.slice(0, 2).map((item, i) => (
                <span key={i} className="text-xs text-[#212121] font-semibold truncate max-w-[200px]">
                    {item.quantity}x {item.title}
                </span>
            ))}
            {rowData.items?.length > 2 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                    +{rowData.items.length - 2} more
                </span>
            )}
        </div>
    );

    const statusTemplate = (rowData) => {
        const severity = {
            created: 'info',
            confirmed: 'warning',
            completed: 'success',
            cancelled: 'danger',
            fulfilled: 'success'
        };
        return (
            <Tag
                value={rowData.status.toUpperCase()}
                severity={severity[rowData.status] || 'info'}
                className="!text-[10px] !px-3 !py-1 !rounded-full !font-bold"
            />
        );
    };

    // const priceTemplate = (rowData) => (
    //     <div className="flex flex-col items-end gap-1">
    //         <span className="font-bold text-[#212121] text-sm">
    //             {rowData.pricing?.amount.toLocaleString('en-IN', { 
    //                 style: 'currency', 
    //                 currency: rowData.pricing?.currency || 'INR',
    //                 maximumFractionDigits: 0 
    //             })}
    //         </span>
    //         <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
    //             rowData.paymentStatus === 'success' 
    //                 ? 'bg-blue-100 text-blue-700' 
    //                 : 'bg-blue-100 text-blue-700'
    //         }`}>
    //             {rowData.paymentStatus || 'Pending'}
    //         </span>
    //     </div>
    // );

    const priceTemplate = (rowData) => (
        <div className="flex flex-col gap-1">
            <span className="font-bold text-[#212121] text-sm">
                {rowData.pricing?.amount?.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: rowData.pricing?.currency || 'INR',
                    maximumFractionDigits: 0
                })}
            </span>

            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 w-fit">
                {rowData.paymentStatus || 'Pending'}
            </span>
        </div>
    );
    return (
        <div className="animate-fade-in pb-20">
            <Toast ref={toast} />

            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#212121]">
                        Orders
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage customer orders & fulfillment
                    </p>
                </div>

                <Button
                    icon={<FaFilter className="mr-2 text-xs" />}
                    label={showFilters ? "Hide Filters" : "Show Filters"}
                    onClick={() => setShowFilters(p => !p)}
                    className={`!rounded-xl !px-5 !py-3 !text-sm !font-semibold transition-all shadow-sm ${showFilters
                        ? "!border-none !text-white shadow-md hover:!scale-105 active:!scale-95"
                        : "!bg-gray-100 !text-gray-600 !border-none hover:!bg-gray-200"
                        }`}
                    style={showFilters ? { backgroundColor: color.primary } : {}}
                />
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mb-6">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 flex flex-wrap items-center gap-4">
                        <Dropdown
                            value={status}
                            options={statusOptions}
                            onChange={(e) => { setStatus(e.value); setPage(1); }}
                            placeholder="Filter by status"
                            className="w-52"
                            inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 !py-3 !text-sm"
                            showClear
                        />

                        <Calendar
                            value={dates}
                            onChange={(e) => setDates(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            placeholder="Select date range"
                            className="w-64"
                            inputClassName="!rounded-xl !bg-gray-50 !border !border-gray-200 !py-3 !text-sm"
                            showIcon
                        />

                        <div className="relative flex-1 min-w-[240px]">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <InputText
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Search by order ID"
                                className="w-full !pl-10 !pr-4 !py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 !text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <Button
                                icon={<FaUndo className="text-sm" />}
                                onClick={fetchOrders}
                                className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !w-10 !h-10 hover:!bg-gray-200 transition-all"
                                tooltip="Refresh"
                            />

                            <Button
                                label="Apply Filters"
                                onClick={fetchOrders}
                                className="!border-none !rounded-xl !px-6 !py-3 !text-sm !font-bold shadow-md hover:!scale-105 active:!scale-95 transition-all"
                                style={{ backgroundColor: color.primary }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    value={orders}
                    loading={loading}
                    selectionMode="single"
                    onRowSelect={onRowSelect}
                    dataKey="orderId"
                    className="p-datatable-sm"
                    rowClassName={() => 'cursor-pointer hover:bg-blue-50/50 transition-colors'}
                    emptyMessage={
                        <div className="text-center py-24">
                            <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No orders found</p>
                            <p className="text-gray-400 text-sm mt-1">Orders will appear here once customers place them</p>
                        </div>
                    }
                >
                    <Column
                        header="ORDER ID"
                        body={orderIdTemplate}
                        style={{ width: '180px' }}
                        className="pl-6"
                    />
                    <Column header="PRODUCTS" body={itemsTemplate} />
                    <Column
                        header="ORDER DATE"
                        body={(r) => (
                            <span className="text-xs text-gray-600 font-semibold">
                                {new Date(r.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        )}
                    />
                    <Column header="STATUS" body={statusTemplate} />
                    {/* <Column header="TOTAL" body={priceTemplate} className="pr-6" /> */}
                    <Column
                        header="TOTAL"
                        body={priceTemplate}
                        className="pr-6"
                        style={{ width: '160px' }}
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

            {/* Order Detail Dialog */}
            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                            <FaClipboardList />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">Order Details</span>
                    </div>
                }
                visible={showDetailDialog}
                onHide={() => setShowDetailDialog(false)}
                style={{ width: '700px' }}
                contentStyle={{
                    maxHeight: '85vh',
                    overflowY: 'auto'
                }}
                className="rounded-2xl"
            >
                {orderDetailLoading && (
                    <div className="py-24 flex flex-col items-center gap-4">
                        <i className="pi pi-spin pi-spinner text-3xl" style={{ color: color.primary }}></i>
                        <p className="text-sm font-semibold text-gray-600">Loading order details…</p>
                    </div>
                )}

                {!orderDetailLoading && selectedOrder && (
                    <div className="space-y-6 animate-fade-in pt-4">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 rounded-2xl border border-gray-100" style={{ backgroundColor: `${color.primary}10` }}>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: color.primary }}>
                                    Order ID
                                </p>
                                <p className="font-mono text-sm font-bold text-[#212121]">
                                    #{selectedOrder.orderId}
                                </p>
                            </div>
                            <Tag
                                value={selectedOrder.status.toUpperCase()}
                                severity={
                                    selectedOrder.status === 'completed'
                                        ? 'success'
                                        : selectedOrder.status === 'cancelled'
                                            ? 'danger'
                                            : 'warning'
                                }
                                className="!text-xs !px-3 !py-1.5 !rounded-full !font-bold"
                            />
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-2">
                                    <FaUser className="text-gray-400" /> Customer ID
                                </p>
                                <p className="font-mono text-xs font-bold text-[#212121] break-all">
                                    {selectedOrder.customerId}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-2">
                                    <FaCreditCard className="text-gray-400" /> Payment Status
                                </p>
                                <p className="font-bold uppercase text-sm" style={{ color: selectedOrder.paymentStatus === 'success' ? '#10b981' : '#f59e0b' }}>
                                    {selectedOrder.paymentStatus}
                                </p>
                            </div>
                        </div>

                        <Divider />

                        {/* Items */}
                        <div>
                            <h4 className="text-sm font-bold text-[#212121] mb-3 flex items-center gap-2">
                                <FaBox style={{ color: color.primary }} /> Order Items
                            </h4>
                            <div className="space-y-3">
                                {selectedOrder?.items?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#212121]">{item.title}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold mt-1">
                                                    {item.itemType}
                                                </p>
                                            </div>
                                            <Tag
                                                value={item.status.toUpperCase()}
                                                severity={
                                                    item.status === 'pending'
                                                        ? 'warning'
                                                        : item.status === 'shipped'
                                                            ? 'info'
                                                            : 'success'
                                                }
                                                className="!text-[9px] !px-2.5 !py-1 !rounded-full !font-bold"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-xs text-gray-600 font-medium">Quantity</span>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                                ×{item.quantity}
                                            </span>
                                        </div>

                                        {selectedOrder?.pricing?.pricingSnapshot?.items?.[i] && (
                                            <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                                                {(() => {
                                                    const priceItem =
                                                        selectedOrder.pricing.pricingSnapshot.items[i];
                                                    const currency = selectedOrder.pricing.currency;

                                                    return (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <span>Base Unit Price</span>
                                                                <span>
                                                                    {priceItem.baseUnitPrice.toLocaleString("en-IN", {
                                                                        style: "currency",
                                                                        currency
                                                                    })}
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between">
                                                                <span>Base Line Total</span>
                                                                <span>
                                                                    {priceItem.baseLineTotal.toLocaleString("en-IN", {
                                                                        style: "currency",
                                                                        currency
                                                                    })}
                                                                </span>
                                                            </div>

                                                            {priceItem.promotionDiscountTotal > 0 && (
                                                                <div className="flex justify-between text-green-600">
                                                                    <span>Promotion Discount</span>
                                                                    <span>
                                                                        -{" "}
                                                                        {priceItem.promotionDiscountTotal.toLocaleString("en-IN", {
                                                                            style: "currency",
                                                                            currency
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {priceItem.wholesaleDiscountTotal > 0 && (
                                                                <div className="flex justify-between text-green-600">
                                                                    <span>Wholesale Discount</span>
                                                                    <span>
                                                                        -{" "}
                                                                        {priceItem.wholesaleDiscountTotal.toLocaleString("en-IN", {
                                                                            style: "currency",
                                                                            currency
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <Divider />

                                                            <div className="flex justify-between font-semibold">
                                                                <span>Final Line Total</span>
                                                                <span>
                                                                    {priceItem.finalLineTotal.toLocaleString("en-IN", {
                                                                        style: "currency",
                                                                        currency
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}


                                        {item.itemType === 'physical' && (
                                            <div className="flex gap-2 pt-2">
                                                {item.status === 'pending' && (
                                                    <Button
                                                        label="Ship Item"
                                                        icon={<FaTruck className="mr-2 text-xs" />}
                                                        size="small"
                                                        className="!border-none !rounded-xl !px-4 !py-2 !text-xs !font-semibold hover:!scale-105 active:!scale-95 transition-all"
                                                        style={{ backgroundColor: color.primary }}
                                                        onClick={() => openShipDialog(item)}
                                                    />
                                                )}

                                                {item.status === 'shipped' && (
                                                    <Button
                                                        label="Mark as Delivered"
                                                        icon={<FaCheckCircle className="mr-2 text-xs" />}
                                                        size="small"
                                                        className="!bg-blue-600 !border-none !rounded-xl !px-4 !py-2 !text-xs !font-semibold hover:!bg-blue-700 hover:!scale-105 active:!scale-95 transition-all"
                                                        onClick={() => handleItemAction('deliver', item)}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedOrder?.freeGifts?.length > 0 && (
                            <div>
                                <div className="space-y-3">
                                    {selectedOrder.freeGifts.map((gift, i) => (
                                        <div
                                            key={i}
                                            className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-lg">🎁</div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#212121]">
                                                        {gift.title}
                                                    </p>
                                                    <p className="text-[10px] text-green-700 font-semibold uppercase">
                                                        Free Gift
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
                                                ×{gift.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {selectedOrder.shippingAddress && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-[#212121] mb-3 flex items-center gap-2">
                                    <FaMapMarkerAlt style={{ color: color.primary }} /> Shipping Address
                                </p>
                                <div className="text-xs text-gray-700 space-y-1">
                                    <p className="font-semibold">{selectedOrder.shippingAddress.addressSnapshot.line1}</p>
                                    <p>
                                        {selectedOrder.shippingAddress.addressSnapshot.city},
                                        {selectedOrder.shippingAddress.addressSnapshot.state} –
                                        {selectedOrder.shippingAddress.addressSnapshot.pincode}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pricing Breakdown */}
                        {selectedOrder?.pricing?.pricingSnapshot && (
                            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3">
                                <h4 className="text-sm font-bold text-[#212121] mb-2">
                                    💰 Pricing Breakdown
                                </h4>

                                <div className="flex justify-between text-xs">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">
                                        {selectedOrder.pricing.pricingSnapshot.subtotal.toLocaleString('en-IN', {
                                            style: 'currency',
                                            currency: selectedOrder.pricing.currency
                                        })}
                                    </span>
                                </div>
                                {/* Taxes */}
                                {selectedOrder?.pricing?.pricingSnapshot?.taxes?.length > 0 && (
                                    <>
                                        {selectedOrder.pricing.pricingSnapshot.taxes.map((tax, index) => (
                                            <div key={index} className="space-y-1 text-xs border-t pt-2">
                                                <div className="flex justify-between font-semibold">
                                                    <span>{tax.type} Total</span>
                                                    <span>
                                                        {tax.total.toLocaleString("en-IN", {
                                                            style: "currency",
                                                            currency: selectedOrder.pricing.currency
                                                        })}
                                                    </span>
                                                </div>

                                                {Object.entries(tax.components).map(([key, value]) => {
                                                    if (!value.amount || value.amount === 0) return null;

                                                    return (
                                                        <div
                                                            key={key}
                                                            className="flex justify-between text-gray-600 ml-4"
                                                        >
                                                            <span>
                                                                {key.toUpperCase()} ({value.rate}%)
                                                            </span>
                                                            <span>
                                                                {value.amount.toLocaleString("en-IN", {
                                                                    style: "currency",
                                                                    currency: selectedOrder.pricing.currency
                                                                })}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {selectedOrder.pricing.pricingSnapshot.discountTotal > 0 && (
                                    <div className="flex justify-between text-xs text-green-600">
                                        <span>Total Discount</span>
                                        <span className="font-semibold">
                                            -{" "}
                                            {selectedOrder.pricing.pricingSnapshot.discountTotal.toLocaleString(
                                                "en-IN",
                                                {
                                                    style: "currency",
                                                    currency: selectedOrder.pricing.currency
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}

                                <Divider />

                                <div className="flex justify-between font-bold text-sm">
                                    <span>Grand Total</span>
                                    <span>
                                        {selectedOrder.pricing.pricingSnapshot.total.toLocaleString('en-IN', {
                                            style: 'currency',
                                            currency: selectedOrder.pricing.currency
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}
                        {/* Payment Details */}
                        {selectedOrder?.payments?.length > 0 && (
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                                <h4 className="text-sm font-bold text-[#212121]">
                                    💳 Payment Details
                                </h4>

                                {selectedOrder.payments.map((payment, index) => (
                                    <div key={index} className="text-xs space-y-1">
                                        <div className="flex justify-between">
                                            <span>Provider</span>
                                            <span className="font-semibold uppercase">{payment.provider}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Method</span>
                                            <span className="font-semibold">{payment.method}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Status</span>
                                            <span className="font-semibold uppercase text-green-600">
                                                {payment.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Paid Amount</span>
                                            <span className="font-semibold">
                                                {Number(payment.amount).toLocaleString('en-IN', {
                                                    style: 'currency',
                                                    currency: payment.currency
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Order Timeline */}
                        {selectedOrder?.events?.length > 0 && (
                            <div className="bg-white p-5 rounded-xl border border-gray-200">
                                <h4 className="text-sm font-bold text-[#212121] mb-3">
                                    🕒 Order Timeline
                                </h4>

                                <div className="space-y-3">
                                    {selectedOrder.events.map((event, idx) => (
                                        <div key={idx} className="flex justify-between text-xs border-b pb-2 last:border-0">
                                            <div>
                                                <p className="font-semibold uppercase">
                                                    {event.toStatus}
                                                </p>
                                                <p className="text-gray-500">
                                                    {event.reason}
                                                </p>
                                            </div>
                                            <span className="text-gray-400">
                                                {new Date(event.createdAt).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Total */}
                        <div className="p-6 rounded-2xl flex justify-between items-center" style={{ backgroundColor: color.primary, color: 'white' }}>
                            <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                                Order Total
                            </span>
                            <span className="text-2xl font-bold">
                                {selectedOrder.pricing.amount.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: selectedOrder.pricing.currency
                                })}
                            </span>
                        </div>


                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                label="Download Invoice"
                                icon={<FaPrint className="mr-2 text-xs" />}
                                className="flex-1 !bg-gray-100 !text-gray-700 !border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!bg-gray-200 hover:!scale-105 active:!scale-95 transition-all"
                                onClick={() => handleDownloadInvoice(selectedOrder)}
                            />

                            {!['cancelled', 'expired', 'created'].includes(selectedOrder.status) && (
                                <Button
                                    label="Initiate Refund"
                                    icon={<FaMoneyBillWave className="mr-2 text-xs" />}
                                    className="flex-1 !bg-red-500 !border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!bg-red-600 hover:!scale-105 active:!scale-95 transition-all shadow-md"
                                    onClick={() => openRefundDialog(selectedOrder)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Ship Dialog */}
            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center" style={{ color: color.primary }}>
                            <FaTruck />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">Ship Item</span>
                    </div>
                }
                visible={showShipDialog}
                style={{ width: '500px' }}
                onHide={() => setShowShipDialog(false)}
                className="rounded-2xl"
            >
                <div className="space-y-5 pt-4">
                    <div>
                        <label className="text-sm font-bold text-[#212121] mb-2 block">
                            Carrier <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <InputText
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            placeholder="e.g., FedEx, DHL, Blue Dart"
                            className="w-full !py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-[#212121] mb-2 block">
                            Tracking ID <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <InputText
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="Enter tracking number"
                            className="w-full !py-3 !rounded-xl !bg-gray-50 !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
                        />
                    </div>

                    <Button
                        label="Confirm Shipment"
                        icon={<FaTruck className="mr-2 text-xs" />}
                        className="w-full !border-none !rounded-xl !px-6 !py-3 !font-bold hover:!scale-105 active:!scale-95 transition-all shadow-md"
                        style={{ backgroundColor: color.primary }}
                        onClick={() => {
                            handleItemAction('ship', shipItem, { carrier, trackingId });
                            setShowShipDialog(false);
                        }}
                    />
                </div>

            </Dialog>

            {/* Refund Dialog */}
            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                            <FaMoneyBillWave />
                        </div>
                        <span className="text-lg font-bold text-[#212121]">Initiate Refund</span>
                    </div>
                }
                visible={showRefundDialog}
                style={{ width: '600px' }}
                onHide={() => setShowRefundDialog(false)}
                className="rounded-2xl"
            >
                {selectedOrder && (
                    <div className="space-y-6 pt-4">
                        {/* Refund Stats */}
                        {refundStatsLoading ? (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-center gap-3">
                                    <i className="pi pi-spin pi-spinner" style={{ color: color.primary }}></i>
                                    <p className="text-sm font-semibold text-gray-600">Loading refund history...</p>
                                </div>
                            </div>
                        ) : showRefundStats && (
                            <div className={`rounded-xl p-5 border-2 ${refundStats.totalRefunds > 0
                                ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                                }`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            💰 Total Refunded
                                        </p>
                                        <p className="text-3xl font-bold text-[#212121]">
                                            {refundStats.totalRefunded.toLocaleString('en-IN', {
                                                style: 'currency',
                                                currency: refundStats.currency,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            📊 Refund Count
                                        </p>
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-3xl font-bold" style={{ color: color.primary }}>
                                                {refundStats.totalRefunds}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-500">
                                                time{refundStats.totalRefunds !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {refundStats.totalRefunds > 0 ? (
                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-red-200">
                                        <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                                            <span className="text-base">⚠️</span>
                                            This order has been refunded <span className="font-black">{refundStats.totalRefunds}</span> time(s).
                                            Please verify before processing another refund.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
                                        <p className="text-xs font-bold text-blue-700 flex items-center gap-2">
                                            <span className="text-base">✅</span>
                                            No previous refunds found for this order
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Warning */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">⚠️</span>
                                <div className="flex-1">
                                    <p className="font-bold text-blue-900 text-sm mb-1">Important Notice</p>
                                    <p className="text-xs text-blue-800">
                                        This action will process a refund transaction. Please verify the amount carefully before proceeding.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="text-sm font-bold text-[#212121] mb-2 flex items-center gap-2 block">
                                💵 Refund Amount
                                <span className="text-[10px] text-gray-500 font-normal">
                                    (Max: {selectedOrder.pricing.amount.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: selectedOrder.pricing.currency
                                    })})
                                </span>
                            </label>
                            <InputNumber
                                value={refundAmount}
                                onValueChange={(e) => setRefundAmount(e.value)}
                                mode="currency"
                                currency={selectedOrder.pricing.currency}
                                locale="en-IN"
                                max={selectedOrder.pricing.amount}
                                className="w-full"
                                inputClassName="!p-4 !rounded-xl !bg-gray-50 !border-2 !border-gray-200 focus:!border-[#0B77A7] !font-bold !text-lg"
                                placeholder="Enter refund amount"
                            />
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="text-sm font-bold text-[#212121] mb-2 flex items-center gap-2 block">
                                📝 Reason
                                <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-semibold">
                                    Optional
                                </span>
                            </label>
                            <InputTextarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                rows={3}
                                className="!p-4 !rounded-xl !bg-gray-50 !border-2 !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
                                placeholder="Enter reason for refund (optional)"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                label="Cancel"
                                className="flex-1 !bg-gray-100 !text-gray-700 !border-none !rounded-xl !px-5 !py-3 !font-bold hover:!bg-gray-200 hover:!scale-105 active:!scale-95 transition-all"
                                onClick={() => setShowRefundDialog(false)}
                                disabled={refundLoading}
                            />
                            <Button
                                label={refundLoading ? "Processing..." : "Process Refund"}
                                icon={!refundLoading && <FaMoneyBillWave className="mr-2 text-xs" />}
                                className="flex-1 !bg-red-500 !border-none !rounded-xl !px-5 !py-3 !font-bold hover:!bg-red-600 hover:!scale-105 active:!scale-95 transition-all shadow-md"
                                onClick={handleRefund}
                                loading={refundLoading}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default Orders;
