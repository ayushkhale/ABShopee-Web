import { useState } from "react"
import { useBusiness } from "../context/BusinessContext"
import { useNavigate } from "react-router-dom"
import { apiPost } from "../services/api"

const CreateTaxRule = () => {
  const { businessId } = useBusiness()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    scopeType: "business",
    scopeReferenceId: "",
    buyerType: "all",

    intraStateApplicable: true,
    interStateApplicable: true,
    exportApplicable: false,
    sezApplicable: false,

    reverseCharge: false,
    blockIfComposition: true,
    priority: 0,

    startsAt: "",
    endsAt: ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!form.name) {
//       alert("Rule name is required")
//       return
//     }

//     if (
//       ["category", "item", "tax_code"].includes(form.scopeType) &&
//       !form.scopeReferenceId
//     ) {
//       alert("Scope reference is required for selected scope type")
//       return
//     }

//     if (
//       !form.intraStateApplicable &&
//       !form.interStateApplicable &&
//       !form.exportApplicable &&
//       !form.sezApplicable
//     ) {
//       alert("At least one transaction applicability must be selected")
//       return
//     }

//     if (form.endsAt && form.startsAt && form.endsAt < form.startsAt) {
//       alert("End date must be after start date")
//       return
//     }

//     try {
//       setSubmitting(true)

//       await apiPost(
//         `/tax/seller/business/${businessId}/tax/taxrule/create`,
//         form
//       )

//       alert("Tax Rule created successfully")
//       navigate("/dashboard/tax")

//     } catch (err) {
//       console.error(err)
//       alert("Failed to create tax rule")
//     } finally {
//       setSubmitting(false)
//     }
//   }
const handleSubmit = async (e) => {
  e.preventDefault()

  if (!form.name) {
    alert("Rule name is required")
    return
  }

  if (
    ["category", "item", "tax_code"].includes(form.scopeType) &&
    !form.scopeReferenceId
  ) {
    alert("Scope reference is required for selected scope type")
    return
  }

  if (
    !form.intraStateApplicable &&
    !form.interStateApplicable &&
    !form.exportApplicable &&
    !form.sezApplicable
  ) {
    alert("At least one transaction applicability must be selected")
    return
  }

  if (form.endsAt && form.startsAt && form.endsAt < form.startsAt) {
    alert("End date must be after start date")
    return
  }

  try {
    setSubmitting(true)

    // 🔥 Build payload properly
    const payload = { ...form }

    // Remove scopeReferenceId if scopeType = business
    if (form.scopeType === "business") {
      delete payload.scopeReferenceId
    }

    // Remove empty dates
    if (!payload.startsAt) delete payload.startsAt
    if (!payload.endsAt) delete payload.endsAt

    await apiPost(
      `/tax/seller/business/${businessId}/tax/taxrule/create`,
      payload
    )

    alert("Tax Rule created successfully")
    navigate("/dashboard/tax")

  } catch (err) {
    console.error(err)
    alert("Failed to create tax rule")
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Create Business Tax Rule
          </h1>
          <p className="text-gray-500 mt-2">
            Configure when and how tax codes apply to transactions
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Rule Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter rule name"
                className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>

            {/* Scope Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope Type *
              </label>
              <select
                name="scopeType"
                value={form.scopeType}
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-3 rounded-xl"
              >
                <option value="business">Business</option>
                <option value="category">Category</option>
                <option value="item">Item</option>
                <option value="tax_code">Tax Code</option>
              </select>
            </div>

            {/* Scope Reference */}
            {["category", "item", "tax_code"].includes(form.scopeType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope Reference ID *
                </label>
                <input
                  type="text"
                  name="scopeReferenceId"
                  value={form.scopeReferenceId}
                  onChange={handleChange}
                  placeholder="Enter related UUID"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl"
                />
              </div>
            )}

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Type
              </label>
              <select
                name="buyerType"
                value={form.buyerType}
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-3 rounded-xl"
              >
                <option value="all">All</option>
                <option value="b2b">B2B</option>
                <option value="b2c">B2C</option>
              </select>
            </div>

            {/* Transaction Applicability */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Transaction Applicability *
              </p>

              {[
                "intraStateApplicable",
                "interStateApplicable",
                "exportApplicable",
                "sezApplicable"
              ].map((field) => (
                <label key={field} className="flex justify-between items-center">
                  <span className="text-sm capitalize text-gray-600">
                    {field.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    name={field}
                    checked={form[field]}
                    onChange={handleChange}
                    className="w-5 h-5 accent-purple-600"
                  />
                </label>
              ))}
            </div>

            {/* Advanced Flags */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <label className="flex justify-between items-center">
                <span className="text-sm">Reverse Charge</span>
                <input
                  type="checkbox"
                  name="reverseCharge"
                  checked={form.reverseCharge}
                  onChange={handleChange}
                  className="w-5 h-5 accent-purple-600"
                />
              </label>

              <label className="flex justify-between items-center">
                <span className="text-sm">Block if Composition</span>
                <input
                  type="checkbox"
                  name="blockIfComposition"
                  checked={form.blockIfComposition}
                  onChange={handleChange}
                  className="w-5 h-5 accent-purple-600"
                />
              </label>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                min="0"
                max="1000"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-3 rounded-xl"
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  name="startsAt"
                  value={form.startsAt}
                  onChange={handleChange}
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">End Date</label>
                <input
                  type="date"
                  name="endsAt"
                  value={form.endsAt}
                  onChange={handleChange}
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl shadow-md font-medium disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Tax Rule"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTaxRule