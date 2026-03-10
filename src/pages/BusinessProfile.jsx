

import { useEffect, useState, useRef } from "react"
import { apiGet, apiPatch } from "../services/api"
import { Toast } from "primereact/toast"
import { ProgressSpinner } from "primereact/progressspinner"

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const toast = useRef(null)

  useEffect(() => {
    fetchBusiness()
  }, [])

  const fetchBusiness = async () => {
    try {
      const response = await apiGet("/seller/business/info")
      const raw = response.data?.data?.business

      if (!raw) {
        setBusiness(null)
        return
      }

      const mapped = {
        name: raw.displayName,
        legalName: raw.legalName,
        description: raw.description,
        branding: { logoUrl: raw.logoUrl },
        contact: { email: raw.email, phone: raw.phoneNumber },
        address: {
          line1: raw.addressLine1,
          line2: raw.addressLine2,
          city: raw.city,
          state: raw.state,
          postalCode: raw.pincode,
          country: raw.country,
        },
        tax: {
          isGstRegistered: raw.isGstRegistered,
          gstNumber: raw.gstNumber,
        },
      }

      setBusiness(mapped)

      setForm({
        legalName: raw.legalName || "",
        displayName: raw.displayName || "",
        description: raw.description || "",
        addressLine1: raw.addressLine1 || "",
        addressLine2: raw.addressLine2 || "",
        city: raw.city || "",
        state: raw.state || "",
        pincode: raw.pincode || "",
        country: raw.country || "",
        isGstRegistered: raw.isGstRegistered || false,
        gstNumber: raw.gstNumber || "",
        logoUrl: raw.logoUrl || "",
        email: raw.email || "",
        phoneNumber: raw.phoneNumber || "",
      })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleUpdate = async () => {
    const payload = { ...form }

    if (!payload.isGstRegistered) {
      payload.gstNumber = null
    }

    if (payload.isGstRegistered && !payload.gstNumber) {
      toast.current.show({
        severity: "error",
        summary: "GST number required",
      })
      return
    }

    try {
      setSaving(true)
      await apiPatch("/seller/business/update", payload)

      toast.current.show({
        severity: "success",
        summary: "Business Updated",
      })

      setEditMode(false)
      fetchBusiness()
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Update Failed",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <ProgressSpinner />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        No Business Data Found
      </div>
    )
  }


return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 md:px-8">
    <Toast ref={toast} />

    <div className="max-w-6xl mx-auto space-y-10">

      {/* ===== Premium Header Card ===== */}
      <div className="relative bg-white/90 backdrop-blur rounded-3xl border border-gray-200 shadow-lg p-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          <div className="flex items-center gap-6">

            {/* Logo */}
            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
              {business.branding?.logoUrl ? (
                <img
                  src={business.branding.logoUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-400">
                  {business.name?.charAt(0)}
                </span>
              )}
            </div>

            {/* Business Info */}
            <div className="space-y-2">

              <div className="flex items-center gap-4">

                {editMode ? (
                  <input
                    name="displayName"
                    value={form.displayName}
                    onChange={handleChange}
                    className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {business.name}
                  </h2>
                )}

                {/* Modern Floating Edit Button */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-8 h-8 flex items-center justify-center 
                             bg-blue-600 hover:bg-blue-700 text-white 
                             rounded-full text-xs 
                             shadow-md hover:shadow-lg 
                             transition-all duration-200"
                >
                  {editMode ? "✕" : "✎"}
                </button>

              </div>

              <p className="text-gray-500">
                {editMode ? (
                  <input
                    name="legalName"
                    value={form.legalName}
                    onChange={handleChange}
                    className="bg-transparent border-b border-gray-300 focus:outline-none"
                  />
                ) : business.legalName}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">

                <span className="px-4 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {business.address?.city}, {business.address?.state}
                </span>

                {business.tax?.isGstRegistered && (
                  <span className="px-4 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-100">
                    GST Registered
                  </span>
                )}

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ===== About Section ===== */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
          About Business
        </h3>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        ) : (
          <p className="text-gray-600 leading-relaxed">
            {business.description}
          </p>
        )}
      </div>

      {/* ===== Contact + Address ===== */}
      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Contact Information
          </h3>

          {editMode ? (
            <div className="space-y-4">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-3 text-gray-600">
              <p><span className="font-medium text-gray-800">Email:</span> {business.contact?.email}</p>
              <p><span className="font-medium text-gray-800">Phone:</span> {business.contact?.phone}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Business Address
          </h3>

          {editMode ? (
            <div className="space-y-3">
              {["addressLine1","addressLine2","city","state","pincode","country"].map(field => (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-gray-600">
              <p>{business.address?.line1}</p>
              {business.address?.line2 && <p>{business.address?.line2}</p>}
              <p>{business.address?.city}, {business.address?.state} - {business.address?.postalCode}</p>
              <p>{business.address?.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== GST Section ===== */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          GST Details
        </h3>

        {editMode ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isGstRegistered"
                checked={form.isGstRegistered}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              <label className="text-gray-700 font-medium">
                GST Registered
              </label>
            </div>

            {form.isGstRegistered && (
              <input
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
                placeholder="GST Number"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            )}

            <button
              onClick={handleUpdate}
              disabled={saving}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          business.tax?.isGstRegistered ? (
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">GST Number:</span> {business.tax?.gstNumber}
            </p>
          ) : (
            <p className="text-gray-400">Not GST Registered</p>
          )
        )}
      </div>

    </div>
  </div>
)
}

export default BusinessProfile