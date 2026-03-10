import { useState, useRef } from 'react';
import { apiPost } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useEffect } from 'react';
// PrimeReact
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

// Icons
import { 
    FaStore, FaIdCard, FaInfoCircle, FaPlus, FaTrash, 
    FaCheckCircle, FaRocket, FaShieldAlt, FaUsers, FaArrowRight
} from 'react-icons/fa';

const color = {
    primary: '#2196F3',
    secondary: '#0057ae',
    background: '#F5F5F5',
    text: '#212121',
};

const RegisterBusiness = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [loadingCountries, setLoadingCountries] = useState(false);
const [loadingStates, setLoadingStates] = useState(false);

 const [form, setForm] = useState({
  legalName: '',
  displayName: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  stateCode: '',
  country: 'India',
  pincode: '',
  isGstRegistered: false,
  gstNumber: '',
  email: '',
  phoneNumber: ''
});



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
useEffect(() => {
    const fetchCountries = async () => {
        try {
            setLoadingCountries(true);
            const res = await fetch('https://restcountries.com/v3.1/all?fields=name');
            const data = await res.json();

            const sorted = data
                .map(c => ({ label: c.name.common, value: c.name.common }))
                .sort((a, b) => a.label.localeCompare(b.label));

            const indiaFirst = sorted.sort((a, b) =>
                a.label === 'India' ? -1 : b.label === 'India' ? 1 : 0
            );

            setCountries(indiaFirst);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCountries(false);
        }
    };

    fetchCountries();
}, []);

useEffect(() => {
    const fetchStates = async () => {
        if (form.country !== 'India') {
            setStates([]);
            return;
        }

        try {
            setLoadingStates(true);
            const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: 'India' })
            });

            const data = await res.json();

            const formatted = data.data.states.map(s => ({
                label: s.name,
                value: s.name
            }));

            setStates(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStates(false);
        }
    };

    fetchStates();
}, [form.country]);

