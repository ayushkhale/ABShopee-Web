import { useEffect, useState } from "react"
import { useBusiness } from "../context/BusinessContext"
import { useNavigate } from "react-router-dom"
import { apiGet, apiPost } from "../services/api"

const CreateTaxCode = () => {
  const { businessId } = useBusiness()
  const navigate = useNavigate()

  const [gstSlabs, setGstSlabs] = useState([])
  const [loadingSlabs, setLoadingSlabs] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    hsnSacCode: "",
    description: "",
    taxCategory: "goods",
    gstRateId: "",
    isExempt: false,
    isZeroRated: false
  })

  useEffect(() => {
    fetchGstSlabs()
  }, [])

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.hsnSacCode || !form.description || !form.gstRateId) {
      alert("Please fill all required fields")
      return
    }

    if (form.isExempt && form.isZeroRated) {
      alert("Exempt and Zero Rated cannot both be true")
      return
    }

    try {
      setSubmitting(true)

      await apiPost(
        `/tax/seller/business/${businessId}/tax/taxcode/create`,
        form
      )

      alert("Tax Code created successfully")
      navigate("/dashboard/tax")
    } catch (err) {
      console.error(err)
      alert("Failed to create tax code")
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
          Create Business Tax Code
        </h1>
        <p className="text-gray-500 mt-2">
          Add a new tax code for your business products or services
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* HSN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSN / SAC Code *
            </label>
            <input
              type="text"
              name="hsnSacCode"
              value={form.hsnSacCode}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter HSN or SAC code"
              className="w-full bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 rounded-xl outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter tax description"
              className="w-full bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 rounded-xl outline-none transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Category *
            </label>
            <select
              name="taxCategory"
              value={form.taxCategory}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 rounded-xl outline-none transition"
            >
              <option value="goods">Goods</option>
              <option value="service">Service</option>
            </select>
          </div>

          {/* GST Slab */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Rate *
            </label>
            <select
              name="gstRateId"
              value={form.gstRateId}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 rounded-xl outline-none transition"
            >
              <option value="">Select GST Slab</option>
              {gstSlabs.map((slab) => (
                <option key={slab.id} value={slab.id}>
                  {slab.slabCode} - {slab.totalRate}%
                </option>
              ))}
            </select>

            {loadingSlabs && (
              <p className="text-sm text-gray-400 mt-2">
                Loading GST slabs...
              </p>
            )}
          </div>

          {/* Toggles Section */}
          <div className="bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row gap-6">

            <label className="flex items-center justify-between w-full cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Is Exempt
              </span>
              <input
                type="checkbox"
                name="isExempt"
                checked={form.isExempt}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between w-full cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Is Zero Rated
              </span>
              <input
                type="checkbox"
                name="isZeroRated"
                checked={form.isZeroRated}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
            </label>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl shadow-md font-medium disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Tax Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)
}

export default CreateTaxCode