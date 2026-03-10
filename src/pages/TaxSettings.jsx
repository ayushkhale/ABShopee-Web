import { useEffect, useState } from "react"
import { useBusiness } from "../context/BusinessContext";
import { useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { apiGet, apiPatch ,apiDelete } from '../services/api'
const TaxSettings = () => {
  const { businessId } = useBusiness()
  const navigate = useNavigate()

  const [gstSlabs, setGstSlabs] = useState([])
  const [taxCodes, setTaxCodes] = useState([])
  const [loadingSlabs, setLoadingSlabs] = useState(false)
  const [loadingTaxCodes, setLoadingTaxCodes] = useState(false)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [taxCategory, setTaxCategory] = useState("")
  const [includeInactive, setIncludeInactive] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
const [selectedTaxCode, setSelectedTaxCode] = useState(null)
const [updating, setUpdating] = useState(false)
const [taxRules, setTaxRules] = useState([])
const [loadingTaxRules, setLoadingTaxRules] = useState(false)

const [rulePage, setRulePage] = useState(1)
const [ruleLimit] = useState(10)
const [ruleTotal, setRuleTotal] = useState(0)
const [isRuleEditOpen, setIsRuleEditOpen] = useState(false)
const [selectedRule, setSelectedRule] = useState(null)
const [ruleUpdating, setRuleUpdating] = useState(false)

const [ruleEditForm, setRuleEditForm] = useState({
  name: "",
  buyerType: "all",
  priority: 0,
  status: "active",
  intraStateApplicable: true,
  interStateApplicable: true,
  exportApplicable: false,
  sezApplicable: false,
  reverseCharge: false,
  blockIfComposition: true
})
const [ruleIncludeInactive, setRuleIncludeInactive] = useState(false)
const [ruleStatus, setRuleStatus] = useState("")
const [ruleBuyerType, setRuleBuyerType] = useState("")
const [ruleScopeType, setRuleScopeType] = useState("")

const [editForm, setEditForm] = useState({
  hsnSacCode: "",
  description: "",
  taxCategory: "goods",
  gstRateId: "",
  isExempt: false,
  isZeroRated: false,
  isActive: true
})

const handleRuleEditOpen = (rule) => {
  setSelectedRule(rule)
  setRuleEditForm({
    name: rule.name,
    buyerType: rule.buyerType,
    priority: rule.priority,
status: rule.status,
    intraStateApplicable: rule.intraStateApplicable,
    interStateApplicable: rule.interStateApplicable,
    exportApplicable: rule.exportApplicable,
    sezApplicable: rule.sezApplicable,
    reverseCharge: rule.reverseCharge,
    blockIfComposition: rule.blockIfComposition
  })
  setIsRuleEditOpen(true)
}

const handleRuleDelete = async (ruleId) => {
  if (!window.confirm("Are you sure you want to delete this tax rule?")) return

  try {
    await apiDelete(
      `/tax/seller/business/${businessId}/tax/taxrule/${ruleId}/delete`
    )

    fetchTaxRules()
  } catch (err) {
    console.error(err)
    alert("Failed to delete tax rule")
  }
}

const handleRuleEditChange = (e) => {
  const { name, value, type, checked } = e.target
  setRuleEditForm({
    ...ruleEditForm,
    [name]: type === "checkbox" ? checked : value
  })
}

const handleRuleUpdate = async (e) => {
  e.preventDefault()

  try {
    setRuleUpdating(true)

    const payload = { ...ruleEditForm }

    await apiPatch(
      `/tax/seller/business/${businessId}/tax/taxrule/${selectedRule.id}/update`,
      payload
    )

    setIsRuleEditOpen(false)
    fetchTaxRules()

  } catch (err) {
    console.error(err)
    alert("Failed to update tax rule")
  } finally {
    setRuleUpdating(false)
  }
}

  useEffect(() => {
    fetchGstSlabs()
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchTaxCodes()
    }
  }, [businessId, page, taxCategory, includeInactive])

const handleEditOpen = (code) => {
  setSelectedTaxCode(code)
  setEditForm({
    hsnSacCode: code.hsnSacCode,
    description: code.description,
    taxCategory: code.taxCategory,
    gstRateId: code.gstRateId,
    isExempt: code.isExempt,
    isZeroRated: code.isZeroRated,
    isActive: code.isActive
  })
  setIsEditOpen(true)
}

const handleEditChange = (e) => {
  const { name, value, type, checked } = e.target
  setEditForm({
    ...editForm,
    [name]: type === "checkbox" ? checked : value
  })
}

const fetchTaxRules = async () => {
  try {
    setLoadingTaxRules(true)

    const res = await apiGet(
      `/tax/seller/business/${businessId}/tax/taxrules`,
      {
        includeInactive: ruleIncludeInactive,
        scopeType: ruleScopeType || undefined,
        buyerType: ruleBuyerType || undefined,
        status: ruleStatus || undefined,
        page: rulePage,
        limit: ruleLimit
      }
    )

    setTaxRules(res.data.data || [])
    setRuleTotal(res.data.meta?.total || 0)

  } catch (err) {
    console.error(err)
  } finally {
    setLoadingTaxRules(false)
  }
}

useEffect(() => {
  if (businessId) {
    fetchTaxRules()
  }
}, [
  businessId,
  rulePage,
  ruleIncludeInactive,
  ruleScopeType,
  ruleBuyerType,
  ruleStatus
])

const handleUpdate = async (e) => {
  e.preventDefault()

  try {
    setUpdating(true)

    await apiPatch(
      `/tax/seller/business/${businessId}/tax/taxcode/${selectedTaxCode.id}/update`,
      editForm
    )

    setIsEditOpen(false)
    fetchTaxCodes()

  } catch (err) {
    console.error(err)
    alert("Failed to update tax code")
  } finally {
    setUpdating(false)
  }
}

  const fetchGstSlabs = async () => {
    try {
      setLoadingSlabs(true)
      const res = await apiGet("/tax/seller/business/tax-info")
      setGstSlabs(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSlabs(false)
    }
  }

const fetchTaxCodes = async () => {
  try {
    setLoadingTaxCodes(true)

    const res = await apiGet(
      `/tax/seller/business/${businessId}/tax/taxcodes`,
      {
        page,
        limit,
        taxCategory: taxCategory || undefined,
        includeInactive
      }
    )

    setTaxCodes(res.data.data || [])
    setTotal(res.data.meta?.total || 0)
  } catch (err) {
    console.error(err)
  } finally {
    setLoadingTaxCodes(false)
  }
}

return (
<div className="min-h-screen bg-[#F4F6FA] px-6 md:px-10 py-8">
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

  <div>
<h1 className="text-3xl font-semibold text-gray-900 tracking-tight">      Tax Settings
    </h1>
    <p className="text-gray-500 mt-1 text-sm">
      Manage GST slabs and business tax codes
    </p>
  </div>

  <div className="flex gap-3">

    <button
      onClick={() => navigate("/dashboard/tax/create")}
className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"    >
      <FaPlus size={14} />
      Create Tax Code
    </button>

    <button
      onClick={() => navigate("/dashboard/tax-rule/create")}
className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-all"    >
      <FaPlus size={14} />
      Create Tax Rule
    </button>

  </div>

</div>
    {/* GST MASTER SECTION */}
<div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
        GST Master Slabs
      </h2>

      {loadingSlabs ? (
        <p className="text-gray-500">Loading GST slabs...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {gstSlabs.map((slab) => (
            <div
              key={slab.id}
className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl p-6 transition-all hover:shadow-md"            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  {slab.slabCode}
                </span>
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {slab.totalRate}%
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Effective From: {slab.effectiveFrom}
              </p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                {slab.components?.map((c, index) => (
                  <div key={index}>
                    {c.transactionType} → {c.componentType} : {c.rate}%
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}  
    </div>

    {/* TAX CODE LIST SECTION */}
<div className="bg-white border border-gray-200 rounded-3xl p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Business Tax Codes
        </h2>
  
        {/* FILTERS */}
<div className="flex flex-wrap items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200">          <select
            value={taxCategory}
            onChange={(e) => setTaxCategory(e.target.value)}
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Category</option>
            <option value="goods">Goods</option>
            <option value="service">Service</option>
          </select>

          <label className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="accent-blue-600"
            />
            Include Inactive
          </label>
        </div>
      </div>

      {loadingTaxCodes ? (
        <p className="text-gray-500">Loading tax codes...</p>
      ) : (
<div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">          <table className="min-w-full text-sm">
            <thead>
<tr className="text-left bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
  <th className="py-4 px-6">HSN/SAC</th>
  <th className="py-4 px-6">Description</th>
  <th className="py-4 px-6">Category</th>
  <th className="py-4 px-6">Exempt</th>
  <th className="py-4 px-6">Zero Rated</th>
  <th className="py-4 px-6">Status</th>
</tr>
            </thead>
<tbody className="divide-y divide-gray-100">              {taxCodes.map((code) => (
                <tr
                  key={code.id}
                    onClick={() => handleEditOpen(code)}

className="hover:bg-blue-50/40 cursor-pointer transition"                >
<td className="py-4 px-6 font-medium text-gray-700">                    {code.hsnSacCode}
                  </td>
<td className="py-4 px-6 font-medium text-gray-700">
                      {code.description}
                  </td>
                  <td className="py-4 px-6 font-medium  capitalize text-gray-600">
                    {code.taxCategory}
                  </td>
                  <td className="py-4 px-6 font-medium ">
                    {code.isExempt ? (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-4">
                    {code.isZeroRated ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        code.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {code.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {page}
            </span>

            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg font-medium shadow-sm disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

    {/* TAX RULE LIST SECTION */}
<div className="bg-white border border-gray-200 rounded-3xl p-8 mt-10">

  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
    <h2 className="text-xl font-semibold text-gray-800">
      Business Tax Rules
    </h2>

    <div className="flex flex-wrap gap-3">

      <select
        value={ruleScopeType}
        onChange={(e) => setRuleScopeType(e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Scope</option>
        <option value="business">Business</option>
        <option value="category">Category</option>
        <option value="item">Item</option>
        <option value="tax_code">Tax Code</option>
      </select>

      <select
        value={ruleBuyerType}
        onChange={(e) => setRuleBuyerType(e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Buyers</option>
        <option value="all">All</option>
        <option value="b2b">B2B</option>
        <option value="b2c">B2C</option>
      </select>

      <select
        value={ruleStatus}
        onChange={(e) => setRuleStatus(e.target.value)}
        className="bg-gray-100 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <label className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={ruleIncludeInactive}
          onChange={(e) => setRuleIncludeInactive(e.target.checked)}
          className="accent-blue-600"
        />
        Include Inactive
      </label>

    </div>
  </div>

  {loadingTaxRules ? (
    <p className="text-gray-500">Loading tax rules...</p>
  ) : (
    <div className="overflow-x-auto rounded-xl">
<table className="min-w-full text-sm border-separate border-spacing-y-1">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3">Rule Name</th>
            <th className="py-3">Scope</th>
            <th className="py-3">Buyer Type</th>
            <th className="py-3">Priority</th>
            <th className="py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {taxRules.map((rule) => (
            <tr
              key={rule.id}
                onClick={() => handleRuleEditOpen(rule)}

              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="py-4 font-medium text-gray-700">
                {rule.name}
              </td>

              <td className="py-4 capitalize text-gray-600">
                {rule.scopeType}
              </td>

              <td className="py-4 uppercase text-gray-600">
                {rule.buyerType}
              </td>

              <td className="py-4 text-gray-600">
                {rule.priority}
              </td>

              <td className="py-4">
              <span
  className={`px-3 py-1 rounded-full text-xs font-medium ${
    rule.status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600"
  }`}
>
  {rule.status === "active" ? "Active" : "Inactive"}
</span>
              </td>
              <td className="py-4">
  <button
    onClick={(e) => {
      e.stopPropagation()
      handleRuleDelete(rule.id)
    }}
    className="text-red-600 hover:underline text-sm"
  >
    Delete
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-3 mt-6">
        <button
          disabled={rulePage === 1}
          onClick={() => setRulePage(rulePage - 1)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {rulePage}
        </span>

        <button
          disabled={rulePage * ruleLimit >= ruleTotal}
          onClick={() => setRulePage(rulePage + 1)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition"
        >
          Next
        </button>
      </div>

    </div>
  )}
</div> 
    {isEditOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm p-6 flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-2xl rounded-3xl border border-gray-200 shadow-xl p-8 relative">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Edit Tax Code
      </h2>

      <form onSubmit={handleUpdate} className="space-y-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            HSN / SAC Code
          </label>
          <input
            type="text"
            name="hsnSacCode"
            value={editForm.hsnSacCode}
            onChange={handleEditChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tax Category
          </label>
          <select
            name="taxCategory"
            value={editForm.taxCategory}
            onChange={handleEditChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-100"
          >
            <option value="goods">Goods</option>
            <option value="service">Service</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            GST Rate
          </label>
          <select
            name="gstRateId"
            value={editForm.gstRateId}
            onChange={handleEditChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-100"
          >
            {gstSlabs.map((slab) => (
              <option key={slab.id} value={slab.id}>
                {slab.slabCode} - {slab.totalRate}%
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">Is Exempt</span>
            <input
              type="checkbox"
              name="isExempt"
              checked={editForm.isExempt}
              onChange={handleEditChange}
              className="accent-blue-600 w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">Is Zero Rated</span>
            <input
              type="checkbox"
              name="isZeroRated"
              checked={editForm.isZeroRated}
              onChange={handleEditChange}
              className="accent-blue-600 w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between col-span-2">
            <span className="text-sm font-medium">Is Active</span>
            <input
              type="checkbox"
              name="isActive"
              checked={editForm.isActive}
              onChange={handleEditChange}
              className="accent-blue-600 w-5 h-5"
            />
          </label>

        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={() => setIsEditOpen(false)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  </div>
)}
{isRuleEditOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

      <h2 className="text-xl font-semibold mb-6">
        Edit Tax Rule
      </h2>

      <form onSubmit={handleRuleUpdate} className="space-y-5">

        <input
          name="name"
          value={ruleEditForm.name}
          onChange={handleRuleEditChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Rule Name"
        />

        <select
          name="buyerType"
          value={ruleEditForm.buyerType}
          onChange={handleRuleEditChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All</option>
          <option value="b2b">B2B</option>
          <option value="b2c">B2C</option>
        </select>

        <input
          type="number"
          name="priority"
          value={ruleEditForm.priority}
          onChange={handleRuleEditChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          name="status"
          value={ruleEditForm.status}
          onChange={handleRuleEditChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
          {[
            "intraStateApplicable",
            "interStateApplicable",
            "exportApplicable",
            "sezApplicable",
            "reverseCharge",
            "blockIfComposition"
          ].map((field) => (
            <label key={field} className="flex justify-between">
              {field}
              <input
                type="checkbox"
                name={field}
                checked={ruleEditForm[field]}
                onChange={handleRuleEditChange}
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsRuleEditOpen(false)}
            className="px-4 py-2 bg-gray-100 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={ruleUpdating}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl"
          >
            {ruleUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}
  </div>
)
}

export default TaxSettings