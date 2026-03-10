import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiPost, apiGet } from "../services/api"
import { useBusiness } from "../context/BusinessContext"
import { useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRef } from "react"
import { Calendar } from "react-feather"
import { Toast } from "primereact/toast"

const CreateDiscount = () => {
  const navigate = useNavigate()
  const toast = useRef(null)
const { businessId } = useBusiness()
  const [loading, setLoading] = useState(false)
const [categories, setCategories] = useState([])
const [customers, setCustomers] = useState([])
const [items, setItems] = useState([])

  const [form, setForm] = useState({
  name: "",
  description: "",
  discountCategory: "promotion",
  discountType: "percentage",
  value: "",
  scopeType: "business",
  priority: 100,
  thresholdType: "none",
  minAmount: "",
  startsAt: "",
  endsAt: "",
  scopes: [],
  businessCustomerIds: [],

  buyQuantity: "",
  getQuantity: "",
  getMax: "",
  freeGiftItemId: "",
  freeGiftName: "",
  code: "",
  globalUsageLimit: "",
  perUserLimit: "",
  isPublicPromo: true
})

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target

  if (name === "scopeType") {
    setForm({
      ...form,
      scopeType: value,
      scopes: []
    })
    return
  }

  setForm({
    ...form,
    [name]: type === "checkbox" ? checked : value
  })
}

const toggleCustomer = (id) => {
  setForm((prev) => {
    const alreadySelected = prev.businessCustomerIds.includes(id)

    if (alreadySelected) {
      return {
        ...prev,
        businessCustomerIds: prev.businessCustomerIds.filter(
          (cid) => cid !== id
        )
      }
    } else {
      return {
        ...prev,
        businessCustomerIds: [...prev.businessCustomerIds, id]
      }
    }
  })
}

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      if (form.discountCategory === "wholesale") {
        const res = await apiGet(
          `/seller/business/${businessId}/customers?type=wholesale&status=active`
        )
        const customerList =
          // Array.isArray(res?.data?.data)
          //   ? res.data.data
            Array.isArray(res?.data?.result?.data)
    ? res.data.result.data
            : []
        setCustomers(customerList)
      }
    } catch (error) {
const message =
    error?.response?.data?.message ||
    "Failed to create discount"

toast.current.show({
  severity: "error",
  summary: "Error",
  detail: message
})
      setCustomers([])
    }
  }
  fetchCustomers()
}, [form.discountCategory, businessId])

useEffect(() => {
  const fetchScopes = async () => {
    try {
      if (form.scopeType === "category") {
        const res = await apiGet(`/seller/business/${businessId}/categories`)
        const categoryList =
          Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
            ? res.data.data
            : []
        setCategories(categoryList)
      }
      if (form.scopeType === "item") {
        const res = await apiGet(`/seller/business/${businessId}/products`)     
        const itemList =
  Array.isArray(res?.data?.data?.rows)
    ? res.data.data.rows
    : []
        setItems(itemList)
      }
    } catch (error) {
      console.log(error)
      setCategories([])
      setItems([])
    }
  }
  fetchScopes()
}, [form.scopeType, businessId])

useEffect(() => {
  const fetchProducts = async () => {
    try {
      if (
        form.scopeType === "item" ||
        form.discountType === "free_gift"
      ) {
        const res = await apiGet(
          `/seller/business/${businessId}/products`
        )

        const productList =
          Array.isArray(res?.data?.data?.rows)
            ? res.data.data.rows
            : []

        setItems(productList)
      }
    } catch (error) {
      console.log(error)
      setItems([])
    }
  }

  fetchProducts()
}, [form.scopeType, form.discountType, businessId])

