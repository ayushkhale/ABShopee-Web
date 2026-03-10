import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiGet, apiPatch } from "../services/api"
import { useBusiness } from "../context/BusinessContext"
import {
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTag
} from "react-icons/fa"
import { useSearchParams } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Divider } from "primereact/divider"

const Discounts = () => {
  const navigate = useNavigate()
  const { businessId } = useBusiness()

  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)


  const [filters, setFilters] = useState({
    status: "",
    discountCategory: "",
    scopeType: "",
    discountType: "",
    code: "",
    isPublicPromo: "",
    priorityMin: "",
    priorityMax: "",
    includeDeleted: false
  })
  useEffect(() => {
    if (businessId) {
      fetchDiscounts()
    }
  }, [page, businessId])

  useEffect(() => {
    const discountId = searchParams.get("discountId")

    if (discountId && businessId) {
      fetchSingleDiscount(discountId)
    }
  }, [searchParams, businessId])

  const limit = 20

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      if (!businessId) return

      const params = {
        page,
        limit,
        ...filters
      }

      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key]
        }
      })

      const response = await apiGet(
        `/seller/business/${businessId}/discounts`,
        params
      )

      if (response.data.success) {
        setDiscounts(response.data.data.discounts)
        setTotal(response.data.data.total)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const fetchSingleDiscount = async (discountId) => {
    try {
      setDetailLoading(true)
      setShowDetailDialog(true)

      const response = await apiGet(
        `/seller/business/${businessId}/discounts`,
        { discountId }
      )

      console.log(response)

      if (response.data.success) {
        setSelectedDiscount(response.data.data)
      } else {
        closeDiscountDialog()
      }

    } catch (error) {
      console.log(error)
      closeDiscountDialog()
    } finally {
      setDetailLoading(false)
    }
  }


  //   useEffect(() => {
  //     fetchDiscounts()
  //   }, [page])

  const handleStatusChange = async (discountId, action) => {
    try {
      await apiPatch(
        `/seller/business/${businessId}/discounts/${discountId}/status`,
        { action }
      )
      fetchDiscounts()
    } catch (error) {
      console.log(error)
    }
  }
  const closeDiscountDialog = () => {
    setShowDetailDialog(false)
    setSelectedDiscount(null)
    setSearchParams({})
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#212121] flex items-center gap-2">
            <FaTag className="text-[#0B77A7]" />
            Discounts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and control all your business discounts
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/discounts/create")}
          className="bg-[#0B77A7] hover:bg-[#095f85] transition text-white px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
        >
          <FaPlus />
          Create Discount
        </button>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#0B77A7]/20 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filters.discountCategory}
            onChange={(e) =>
              setFilters({ ...filters, discountCategory: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 cursor-pointer"
          >
            <option value="">All Category</option>
            <option value="promotion">Promotion</option>
            <option value="wholesale">Wholesale</option>
          </select>

          <select
            value={filters.scopeType}
            onChange={(e) =>
              setFilters({ ...filters, scopeType: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 cursor-pointer"
          >
            <option value="">All Scope</option>
            <option value="business">Business</option>
            <option value="category">Category</option>
            <option value="item">Item</option>
          </select>

          <button
            onClick={() => {
              setPage(1)
              fetchDiscounts()
            }}
            className="bg-[#0B77A7] hover:bg-[#095f85] text-white rounded-xl px-4 py-3 font-medium transition cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Scope</th>
                <th className="p-4 text-left">Priority</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500">
                    No discounts found
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr
                    key={discount.id}
                    onClick={() =>
                      setSearchParams({ discountId: discount.id })
                    }
                    className="border-b hover:bg-blue-50 transition cursor-pointer"
                  >

                    <td className="p-4 font-medium text-[#212121]">
                      {discount.name}
                    </td>

                    <td className="p-4 capitalize">
                      {discount.discountCategory}
                    </td>

                    <td className="p-4">
                      {discount.discountType} ({discount.value})
                    </td>

                    <td className="p-4 capitalize">
                      {discount.scopeType}
                    </td>

                    <td className="p-4">
                      {discount.priority}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${discount.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {discount.status}
                      </span>
                    </td>

                    <td className="p-4 flex flex-wrap gap-3">

                      {discount.status === "inactive" && (
                        <button
                          // onClick={() =>

                          //   handleStatusChange(discount.id, "activate")
                          // }
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(discount.id, "activate")
                          }}

                          className="flex items-center gap-2 bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                        >
                          <FaCheckCircle />
                          Activate
                        </button>
                      )}

                      {discount.status === "active" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(discount.id, "deactivate")
                          }}
                          className="flex items-center gap-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                        >
                          <FaTimesCircle />
                          Deactivate
                        </button>
                      )}

                      {discount.status === "inactive" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(discount.id, "delete")
                          }}
                          className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"          >
              <FaChevronLeft />
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"          >
              Next
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      <Dialog
        visible={showDetailDialog}
        onHide={closeDiscountDialog}
        style={{ width: "900px" }}
        header="Discount Details"
        contentStyle={{ maxHeight: "85vh", overflowY: "auto" }}
        className="rounded-2xl"
      >

        {detailLoading ? (
          <div className="py-20 text-center text-gray-500">
            Loading discount details...
          </div>
        ) : selectedDiscount && (
          //     <div className="space-y-6">

          //       <div>
          //         <h3 className="text-xl font-bold text-[#212121]">
          //           {selectedDiscount.name}
          //         </h3>
          //         <p className="text-sm text-gray-500 mt-1">
          //           ID: {selectedDiscount.id}
          //         </p>
          //       </div>

          //       <Divider />
          // <div>
          //   <p className="text-gray-500 text-sm">Description</p>
          //   <p className="font-medium">
          //     {selectedDiscount.description || "-"}
          //   </p>
          // </div>

          // <div>
          //   <p className="text-gray-500 text-sm">Threshold Type</p>
          //   <p className="font-semibold capitalize">
          //     {selectedDiscount.thresholdType || "-"}
          //   </p>
          // </div>

          // <div>
          //   <p className="text-gray-500 text-sm">Minimum Amount</p>
          //   <p className="font-semibold">
          //     ₹ {selectedDiscount.minAmount || "0"}
          //   </p>
          // </div>

          // <div>
          //   <p className="text-gray-500 text-sm">Stackable</p>
          //   <p className="font-semibold">
          //     {selectedDiscount.stackable ? "Yes" : "No"}
          //   </p>
          // </div>

          // <div>
          //   <p className="text-gray-500 text-sm">Exclusive</p>
          //   <p className="font-semibold">
          //     {selectedDiscount.exclusive ? "Yes" : "No"}
          //   </p>
          // </div>

          //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          //         <div>
          //           <p className="text-gray-500 text-sm">Category</p>
          //           <p className="font-semibold capitalize">
          //             {selectedDiscount.discountCategory}
          //           </p>
          //         </div>

          //         <div>
          //           <p className="text-gray-500 text-sm">Type</p>
          //           <p className="font-semibold">
          //             {selectedDiscount.discountType} ({selectedDiscount.value})
          //           </p>
          //         </div>

          //         <div>
          //           <p className="text-gray-500 text-sm">Scope</p>
          //           <p className="font-semibold capitalize">
          //             {selectedDiscount.scopeType}
          //           </p>
          //         </div>

          //         <div>
          //           <p className="text-gray-500 text-sm">Priority</p>
          //           <p className="font-semibold">
          //             {selectedDiscount.priority}
          //           </p>
          //         </div>

          //         <div>
          //           <p className="text-gray-500 text-sm">Status</p>
          //           <span
          //             className={`px-3 py-1 rounded-full text-xs font-semibold ${
          //               selectedDiscount.status === "active"
          //                 ? "bg-green-100 text-green-700"
          //                 : "bg-gray-200 text-gray-600"
          //             }`}
          //           >
          //             {selectedDiscount.status}
          //           </span>
          //         </div>

          //         <div>
          //           <p className="text-gray-500 text-sm">Validity</p>
          //           <p className="font-semibold">
          //            {selectedDiscount.startsAt
          //   ? new Date(selectedDiscount.startsAt).toLocaleDateString("en-IN")
          //   : "-"}
          // {" "}to{" "}
          // {selectedDiscount.endsAt
          //   ? new Date(selectedDiscount.endsAt).toLocaleDateString("en-IN")
          //   : "-"}

          //           </p>
          //         </div>

          //       </div>

          //       <Divider />

          //       <div className="flex gap-3 pt-4">

          //         {selectedDiscount.status === "inactive" && (
          //           <button
          //             onClick={() => {
          //               handleStatusChange(selectedDiscount.id, "activate")
          //               closeDiscountDialog()
          //             }}
          //             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 cursor-pointer rounded-xl font-medium transition"
          //           >
          //             Activate
          //           </button>
          //         )}

          //         {selectedDiscount.status === "active" && (
          //           <button
          //             onClick={() => {
          //               handleStatusChange(selectedDiscount.id, "deactivate")
          //               closeDiscountDialog()
          //             }}
          //             className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 cursor-pointer rounded-xl font-medium transition"
          //           >
          //             Deactivate
          //           </button>
          //         )}

          //         {selectedDiscount.status === "inactive" && (
          //           <button
          //             onClick={() => {
          //               handleStatusChange(selectedDiscount.id, "delete")
          //               closeDiscountDialog()
          //             }}
          //             className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl cursor-pointer font-medium transition"
          //           >
          //             Delete
          //           </button>
          //         )}
          //       </div>

          //     </div>
          <div className="space-y-8">

            {/* BASIC INFO */}
            <div>
              <h3 className="text-2xl font-bold text-[#212121]">
                {selectedDiscount.name}
              </h3>

              <div className="text-sm text-gray-500 space-y-1 mt-2">
                <p>ID: {selectedDiscount.id}</p>
                <p>Code: {selectedDiscount.code || "-"}</p>
                <p>
                  Created At:{" "}
                  {new Date(selectedDiscount.createdAt).toLocaleString("en-IN")}
                </p>
                <p>
                  Last Updated:{" "}
                  {new Date(selectedDiscount.updatedAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <Divider />

            {/* DESCRIPTION */}
            <div>
              <p className="text-gray-500 text-sm">Description</p>
              <p className="font-medium">
                {selectedDiscount.description || "-"}
              </p>
            </div>

            <Divider />

            {/* CORE CONFIG */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-semibold capitalize">
                  {selectedDiscount.discountCategory}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Type</p>
                <p className="font-semibold capitalize">
                  {selectedDiscount.discountType}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Value</p>
                <p className="font-semibold">
                  {selectedDiscount.discountType === "percentage"
                    ? `${selectedDiscount.value}%`
                    : `₹ ${selectedDiscount.value}`}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Scope</p>
                <p className="font-semibold capitalize">
                  {selectedDiscount.scopeType}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Priority</p>
                <p className="font-semibold">
                  {selectedDiscount.priority}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedDiscount.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {selectedDiscount.status}
                </span>
              </div>

            </div>

            <Divider />

            {/* THRESHOLD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Threshold Type</p>
                <p className="font-semibold capitalize">
                  {selectedDiscount.thresholdType || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Minimum Order Amount</p>
                <p className="font-semibold">
                  ₹ {selectedDiscount.minAmount || "0"}
                </p>
              </div>
            </div>

            <Divider />

            {/* USAGE LIMITS */}
            <div>
              <h4 className="font-bold text-lg text-[#212121] mb-4">
                Usage Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Global Usage Limit</p>
                  <p className="font-semibold">
                    {selectedDiscount.globalUsageLimit ?? "Unlimited"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Per User Limit</p>
                  <p className="font-semibold">
                    {selectedDiscount.perUserLimit ?? "Unlimited"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Current Usage Count</p>
                  <p className="font-semibold">
                    {selectedDiscount.usageCount}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* PROMO SETTINGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Public Promo</p>
                <p className="font-semibold">
                  {selectedDiscount.isPublicPromo ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Stackable</p>
                <p className="font-semibold">
                  {selectedDiscount.stackable ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Exclusive</p>
                <p className="font-semibold">
                  {selectedDiscount.exclusive ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <Divider />

            {/* VALIDITY */}
            <div>
              <p className="text-gray-500 text-sm">Validity Period</p>
              <p className="font-semibold">
                {selectedDiscount.startsAt
                  ? new Date(selectedDiscount.startsAt).toLocaleString("en-IN")
                  : "-"}{" "}
                to{" "}
                {selectedDiscount.endsAt
                  ? new Date(selectedDiscount.endsAt).toLocaleString("en-IN")
                  : "-"}
              </p>
            </div>

            <Divider />

            {/* META INFO */}
            <div>
              <h4 className="font-bold text-lg text-[#212121] mb-4">
                System Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Created By</p>
                  <p className="font-semibold break-all">
                    {selectedDiscount.createdBy}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Business ID</p>
                  <p className="font-semibold break-all">
                    {selectedDiscount.businessId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Scopes Count</p>
                  <p className="font-semibold">
                    {selectedDiscount.scopes?.length || 0}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Customers Attached</p>
                  <p className="font-semibold">
                    {selectedDiscount.customers?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="font-bold text-lg text-[#212121] mb-4">
                Where this discount applies
              </h4>

              {selectedDiscount.scopes?.length === 0 ? (

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-semibold text-blue-800">
                    This discount applies to all products in your store.
                  </p>
                </div>

              ) : (

                <div className="space-y-3">

                  {selectedDiscount.scopes.map((scope) => {

                    if (scope.categoryId) {
                      return (
                        <div
                          key={scope.id}
                          className="border rounded-xl p-4 bg-gray-50"
                        >
                          <p className="font-medium">
                            Applies to all products in the category:
                          </p>
                          <p className="font-bold text-[#0B77A7]">
                            {scope.category?.name}
                          </p>
                        </div>
                      )
                    }

                    if (scope.itemId) {
                      return (
                        <div
                          key={scope.id}
                          className="border rounded-xl p-4 bg-gray-50"
                        >
                          <p className="font-medium">
                            Applies only to this product:
                          </p>
                          <p className="font-bold text-[#0B77A7]">
                            {scope.item?.name}
                          </p>
                        </div>
                      )
                    }

                    return null
                  })}

                </div>

              )}
            </div>
            <Divider />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">

              {selectedDiscount.status === "inactive" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedDiscount.id, "activate")
                    closeDiscountDialog()
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition"
                >
                  Activate
                </button>
              )}

              {selectedDiscount.status === "active" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedDiscount.id, "deactivate")
                    closeDiscountDialog()
                  }}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-medium transition"
                >
                  Deactivate
                </button>
              )}

              {selectedDiscount.status === "inactive" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedDiscount.id, "delete")
                    closeDiscountDialog()
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium transition"
                >
                  Delete
                </button>
              )}

            </div>

          </div>
        )}

      </Dialog>

    </div>
  )

}

export default Discounts
