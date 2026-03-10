import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";
import apiClient from "../services/api";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { FaUsers, FaPlus } from "react-icons/fa";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const CustomersListPage = () => {
  const { businessId } = useBusiness();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [showDetailDialog, setShowDetailDialog] = useState(false);
const [customerDetailLoading, setCustomerDetailLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [search, setSearch] = useState("");

 useEffect(() => {
  if (!businessId) return;

  fetchCustomers();
}, [businessId, limit, offset, typeFilter, statusFilter, search]);
const fetchCustomers = async () => {
  if (!businessId) return;

  try {
    setLoading(true);

    const params = { limit, offset };

    if (typeFilter) params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    if (search) params.identifier = search;

    const res = await apiClient.get(
      `/seller/business/${businessId}/customers`,
      { params }
    );

    const apiData = res.data?.result;

    if (apiData?.mode === "list") {
      setCustomers(apiData.data || []);
      setTotalRecords(apiData.total || 0);
    }

  } catch (err) {
    console.error("Fetch customers error:", err);
  } finally {
    setLoading(false);
  }
};

const fetchSingleCustomer = async (customerId) => {
  if (!businessId) return;

  try {
    setCustomerDetailLoading(true);
    setShowDetailDialog(true);

    const res = await apiClient.get(
      `/seller/business/${businessId}/customers`,
      {
        params: { customerId }
      }
    );

    const raw = res.data?.result?.data;

    if (raw) {

//   const normalizedCustomer = {
//   id: raw.id,
//   type: raw.type,
//   status: raw.status,
//   createdAt: raw.createdAt,
//   updatedAt: raw.updatedAt,

//   // customer
//   identifier: raw.customer?.identifier,
//   identifierType: raw.customer?.identifierType,

//   // profile
//   displayName: raw.customer?.profile?.displayName,

//   // BUSINESS PROFILE (important)
//   legalName: raw.businessProfile?.legalName,
//   tradeName: raw.businessProfile?.tradeName,
//   gstNumber: raw.businessProfile?.gstNumber,
//   phone: raw.businessProfile?.phone,
//   email: raw.businessProfile?.email,
//   city: raw.businessProfile?.city,
//   state: raw.businessProfile?.state,
//   country: raw.businessProfile?.country,
//   website: raw.businessProfile?.website,
//   businessStatus: raw.businessProfile?.status
// };

const normalizedCustomer = {
  id: raw.id,
  type: raw.type,
  status: raw.status,
  forcePasswordReset: raw.forcePasswordReset,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,

  customer: raw.customer,
  businessProfile: raw.businessProfile
};
      setSelectedCustomer(normalizedCustomer);
    }

  } catch (err) {
    console.error("Fetch customer error:", err);
    setShowDetailDialog(false);
  } finally {
    setCustomerDetailLoading(false);
  }
};
  const onPage = (event) => {
    setLimit(event.rows);
    setOffset(event.first);
  };

  const typeTemplate = (row) => {
    const severity =
      row.type === "retail"
        ? "info"
        : row.type === "wholesale"
        ? "warning"
        : "success";

    return <Tag value={row.type} severity={severity} />;
  };

  const statusTemplate = (row) => {
    return (
      <Tag
        value={row.status}
        severity={row.status === "active" ? "success" : "danger"}
      />
    );
  };

  const nameTemplate = (row) => {
  return (
    <div>
      <p className="font-semibold text-sm">
        {row.businessProfile?.tradeName || row.customer?.profile?.displayName || "-"}
      </p>
      <p className="text-xs text-gray-400">
        {row.customer?.identifier}
      </p>
    </div>
  );
};

  const createdTemplate = (row) => {
    return new Date(row.createdAt).toLocaleDateString();
  };

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
            <FaUsers />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1a1a2e]">
              Customers
            </h1>
            <p className="text-sm text-gray-500">
              Manage retail, wholesale & distributor customers
            </p>
          </div>
        </div>

        <Button
          label="Bulk Import"
          icon={<FaPlus className="mr-2" />}
          onClick={() => navigate("/dashboard/customers/bulk-import")}
          className="!bg-indigo-600 !border-none !rounded-xl !px-6 !py-3 !font-bold hover:!bg-indigo-700"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[28px] border border-[#e8ecf0] shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4">

          <InputText
            placeholder="Search by email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />

          <Dropdown
            value={typeFilter}
            options={[
              { label: "Retail", value: "retail" },
              { label: "Wholesale", value: "wholesale" },
              { label: "Distributor", value: "distributor" }
            ]}
            onChange={(e) => setTypeFilter(e.value)}
            placeholder="Filter by Type"
            className="w-56"
            showClear
          />

          <Dropdown
            value={statusFilter}
            options={[
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" }
            ]}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
            className="w-56"
            showClear
          />

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] border border-[#e8ecf0] shadow-sm p-6">

     <DataTable
  value={customers}
  loading={loading}
  paginator
  lazy
  rows={limit}
  totalRecords={totalRecords}
  first={offset}
  onPage={onPage}
  selectionMode="single"
onRowSelect={(e) => fetchSingleCustomer(e.data.customerId)}
  dataKey="id"
  rowClassName={() => "cursor-pointer hover:bg-indigo-50 transition-colors"}
>
          <Column header="Customer" body={nameTemplate} />
          <Column field="type" header="Type" body={typeTemplate} sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable />
          <Column field="createdAt" header="Created On" body={createdTemplate} sortable />
        </DataTable>
      </div>
     
<Dialog
  header="Customer Details"
  visible={showDetailDialog}
  style={{ width: "720px" }}
  onHide={() => setShowDetailDialog(false)}
  className="rounded-2xl"
  contentStyle={{ maxHeight: "85vh", overflowY: "auto" }}
>
  {customerDetailLoading && (
    <div className="py-20 text-center">
      <i className="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
      <p className="text-sm mt-3 text-gray-500">Loading customer...</p>
    </div>
  )}

  {!customerDetailLoading && selectedCustomer && (
    <div className="space-y-6 pt-4">

      {/* Basic Info */}
      {/* Business Info */}
<div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">

 <p className="text-lg font-bold">
  {selectedCustomer.businessProfile?.tradeName || "-"}
</p>

<p className="text-xs text-gray-500">
  {selectedCustomer.businessProfile?.legalName || "-"}
</p>

  <div className="mt-4 text-xs space-y-1">

    <div className="flex justify-between">
      <span>Email</span>
      <span className="font-semibold">
{selectedCustomer.businessProfile?.email || "-"}      </span>
    </div>

    <div className="flex justify-between">
      <span>Phone</span>
      <span className="font-semibold">
        {selectedCustomer.businessProfile?.phone || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>GST Number</span>
      <span className="font-semibold">
        {selectedCustomer.businessProfile?.gstNumber || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Location</span>
      <span className="font-semibold">
        {selectedCustomer.businessProfile?.city}, {selectedCustomer.businessProfile?.state}
      </span>
    </div>

  </div>

</div>

      {/* Type & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-xs text-gray-500 mb-1">Type</p>
          <Tag value={selectedCustomer.type || "-"} />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <Tag
            value={selectedCustomer.status || "-"}
            severity={
              selectedCustomer.status === "active"
                ? "success"
                : "danger"
            }
          />
        </div>
      </div>

      <Divider />

      {/* Contact Info */}
      <div>
        <h4 className="font-bold text-sm mb-3">Contact Information</h4>
        <div className="text-xs space-y-2">

          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-semibold">
          {selectedCustomer.customer?.identifierType === "email"
 ? selectedCustomer.customer?.identifier
 : "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Phone</span>
            <span className="font-semibold">
{selectedCustomer.customer?.profile?.phone || "-"}            </span>
          </div>

          <div className="flex justify-between">
            <span>First Name</span>
            <span className="font-semibold">
{selectedCustomer.customer?.profile?.firstName || "-"}            </span>
          </div>

          <div className="flex justify-between">
            <span>Last Name</span>
            <span className="font-semibold">
              {selectedCustomer.customer?.profile?.lastName || "-"}
            </span>
          </div>

        </div>
      </div>

      <Divider />

      {/* Account Details */}
      <div>
        <h4 className="font-bold text-sm mb-3">Account Details</h4>

        <div className="grid grid-cols-2 gap-4 text-xs">

          <div>
            <p className="text-gray-500">Identifier Type</p>
            <p className="font-semibold">
{selectedCustomer.customer?.identifierType || "-"}            </p>
          </div>

          <div>
            <p className="text-gray-500">Identifier Verified</p>
           <Tag
  value={
selectedCustomer.customer?.identifierVerified
      ? "Verified"
      : "Not Verified"
  }
  severity={
selectedCustomer.customer?.identifierVerified
      ? "success"
      : "warning"
  }
/>
          </div>

          <div>
            <p className="text-gray-500">Force Password Reset</p>
            <Tag
              value={
                selectedCustomer.forcePasswordReset
                  ? "Required"
                  : "No"
              }
              severity={
                selectedCustomer.forcePasswordReset
                  ? "danger"
                  : "success"
              }
            />
          </div>

          <div>
            <p className="text-gray-500">Customer Account Status</p>
           <Tag
  value={selectedCustomer.customer?.status || "-"}
  severity={
    selectedCustomer.customer?.status === "active"
      ? "success"
      : "danger"
  }
/>
          </div>

        </div>
      </div>

      <Divider />

      {/* Business Profile */}
      <div>
        <h4 className="font-bold text-sm mb-3">Business Details</h4>

        <div className="text-xs space-y-2">

          <div className="flex justify-between">
            <span>Legal Name</span>
            <span className="font-semibold">
              {selectedCustomer.businessProfile?.legalName || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Trade Name</span>
            <span className="font-semibold">
              {selectedCustomer.businessProfile?.tradeName || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST Number</span>
            <span className="font-semibold">
              {selectedCustomer.businessProfile?.gstNumber || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Country</span>
            <span className="font-semibold">
              {selectedCustomer.businessProfile?.country || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Business Status</span>
            <Tag
              value={selectedCustomer.businessProfile?.status || "-"}
              severity={
                selectedCustomer.businessProfile?.status === "active"
                  ? "success"
                  : "warning"
              }
            />
          </div>

        </div>
      </div>

      <Divider />

      {/* Metadata */}
      <div>
        <h4 className="font-bold text-sm mb-3">Metadata</h4>

        <div className="text-xs space-y-1">
          <p>
            Business Customer Created:{" "}
{selectedCustomer.customer?.createdAt
  ? new Date(selectedCustomer.customer.createdAt).toLocaleString()
  : "-"}          </p>

          <p>
            Business Customer Updated:{" "}
            {new Date(selectedCustomer.updatedAt).toLocaleString()}
          </p>

          <p>
            Customer Created:{" "}
            {new Date(
selectedCustomer.customer?.createdAt            ).toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  )}
</Dialog>
    </div>
  );
};

export default CustomersListPage;