const formatTo12Hour = (value) => {
  if (!value) return ""

  const date = new Date(value)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (form.discountType === "percentage" && form.value > 100) {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "Percentage cannot exceed 100",
    })
    return
  }

  if (
    form.thresholdType !== "none" &&
    (!form.minAmount || form.minAmount <= 0)
  ) {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "Minimum amount required",
    })
    return
  }

  if (
    form.discountCategory === "wholesale" &&
    form.businessCustomerIds.length === 0
  ) {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "Select at least one wholesale customer",
    })
    return
  }

  if (
    form.scopeType !== "business" &&
    form.scopes.length === 0
  ) {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "Please select scope",
    })
    return
  }

  if (form.discountType === "bogo") {
    if (!form.buyQuantity || !form.getQuantity) {
      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "BOGO requires buy & get quantity",
      })
      return
    }
  }
  if (form.startsAt && form.endsAt) {
  if (new Date(form.endsAt) <= new Date(form.startsAt)) {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "End date must be after start date"
    })
    return
  }
}

  if (form.discountType === "free_gift") {
    if (!form.buyQuantity) {
      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "Free gift requires buy quantity",
      })
      return
    }

    if (!form.freeGiftItemId && !form.freeGiftName) {
      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "Select gift item OR enter fallback gift name",
      })
      return
    }
  }

  try {
    setLoading(true)

    const payload = {
      ...form,

      value:
        form.discountType === "percentage" ||
        form.discountType === "flat"
          ? Number(form.value)
          : null,

      buyQuantity:
        form.discountType === "bogo" ||
        form.discountType === "free_gift"
          ? Number(form.buyQuantity)
          : null,

      getQuantity:
        form.discountType === "bogo"
          ? Number(form.getQuantity)
          : null,

      getMax: form.getMax ? Number(form.getMax) : null,

      freeGiftItemId:
        form.discountType === "free_gift" && form.freeGiftItemId
          ? form.freeGiftItemId
          : null,

      freeGiftName:
        form.discountType === "free_gift" && !form.freeGiftItemId
          ? form.freeGiftName || null
          : null,

      priority: Number(form.priority),

      minAmount:
        form.thresholdType !== "none"
          ? Number(form.minAmount)
          : null,

      globalUsageLimit:
        form.globalUsageLimit
          ? Number(form.globalUsageLimit)
          : null,

      perUserLimit:
        form.perUserLimit
          ? Number(form.perUserLimit)
          : null,

      code: form.code || null,
    }

    const res = await apiPost(
      `/seller/business/${businessId}/discount/create`,
      payload
    )

    if (res.data.success) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Discount created successfully",
      })

      setTimeout(() => {
        navigate("/dashboard/discounts")
      }, 800)
    }

  } catch (error) {
    toast.current.show({
      severity: "error",
      summary: "Creation Failed",
      detail:
        error?.response?.data?.message ||
        "Unable to create discount. Please try again.",
    })
  } finally {
    setLoading(false)
  }
}
return (
  <div className="bg-white p-8 rounded-2xl shadow-lg">
    <Toast ref={toast} />
    <h2 className="text-2xl font-bold text-[#212121] mb-2">
      Create Discount
    </h2>
    <p className="text-sm text-gray-500 mb-8">
      Discount will be created as <span className="font-semibold">inactive</span>. You must activate it later.
    </p>

    <form onSubmit={handleSubmit} className="space-y-10">

      {/* 1. BASIC INFORMATION */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">1. Basic Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#0B77A7]/20 focus:border-[#0B77A7] outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            />
          </div>
        </div>
      </div>

      {/* 2. DISCOUNT CATEGORY */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">2. Discount Category</h3>

        <label className="block font-medium mb-2">Category Type</label>
        <select
          name="discountCategory"
          value={form.discountCategory}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3"
        >
          <option value="promotion">Promotion (All Customers)</option>
          <option value="wholesale">Wholesale (Specific Customers)</option>
        </select>

        {form.discountCategory === "wholesale" && (
          <p className="text-sm text-gray-500 mt-3">
            Wholesale discounts must be linked to specific customers.
          </p>
        )}
      </div>
      {form.discountCategory === "wholesale" && (
  <div className="mt-4">
    <label className="block font-medium mb-2">
      Select Wholesale Customers
    </label>

    
    {form.discountCategory === "wholesale" && (
  <div className="mt-6">
   

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-4">
      {customers.length === 0 && (
        <p className="text-sm text-gray-500">
          No wholesale customers found.
        </p>
      )}

      {customers.map((cust) => {
        const isSelected = form.businessCustomerIds.includes(cust.id)

        return (
          <div
            key={cust.id}
            onClick={() => toggleCustomer(cust.id)}
            className={`cursor-pointer border rounded-xl p-4 transition 
              ${isSelected 
                ? "border-[#0B77A7] bg-[#0B77A7]/10" 
                : "border-gray-200 hover:border-[#0B77A7]/40"}
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {cust.customer?.profile?.displayName || cust.customer?.identifier}
                </p>
                <p className="text-xs text-gray-500">
                  {cust.customer?.identifier}
                </p>
              </div>

              {isSelected && (
                <div className="text-[#0B77A7] font-bold text-lg">
                  ✓
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>

    {form.businessCustomerIds.length > 0 && (
      <p className="text-sm text-gray-500 mt-3">
        {form.businessCustomerIds.length} customer(s) selected
      </p>
    )}
  </div>
)}

    <p className="text-xs text-gray-500 mt-2">
      Hold Ctrl (Windows) or Command (Mac) to select multiple customers
    </p>
  </div>
)}

      {/* 3. CALCULATION */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">3. How Discount Is Calculated</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            >
            <option value="percentage">Percentage (%)</option>
<option value="flat">Flat Amount (₹)</option>
<option value="bogo">Buy X Get Y</option>
<option value="free_gift">Free Gift</option>
<option value="free_shipping">Free Shipping</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Value</label>
           {(form.discountType === "percentage" ||
  form.discountType === "flat") && (
  <input
    type="number"
    name="value"
    value={form.value}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-xl p-3"
  />
)}
            {form.discountType === "percentage" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter value between 0–100
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. SCOPE */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">4. Where Should It Apply?</h3>

        <label className="block font-medium mb-2">Scope Type</label>
        <select
          name="scopeType"
          value={form.scopeType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-3"
        >
          <option value="business">Entire Business</option>
          <option value="category">Specific Category</option>
          <option value="item">Specific Item</option>
        </select>

{form.scopeType === "category" && (
  <div className="mt-4">
    <label className="block font-medium mb-2">
      Select Category
    </label>

    <select
      className="w-full border border-gray-300 rounded-xl p-3"
      onChange={(e) =>
        setForm({
          ...form,
          scopes: [{ categoryId: e.target.value }]
        })
      }
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>
)}

{form.scopeType === "item" && (
  <div className="mt-4">
    <label className="block font-medium mb-2">
      Select Item
    </label>

    <select
      className="w-full border border-gray-300 rounded-xl p-3"
      onChange={(e) =>
        setForm({
          ...form,
          scopes: [{ itemId: e.target.value }]
        })
      }
    >
      <option value="">Select Item</option>
    {items.map((item) => (
  <option key={item.id} value={item.id}>
    {item.title}
  </option>
))}
    </select>
  </div>
)}
      </div>

      {/* 5. ADVANCED RULES */}
      <div className="border-b pb-8">
        <h3 className="text-lg font-semibold mb-4">5. Advanced Rules</h3>

        <div className="space-y-6">

          <div>
            <label className="block font-medium mb-2">Minimum Condition</label>
            <select
              name="thresholdType"
              value={form.thresholdType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            >
              <option value="none">No Minimum</option>
              <option value="order_total">Minimum Order Total</option>
              <option value="item_subtotal">Minimum Item Value</option>
              <option value="category_subtotal">Minimum Category Value</option>
            </select>
          </div>

          {form.thresholdType !== "none" && (
            <div>
              <label className="block font-medium mb-2">Minimum Amount</label>
              <input
                type="number"
                name="minAmount"
                value={form.minAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3"
              />
            </div>
          )}

          <div>
            <label className="block font-medium mb-2">Priority</label>
            <input
              type="number"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower number = higher priority
            </p>
          </div>

          {form.discountType === "bogo" && (
  <div className="grid grid-cols-3 gap-4 mt-6">
    <input
      type="number"
      name="buyQuantity"
      placeholder="Buy Quantity"
      value={form.buyQuantity}
      onChange={handleChange}
      required
      className="border rounded-xl p-3"
    />
    <input
      type="number"
      name="getQuantity"
      placeholder="Get Quantity"
      value={form.getQuantity}
      onChange={handleChange}
      required
      className="border rounded-xl p-3"
    />
    <input
      type="number"
      name="getMax"
      placeholder="Max Free Items"
      value={form.getMax}
      onChange={handleChange}
      className="border rounded-xl p-3"
    />
  </div>
)}

{/* {form.discountType === "free_gift" && (
  <div className="grid grid-cols-2 gap-4 mt-6">
    <input
      type="number"
      name="buyQuantity"
      placeholder="Buy Quantity"
      value={form.buyQuantity}
      onChange={handleChange}
      required
      className="border rounded-xl p-3"
    />

    <select
      name="freeGiftItemId"
      value={form.freeGiftItemId}
      onChange={handleChange}
      className="border rounded-xl p-3"
    >
      <option value="">Select Gift Item</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      ))}
    </select>

    <input
      type="text"
      name="freeGiftName"
      value={form.freeGiftName}
      placeholder="Fallback Gift Name"
      onChange={handleChange}
      className="border rounded-xl p-3 col-span-2"
    />
  </div>
)} */}

{form.discountType === "free_gift" && (
  <div className="grid grid-cols-2 gap-4 mt-6">

    {/* BUY QUANTITY */}
    <input
      type="number"
      name="buyQuantity"
      placeholder="Buy Quantity"
      value={form.buyQuantity}
      onChange={handleChange}
      required
      className="border rounded-xl p-3"
    />

    {/* SELECT GIFT ITEM */}
    <select
      name="freeGiftItemId"
      value={form.freeGiftItemId}
      onChange={handleChange}
      className="border rounded-xl p-3"
    >
      <option value="">Select Gift Item (Optional)</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      ))}
    </select>

    {/* FALLBACK GIFT NAME */}
    <input
      type="text"
      name="freeGiftName"
      value={form.freeGiftName}
      placeholder="Fallback Gift Name (Required if no gift item selected)"
      onChange={handleChange}
      className="border rounded-xl p-3 col-span-2"
    />

    <p className="text-xs text-gray-500 col-span-2">
      Select a gift item OR enter a fallback gift name.
    </p>

  </div>
)}
          <div className="flex gap-6">
          </div>
        </div>
      </div>

      <div className="border-b pb-8">
  <h3 className="text-lg font-semibold mb-4">6. Coupon Settings</h3>

  <input
    type="text"
    name="code"
    value={form.code}
    placeholder="Coupon Code (optional)"
    onChange={handleChange}
    className="w-full border rounded-xl p-3 mb-4"
  />

  <div className="grid grid-cols-2 gap-4">
    <input
      type="number"
      name="globalUsageLimit"
      value={form.globalUsageLimit}
      placeholder="Global Usage Limit"
      onChange={handleChange}
      className="border rounded-xl p-3"
    />

    <input
      type="number"
      name="perUserLimit"
      value={form.perUserLimit}
      placeholder="Per User Limit"
      onChange={handleChange}
      className="border rounded-xl p-3"
    />
  </div>

  <label className="flex items-center gap-2 mt-4">
    <input
      type="checkbox"
      name="isPublicPromo"
      checked={form.isPublicPromo}
      onChange={handleChange}
    />
    Public Promotion
  </label>
</div>

{/* 7. ACTIVE PERIOD */}
<div className="border-b pb-10">
  <h3 className="text-lg font-semibold mb-6">7. Active Period</h3>

  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* START DATE */}
      <div>
        <label className="block font-semibold text-sm mb-2 text-gray-700">
          Starts At
        </label>

        <div className="relative">
          <DatePicker
            selected={form.startsAt ? new Date(form.startsAt) : null}
            onChange={(date) =>
              setForm({
                ...form,
                startsAt: date ? date.toISOString() : ""
              })
            }
            showTimeSelect
            timeIntervals={15}
            dateFormat="dd MMM yyyy, hh:mm aa"
            minDate={new Date()}
            className="w-full border border-gray-300 rounded-xl p-4 pr-12 focus:ring-2 focus:ring-[#0B77A7]/30 focus:border-[#0B77A7] outline-none bg-white shadow-sm"
            placeholderText="Select start date & time"
          />

          <Calendar
            size={18}
            className="absolute right-4 top-4 text-gray-400 pointer-events-none"
          />
        </div>

        {form.startsAt && (
          <p className="text-xs text-gray-600 mt-2">
            Selected:{" "}
            <span className="font-medium text-[#0B77A7]">
              {formatTo12Hour(form.startsAt)}
            </span>
          </p>
        )}
      </div>

      {/* END DATE */}
      <div>
        <label className="block font-semibold text-sm mb-2 text-gray-700">
          Ends At
        </label>

        <div className="relative">
          <DatePicker
            selected={form.endsAt ? new Date(form.endsAt) : null}
            onChange={(date) =>
              setForm({
                ...form,
                endsAt: date ? date.toISOString() : ""
              })
            }
            showTimeSelect
            timeIntervals={15}
            dateFormat="dd MMM yyyy, hh:mm aa"
            minDate={
              form.startsAt ? new Date(form.startsAt) : new Date()
            }
            className="w-full border border-gray-300 rounded-xl p-4 pr-12 focus:ring-2 focus:ring-[#0B77A7]/30 focus:border-[#0B77A7] outline-none bg-white shadow-sm"
            placeholderText="Select end date & time"
          />

          <Calendar
            size={18}
            className="absolute right-4 top-4 text-gray-400 pointer-events-none"
          />
        </div>

        {form.endsAt && (
          <p className="text-xs text-gray-600 mt-2">
            Selected:{" "}
            <span className="font-medium text-[#0B77A7]">
              {formatTo12Hour(form.endsAt)}
            </span>
          </p>
        )}
      </div>
    </div>

    {/* Helper Info */}
    <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
      If no end date is selected, the discount will remain active until manually disabled.
    </div>

  </div>
</div>

      {/* SUBMIT */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0B77A7] hover:bg-[#095f85] transition text-white px-8 py-3 rounded-xl font-semibold shadow-md"
        >
          {loading ? "Creating..." : "Create Discount"}
        </button>
      </div>

    </form>
  </div>
)

}

export default CreateDiscount