useEffect(() => {
    const fetchStateFromPincode = async () => {
        if (form.country !== 'India') return;
        if (form.pincode.length !== 6) return;

        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
            const data = await res.json();

            if (data[0].Status === 'Success') {
                const stateName = data[0].PostOffice[0].State;

                setForm(prev => ({
                    ...prev,
                    state: stateName
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    fetchStateFromPincode();
}, [form.pincode, form.country]);

const handleSubmit = async () => {

    if (!form.legalName.trim() || !form.displayName.trim()) {
        toast.current.show({
            severity: 'warn',
            summary: 'Required Fields',
            detail: 'Legal name and display name are required'
        });
        return;
    }

    if (form.isGstRegistered && !form.gstNumber) {
        toast.current.show({
            severity: 'warn',
            summary: 'GST Required',
            detail: 'Please enter GST number'
        });
        return;
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

    // if (form.isGstRegistered && !gstRegex.test(form.gstNumber)) {
    //     toast.current.show({
    //         severity: 'warn',
    //         summary: 'Invalid GST',
    //         detail: 'Please enter valid GST number'
    //     });
    //     return;
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (form.email && !emailRegex.test(form.email)) {
    //     toast.current.show({
    //         severity: 'warn',
    //         summary: 'Invalid Email',
    //         detail: 'Please enter valid email address'
    //     });
    //     return;
    // }
          
      // ye nya  code he upr vale ko replace kiya h 
      if (!form.gstNumber) {
    toast.current.show({
        severity: 'warn',
        summary: 'GST Required',
        detail: 'Please enter GST number'
    });
    return;
}

if (!gstRegex.test(form.gstNumber)) {
    toast.current.show({
        severity: 'warn',
        summary: 'Invalid GST',
        detail: 'Please enter valid GST number'
    });
    return;
}

    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    if (form.phoneNumber && !phoneRegex.test(form.phoneNumber)) {
        toast.current.show({
            severity: 'warn',
            summary: 'Invalid Phone',
            detail: 'Phone must be in E.164 format (+919000000000)'
        });
        return;
    }

    setLoading(true);

    try {

        await apiPost('/seller/business/register', {
            legalName: form.legalName.trim(),
            displayName: form.displayName.trim(),
            description: form.description || null,
            addressLine1: form.addressLine1 || null,
            addressLine2: form.addressLine2 || null,
            city: form.city || null,
            state: form.state || null,
            stateCode: form.stateCode || null,
            country: form.country || null,
            pincode: form.pincode || null,
            // isGstRegistered: form.isGstRegistered,
            //changes kiya h 
            isGstRegistered: true,
            // gstNumber: form.isGstRegistered ? form.gstNumber : null,
            gstNumber: form.gstNumber || null,
            email: form.email || null,
            phoneNumber: form.phoneNumber || null
        });

        toast.current.show({
            severity: 'success',
            summary: 'Business Registered!',
            detail: 'Redirecting to dashboard...'
        });

        setTimeout(() => {
            navigate('/dashboard');
        }, 1200);

    } catch (err) {

        if (err.response?.status === 409) {

            toast.current.show({
                severity: 'warn',
                summary: 'Business Already Exists',
                detail: 'You have already registered a business.'
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);

        } else if (err.response?.status === 401) {

            toast.current.show({
                severity: 'error',
                summary: 'Unauthorized',
                detail: 'Please login again.'
            });

        } else {

            toast.current.show({
                severity: 'error',
                summary: 'Registration Failed',
                detail: err.response?.data?.message || 'Something went wrong'
            });

        }

    } finally {
        setLoading(false);
    }
};

    // ── Success State ──
    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto animate-fade-in">
                <Toast ref={toast} />
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                        <FaCheckCircle className="text-5xl" style={{ color: color.primary }} />
                    </div>
                    <h2 className="text-3xl font-black mb-3" style={{ color: color.text }}>
                        Store is Live! 🎉
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        <span className="font-bold" style={{ color: color.primary }}>{form.displayName}</span> has been successfully registered.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                        style={{ backgroundColor: color.primary }}
                    >
                        Register Another Business <FaArrowRight />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-16">
            <Toast ref={toast} />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1" style={{ color: color.text }}>
                    Register Business
                </h1>
                <p className="text-gray-500 text-sm">
                    Create your e-commerce storefront and start selling today
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left — Info Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">

                        {/* What you get */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: color.primary }}>
                                    <FaRocket />
                                </div>
                                <h3 className="font-bold text-sm" style={{ color: color.text }}>
                                    What You Get
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: <FaStore />, title: 'Your Own Storefront', desc: 'Custom branded store URL' },
                                    { icon: <FaShieldAlt />, title: 'Secure Payments', desc: 'Razorpay & Stripe ready' },
                                    { icon: <FaUsers />, title: 'Customer Access', desc: 'Reach 2M+ buyers instantly' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: color.text }}>{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: color.secondary }}>
                                    <FaInfoCircle />
                                </div>
                                <h3 className="font-bold text-sm" style={{ color: color.text }}>Quick Tips</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Use your registered company name as Legal Name',
                                    'Display Name is what customers will see',
                                    'A good description improves trust',
'Complete all details for better approval rate',
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color.primary }}></div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress preview */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Form Progress</p>
                            <div className="space-y-2">
                                {[
                               
 { label: 'Legal Name', filled: !!form.legalName, required: true },
 { label: 'Display Name', filled: !!form.displayName, required: true },
 { label: 'Contact', filled: !!form.email || !!form.phoneNumber, required: false },
 { label: 'Address', filled: !!form.addressLine1, required: false },
//  { label: 'GST', filled: form.isGstRegistered ? !!form.gstNumber : true, required: false },
//changes kiya he 
{ label: 'GST', filled: !!form.gstNumber, required: true },
{ label: 'Description', filled: !!form.description, required: false },
//  { label: 'Metadata', filled: metadata.some(m => m.key), required: false },

                                ].map((field, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${field.filled ? '' : 'bg-gray-200'}`}
                                                style={field.filled ? { backgroundColor: color.primary } : {}}
                                            >
                                                {field.filled && <FaCheckCircle className="text-white text-[8px]" />}
                                            </div>
                                            <span className="text-xs text-gray-600">{field.label}</span>
                                        </div>
                                        {field.required && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                                Required
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right — Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Form Header */}
                        <div className="px-8 py-6 border-b border-gray-100" style={{ backgroundColor: color.background }}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color.primary }}>
                                    <FaStore className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg" style={{ color: color.text }}>Store Details</h2>
                                    <p className="text-xs text-gray-500">Fill in your business information below</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-7">

                         
<div>
    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
            <FaIdCard className="text-[10px]" />
        </div>
        Legal Business Name
        <span className="text-red-500">*</span>
    </label>

    <InputText
        name="legalName"
        value={form.legalName}
        onChange={handleChange}
        placeholder="e.g. ABC Pvt Ltd"
        maxLength={255}
        className="w-full !py-4 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#2196F3] focus:!ring-2 focus:!ring-[#2196F3]/20 !text-sm"
    />

    <p className="text-xs text-gray-400 mt-2">
        Enter your company’s registered legal name
    </p>
</div>

                            {/* Display Name */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                        <FaStore className="text-[10px]" />
                                    </div>
                                    Store Display Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    name="displayName"
                                    value={form.displayName}
                                    onChange={handleChange}
                                    placeholder="e.g. TechElite Store"
                                    className="w-full !py-4 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#2196F3] focus:!ring-2 focus:!ring-[#2196F3]/20 !text-sm"
                                />
                                <p className="text-xs text-gray-400 mt-2">This is what customers will see on your storefront</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
                                        <FaInfoCircle className="text-[10px]" />
                                    </div>
                                    Store Description
                                    <span className="text-[10px] font-semibold text-gray-400 normal-case ml-1 tracking-normal">(Optional)</span>
                                </label>
                                <InputTextarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell customers what you sell and what makes your store special..."
                                    className="w-full !py-4 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 focus:!border-[#2196F3] focus:!ring-2 focus:!ring-[#2196F3]/20 !text-sm"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-400">A good description builds customer trust</p>
                                    <span className="text-xs text-gray-400">{form.description.length}/500</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100" />
{/* Business Contact */}
<div>
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 block">
        Business Contact
    </label>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Business Email"
            className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
        />

        <InputText
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone (+919876543210)"
            className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
        />
    </div>
</div>
                    {/* Business Address */}
<div>
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 block">
        Business Address
    </label>

    <div className="space-y-4">

        <InputText
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
        />

        <InputText
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
            className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputText
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
            />

            {form.country === 'India' ? (
    <Dropdown
        value={form.state}
        options={states}
        onChange={(e) =>
            setForm({
                ...form,
                state: e.value,
                stateCode: ''
            })
        }
        placeholder="Select State"
        loading={loadingStates}
        className="w-full !rounded-2xl"
    />
) : (
    <InputText
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full !rounded-2xl"
    />
)}

            {/* <InputText
                name="stateCode"
                value={form.stateCode}
                onChange={(e) =>
                    setForm({ ...form, stateCode: e.target.value.toUpperCase() })
                }
                placeholder="State Code (According To GST Number)"
                maxLength={2}
                className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
            /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
            />

         
            <Dropdown
    value={form.country}
    options={countries}
    onChange={(e) =>
        setForm({
            ...form,
            country: e.value,
            state: '',
            stateCode: ''
        })
    }
    placeholder="Select Country"
    loading={loadingCountries}
    className="w-full !rounded-2xl"
/>
        </div>
    </div>
</div>
{/* GST Section */}
{/* <div>
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 block">
        Tax Details
    </label>

    <div className="flex items-center gap-3 mb-4">
        <input
            type="checkbox"
            checked={form.isGstRegistered}
            onChange={(e) =>
                setForm({ ...form, isGstRegistered: e.target.checked })
            }
        />
        <span className="text-sm text-gray-600">I am GST Registered</span>
    </div>

    {form.isGstRegistered && (
        <InputText
            name="gstNumber"
            value={form.gstNumber}
            onChange={(e) =>
                setForm({ ...form, gstNumber: e.target.value.toUpperCase() })
            }
            placeholder="GST Number"
            className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
        />
    )}
</div> */}
   {/* upr vale ko changes kiya  */}

<div>
    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 block">
        Tax Details
        <span className="text-red-500">*</span>
    </label>

    <InputText
        name="gstNumber"
        value={form.gstNumber}
        onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setForm({
                ...form,
                gstNumber: val,
                stateCode: val.length >= 2 ? val.substring(0, 2) : ''
            });
        }}
        placeholder="GST Number (e.g. 29ABCDE1234F1Z5)"
        className="w-full !py-3.5 !px-4 !rounded-2xl !bg-gray-50 !border !border-gray-200 !text-sm"
    />
    <p className="text-xs text-gray-400 mt-2">State code will be auto-detected from GST number</p>
</div>

                            {/* Submit */}
                            <div className="pt-2">
                                <button
                                    onClick={handleSubmit}
                                    // disabled={loading || !form.legalName || !form.displayName}
                                   //changes kiya he 
                                   disabled={loading || !form.legalName || !form.displayName || !form.gstNumber}
                                    className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 disabled:scale-100"
                                    style={{ backgroundColor: color.primary }}
                                >
                                    {loading ? (
                                        <>
                                            <i className="pi pi-spin pi-spinner" />
                                            Registering Business...
                                        </>
                                    ) : (
                                        <>
                                            <FaStore />
                                            Register My Business
                                            <FaArrowRight className="text-xs" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    By registering, you agree to our{' '}
                                    <span className="underline cursor-pointer font-semibold" style={{ color: color.primary }}>Terms of Service</span>
                                    {' '}&amp;{' '}
                                    <span className="underline cursor-pointer font-semibold" style={{ color: color.primary }}>Privacy Policy</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterBusiness;
