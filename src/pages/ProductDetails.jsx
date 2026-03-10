// // import { useState, useEffect, useRef } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { apiGet, apiPost , apiDelete  } from "../services/api";
// // import { useBusiness } from "../context/BusinessContext";
// // import { apiPatch } from "../services/api";

// // // PrimeReact & Icons
// // import { Button } from "primereact/button";
// // import { Toast } from "primereact/toast";
// // import { Skeleton } from "primereact/skeleton";
// // import { InputText } from "primereact/inputtext";
// // import { InputTextarea } from "primereact/inputtextarea";
// // import {
// //   FaCheck,
// //   FaImages,
// //   FaTimes,
// //   FaSave,
// //   FaPen,
// //   FaPlus,
// //   FaTrash,
// //   FaBoxOpen,
// //   FaShieldAlt,
// //   FaList,
// //   FaArrowLeft,
// //   FaMemory,
// //   FaMicrochip,
// //   FaCogs,
// //   FaStar,
// // } from "react-icons/fa";

// // const ProductDetails = () => {
// //   const { id } = useParams();
// //   const { businessId } = useBusiness();
// //   const navigate = useNavigate();
// //   const toast = useRef(null);

// //   // --- State ---
// //   const [product, setProduct] = useState(null);
// //   const [originalProduct, setOriginalProduct] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [editMode, setEditMode] = useState(false);
// //   const [activeTab, setActiveTab] = useState("specifications");
// //   const [activeImage, setActiveImage] = useState(0);
// //   const [changes, setChanges] = useState({
// //     basic: new Set(),
// //     attributes: new Set(),
// //   });
// //   const [mediaList, setMediaList] = useState([]);
// // const [selectedMediaIds, setSelectedMediaIds] = useState(new Set());
// // const [deleting, setDeleting] = useState(false);


// //   // --- 1. Load & Normalize Data ---
// //   useEffect(() => {
// //     if (businessId && id) fetchProduct();
// //   }, [businessId, id]);

// //   const fetchProduct = async () => {
// //     try {
// //       const response = await apiGet(
// //         `/seller/business/${businessId}/products/${id}`,
// //       );
// //       if (response.data.success) {
// //         const data = response.data.data;
// //         data.attributes = normalizeAttributes(data.attributes);
// //         setProduct(data);
// //         setOriginalProduct(JSON.parse(JSON.stringify(data)));
// //         setMediaList(data.media || []);
// // setSelectedMediaIds(new Set());

// //       }
// //     } catch (error) {
// //       console.error(error);
// //       toast.current?.show({
// //         severity: "error",
// //         summary: "Error",
// //         detail: "Failed to load product",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// // //   const deleteMedia = async (mediaIds = []) => {

// // //   if (mediaIds.length === 0) return;

// // //   if (!confirm(`Delete ${mediaIds.length} media file(s)?`)) return;

// // //   try {
// // //     setDeleting(true);

// // //    await apiDelete(
// // //   `/seller/business/${businessId}/items/${id}/media`,
// // //   { data: { mediaIds } }
// // // );


// // //     // optimistic UI
// // //     // setMediaList(prev =>
// // //     //   prev.filter(m => !mediaIds.includes(m.id))
// // //     // );

// // //     // setSelectedMediaIds(new Set());

// // //     // optimistic UI
// // // setMediaList(prev =>
// // //   prev.filter(m => !mediaIds.includes(m.id))
// // // );

// // // setActiveImage(prev => {
// // //   const remaining = mediaList.length - mediaIds.length;
// // //   if (remaining <= 0) return 0;
// // //   return prev >= remaining ? 0 : prev;
// // // });

// // // setSelectedMediaIds(new Set());


// // //     toast.current.show({
// // //       severity: "success",
// // //       summary: "Deleted",
// // //       detail: "Media deleted successfully",
// // //     });
// // //   } catch (err) {
// // //     console.error(err);
// // //     toast.current.show({
// // //       severity: "error",
// // //       summary: "Error",
// // //       detail:
// // //         err?.response?.data?.message ||
// // //         "Failed to delete media",
// // //     });
// // //   } finally {
// // //     setDeleting(false);
// // //   }
// // // };

// // const deleteMedia = async (mediaIds = []) => {
// //   if (mediaIds.length === 0) return;

// //   if (!confirm(`Delete ${mediaIds.length} media file(s)?`)) return;

// //   try {
// //     setDeleting(true);

// //     await apiDelete(
// //       `/seller/business/${businessId}/items/${id}/media`,
// //       { mediaIds }
// //     );

// //     // optimistic UI
// //     setMediaList(prev =>
// //       prev.filter(m => !mediaIds.includes(m.id))
// //     );

// //     setActiveImage(prev => {
// //       const remaining = mediaList.length - mediaIds.length;
// //       if (remaining <= 0) return 0;
// //       return prev >= remaining ? 0 : prev;
// //     });

// //     setSelectedMediaIds(new Set());

// //     toast.current.show({
// //       severity: "success",
// //       summary: "Deleted",
// //       detail: "Media deleted successfully",
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     toast.current.show({
// //       severity: "error",
// //       summary: "Error",
// //       detail:
// //         err?.response?.data?.message ||
// //         "Failed to delete media",
// //     });
// //   } finally {
// //     setDeleting(false);
// //   }
// // };

// //   const normalizeAttributes = (attrs = {}) => {
// //     const normalized = {};
// //     for (const [key, val] of Object.entries(attrs)) {
// //       normalized[key] = {
// //         ...val,
// //         value: val.value,
// //         attributeDefinitionId:
// //           val.attributeDefinitionId || val.definitionId || null,
// //         source: val.source || val.sourceType || "custom",
// //       };
// //     }
// //     return normalized;
// //   };

// //   // --- 2. Edit Logic ---
// //   const updateBasicField = (field, value) => {
// //     setProduct((prev) => ({ ...prev, [field]: value }));
// //     setChanges((prev) => ({ ...prev, basic: prev.basic.add(field) }));
// //   };

// //   const updateAttributeValue = (attrKey, newVal) => {
// //     setProduct((prev) => ({
// //       ...prev,
// //       attributes: {
// //         ...prev.attributes,
// //         [attrKey]: { ...prev.attributes[attrKey], value: newVal },
// //       },
// //     }));
// //     setChanges((prev) => ({
// //       ...prev,
// //       attributes: prev.attributes.add(attrKey),
// //     }));
// //   };

// //   // --- 3. Dynamic Editors ---
// //   const renderObjectEditor = (attrKey, data) => {
// //     if (!data || typeof data !== "object") return null;
// //     return (
// //       <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
// //         {Object.entries(data).map(([key, val], idx) => (
// //           <div key={idx} className="flex gap-3 items-center group">
// //             <div className="w-1/3 text-xs font-bold text-gray-500 uppercase tracking-wider">
// //               {key}
// //             </div>
// //             <InputText
// //               value={val}
// //               onChange={(e) => {
// //                 const newData = { ...data, [key]: e.target.value };
// //                 updateAttributeValue(attrKey, newData);
// //               }}
// //               className="flex-1 !py-2 !px-3 !text-sm !rounded-lg !border-gray-200 focus:!border-[#1a1a2e] focus:!ring-0 transition-all"
// //             />
// //             <button
// //               onClick={() => {
// //                 const newData = { ...data };
// //                 delete newData[key];
// //                 updateAttributeValue(attrKey, newData);
// //               }}
// //               className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
// //             >
// //               <FaTrash />
// //             </button>
// //           </div>
// //         ))}
// //         <Button
// //           label="Add Field"
// //           icon={<FaPlus className="mr-2 text-[10px]" />}
// //           className="!bg-white !text-[#1a1a2e] !border border-gray-200 !px-3 !py-1.5 !text-xs !rounded-lg hover:!bg-gray-50 !shadow-sm"
// //           onClick={() => {
// //             const key = prompt("Enter new field name:");
// //             if (key) {
// //               const newData = { ...data, [key]: "" };
// //               updateAttributeValue(attrKey, newData);
// //             }
// //           }}
// //         />
// //       </div>
// //     );
// //   };

// //   const renderArrayEditor = (attrKey, arrayData) => {
// //     const list = Array.isArray(arrayData) ? arrayData : [];
// //     return (
// //       <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
// //         {list.map((item, idx) => (
// //           <div key={idx} className="flex gap-2 items-center group">
// //             <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[10px] font-bold text-gray-400 border border-gray-200">
// //               {idx + 1}
// //             </span>
// //             <InputTextarea
// //               value={item}
// //               onChange={(e) => {
// //                 const newList = [...list];
// //                 newList[idx] = e.target.value;
// //                 updateAttributeValue(attrKey, newList);
// //               }}
// //               rows={1}
// //               autoResize
// //               className="flex-1 !py-2 !px-3 !text-sm !rounded-lg !border-gray-200 focus:!border-[#1a1a2e] focus:!ring-0"
// //             />
// //             <button
// //               onClick={() =>
// //                 updateAttributeValue(
// //                   attrKey,
// //                   list.filter((_, i) => i !== idx),
// //                 )
// //               }
// //               className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"
// //             >
// //               <FaTimes />
// //             </button>
// //           </div>
// //         ))}
// //         <Button
// //           label="Add Item"
// //           icon={<FaPlus className="mr-2 text-[10px]" />}
// //           className="!bg-white !text-[#1a1a2e] !border border-gray-200 !px-3 !py-1.5 !text-xs !rounded-lg hover:!bg-gray-50 !shadow-sm"
// //           onClick={() => updateAttributeValue(attrKey, [...list, ""])}
// //         />
// //       </div>
// //     );
// //   };

  
// //   const renderSpecTable = (icon, title, data) => {
// //   if (!data || typeof data !== "object") return null;

// //   return (
// //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
// //       <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
// //         <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#1a1a2e] shadow-sm">
// //           {icon}
// //         </div>
// //         <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide">
// //           {title}
// //         </h3>
// //       </div>

// //       <div className="divide-y divide-gray-50">
// //         {Object.entries(data).map(([k, v], i) => (
// //           <div
// //             key={i}
// //             className="flex px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
// //           >
// //             <div className="w-1/3 text-sm font-medium text-gray-500">{k}</div>
// //             <div className="w-2/3 text-sm font-semibold text-[#1a1a2e]">
// //               {String(v)}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };


// //   const renderFeatureList = (icon, title, list) => (
// //     <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden">
// //       <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
// //       <div className="flex items-center gap-3 mb-6 relative z-10">
// //         <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#daa520] backdrop-blur-sm border border-white/10">
// //           {icon}
// //         </div>
// //         <h3 className="font-bold text-lg">{title}</h3>
// //       </div>
// //       <ul className="space-y-3 relative z-10">
// //         {list.map((item, i) => (
// //           <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
// //             <FaCheck className="text-[#daa520] mt-1 flex-shrink-0 text-xs" />
// //             <span className="leading-relaxed">{item}</span>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );

// // const handleSaveChanges = async () => {
// //   if (changes.basic.size === 0 && changes.attributes.size === 0) return;

// //   try {
// //     const payload = {};

// //     /* ---------------- ITEM ---------------- */
// //     if (changes.basic.size > 0) {
// //       const item = {};

// //       if (changes.basic.has("title")) {
// //         item.title = product.title;
// //       }

// //       if (changes.basic.has("description")) {
// //         item.description = product.description;
// //       }

// //       if (changes.basic.has("status")) {
// //         item.status = product.status || "active";
// //       }

// //       if (changes.basic.has("visibility")) {
// //         item.visibility = product.visibility || "public";
// //       }

// //       if (Object.keys(item).length > 0) {
// //         payload.item = item;
// //       }
// //     }

// //     /* ---------------- PRICE ---------------- */
// //     if (changes.basic.has("price")) {
// //       payload.price = {
// //         currency: product.prices?.[0]?.currency || "INR",
// //         amount: product.prices?.[0]?.amount || 0,
// //       };
// //     }

// //     /* ---------------- INVENTORY ---------------- */
// //     if (changes.basic.has("inventory")) {
// //       payload.inventory = {
// //         quantityAvailable:
// //           product.inventories?.[0]?.quantityAvailable ?? 0,
// //         status:
// //           product.inventories?.[0]?.quantityAvailable > 0
// //             ? "available"
// //             : "out_of_stock",
// //       };
// //     }

// //     /* ---------------- ATTRIBUTES (OPTIONAL) ---------------- */
// //     if (changes.attributes.size > 0) {
// //       payload.attributes = [];

// //       changes.attributes.forEach((key) => {
// //         const attr = product.attributes[key];
// //         if (!attr) return;

// //         payload.attributes.push({
// //           attributeDefinitionId: attr.attributeDefinitionId,
// //           sourceType: attr.source || "custom",
// //           value: attr.value,
// //         });
// //       });
// //     }

// //     // ❗️ nothing to send
// //     if (Object.keys(payload).length === 0) return;

// //     /* ---------------- API CALL ---------------- */
// //     await apiPatch(
// //       `/seller/business/${businessId}/items/${id}`,
// //       payload
// //     );

// //     toast.current.show({
// //       severity: "success",
// //       summary: "Saved",
// //       detail: "Product updated successfully",
// //     });

// //     setEditMode(false);
// //     setChanges({ basic: new Set(), attributes: new Set() });
// //     fetchProduct();
// //   } catch (err) {
// //     console.error(err);
// //     toast.current.show({
// //       severity: "error",
// //       summary: "Error",
// //       detail:
// //         err?.response?.data?.message ||
// //         "Failed to update product",
// //     });
// //   }
// // };


// // useEffect(() => {
// //   window.scrollTo({ top: 0, behavior: "instant" });
// // }, [id]);


// //   const handleCancel = () => {
// //     if (
// //       (changes.basic.size > 0 || changes.attributes.size > 0) &&
// //       !confirm("Discard unsaved changes?")
// //     )
// //       return;
// //     setProduct(JSON.parse(JSON.stringify(originalProduct)));
// //     setChanges({ basic: new Set(), attributes: new Set() });
// //     setEditMode(false);
// //   };

// //   // --- 6. Main Render ---
// //   if (loading)
// //     return (
// //       <div className="p-8 max-w-7xl mx-auto">
// //         <div className="grid grid-cols-12 gap-8">
// //           <div className="col-span-5">
// //             <Skeleton height="500px" className="rounded-3xl" />
// //           </div>
// //           <div className="col-span-7 space-y-4">
// //             <Skeleton height="40px" width="60%" />
// //             <Skeleton height="20px" width="40%" />
// //             <Skeleton height="200px" />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   if (!product)
// //     return (
// //       <div className="p-20 text-center">
// //         <div className="text-6xl mb-4">📦</div>
// //         <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
// //       </div>
// //     );

// //   // const media = product.media || [];
// //   const stockQty = product.inventories?.[0]?.quantityAvailable || 0;
// //   const price = product.prices?.[0] || { amount: 0, currency: "INR" };
// //   const attributes = product.attributes || {};

// //   return (
// //     // <div className="animate-fade-in relative pb-32">
// // <div className="animate-fade-in relative">

// //     <Toast ref={toast} />

// //       {/* --- Top Navigation Bar --- */}
// //       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center mb-8 shadow-sm">
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1a1a2e] transition-colors group"
// //         >
// //           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#1a1a2e] group-hover:text-white transition-all">
// //             <FaArrowLeft className="text-xs" />
// //           </div>
// //           Back to Dashboard
// //         </button>

// //         {/* <div className="flex gap-2">
// //           <Button
// //   icon={<FaPen />}
// //   label={editMode ? "Editing" : "Edit Product"}
// //   className="!bg-[#1a1a2e] !text-white !px-5 !py-2 !rounded-xl !font-bold"
// //   onClick={() => setEditMode(true)}
// // />

// //           <Button
// //             label="Media"
// //             icon={<FaImages className="mr-2" />}
// //             className="!bg-pink-50 !text-pink-700 !border-pink-100 hover:!bg-pink-100 !px-4 !py-2 !rounded-xl !font-bold !text-sm"
// //             onClick={() => navigate(`/product/${id}/media`)}
// //           />
// //           <Button
// //             label="Manage Attributes"
// //             icon={<FaList className="mr-2" />}
// //             className="!bg-white !text-[#1a1a2e] !border-gray-200 !shadow-sm hover:!bg-gray-50 !px-5 !py-2.5 !rounded-xl !font-bold !text-sm"
// //             onClick={() => navigate(`/product/${id}/attributes`)}
// //           />
// //         </div> */}
// //             <div className="flex gap-2">
// //           <Button
// //             icon={<FaPen />}
// //             label={editMode ? "Editing" : "Edit"}
// //             className="!bg-slate-900 !border-slate-900 !rounded-xl !px-5"
// //             onClick={() => setEditMode(true)}
// //           />
// //           <Button
// //             icon={<FaImages />}
// //             label="Media"
// //             className="!bg-slate-100 !text-slate-800 !rounded-xl"
// //             onClick={() => navigate(`/product/${id}/media`)}
// //           />
// //           <Button
// //             icon={<FaList />}
// //             label="Attributes"
// //             className=" !border-slate-200 !rounded-xl"
// //             onClick={() => navigate(`/product/${id}/attributes`)}
// //           />
// //         </div>
// //       </div>

// // <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-12"> */}
// // <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

// //           {/* --- Left Column: Visuals (Sticky) --- */}
// //           <div className="lg:col-span-5 space-y-6">
// // <div className="lg:sticky lg:top-28">
// //               {/* Main Image Stage */}
// //               <div className="aspect-square md:aspect-[4/3] bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 flex items-center justify-center p-10 md:p-10 relative overflow-hidden group">
// //                 <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
// //                 {/* {media.length > 0 ? (
// //                   <img
// //                     src={media[activeImage].url}
// //                     alt={product.title}
// //                     className="w-full h-full object-contain mix-blend-multiply relative z-10 transition-transform duration-500 group-hover:scale-105"
// //                   />
// //                 ) : ( */}
// //                 {mediaList.length > 0 ? (
// //   <img
// //     src={mediaList[activeImage]?.url}
// //     alt={product.title}
// //     className="w-full h-full object-contain mix-blend-multiply relative z-10"
// //   />
// // ) : (

// //                   <FaBoxOpen className="text-8xl text-gray-200 relative z-10" />
// //                 )}

// //                 {/* Status Tags */}
// //                 <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
// //                   <span
// //                     className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${stockQty > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
// //                   >
// //                     {stockQty > 0 ? "In Stock" : "Out of Stock"}
// //                   </span>
// //                   {attributes.brand && (
// //                     <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1a1a2e] text-white shadow-lg">
// //                       {attributes.brand.value}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //               {selectedMediaIds.size > 0 && (
// //   <div className="flex items-center justify-between mb-4 px-2">
// //     <span className="text-sm font-bold text-red-600">
// //       {selectedMediaIds.size} selected
// //     </span>

// //     <Button
// //       label={deleting ? "Deleting..." : "Delete Selected"}
// //       icon={<FaTrash className="mr-2" />}
// //       disabled={deleting}
// //       className="!bg-red-600 !border-red-600 !text-white !px-4 !py-2 !rounded-xl !text-sm"
// //       onClick={() =>
// //         deleteMedia(Array.from(selectedMediaIds))
// //       }
// //     />
// //   </div>
// // )}


// //               {/* Thumbnails */}
// // {mediaList.length > 1 && (
// //                 <div className="flex gap-4 mt-10 overflow-x-auto pb-4 px-2">
// //                   {/* {media.map((m, i) => (
// //                     <div
// //                       key={i}
// //                       onClick={() => setActiveImage(i)}
// //                       className={`w-20 h-20 flex-shrink-0 rounded-2xl border-2 cursor-pointer p-2 flex items-center justify-center bg-white transition-all shadow-sm ${activeImage === i ? "border-[#1a1a2e] ring-2 ring-[#1a1a2e]/10 scale-105" : "border-transparent hover:border-gray-200"}`}
// //                     >
// //                       <img
// //                         src={m.url}
// //                         className="w-full h-full object-contain"
// //                       />
// //                     </div>
// //                   ))} */}
// //                   {mediaList.map((m, i) => {
// //   const isSelected = selectedMediaIds.has(m.id);

// //   return (
// //     <div
// //       key={m.id}
// //       className={`relative w-20 h-20 rounded-2xl border-2 p-2 bg-white cursor-pointer
// //         ${activeImage === i ? "border-[#1a1a2e]" : "border-gray-200"}
// //         ${isSelected ? "ring-2 ring-red-400" : ""}`}
// //     >
// //       {/* checkbox */}
// //       <input
// //         type="checkbox"
// //         checked={isSelected}
// //         onChange={(e) => {
// //           setSelectedMediaIds(prev => {
// //             const next = new Set(prev);
// //             e.target.checked ? next.add(m.id) : next.delete(m.id);
// //             return next;
// //           });
// //         }}
// //         className="absolute top-1 left-1 z-20"
// //       />

// //       {/* single delete */}
// //       <button
// //         onClick={() => deleteMedia([m.id])}
// //         className="absolute top-1 right-1 z-20 bg-white text-red-500 rounded-full p-1 shadow hover:scale-110"
// //         title="Delete image"
// //       >
// //         <FaTrash size={10} />
// //       </button>

// //       <img
// //         src={m.url}
// //         onClick={() => setActiveImage(i)}
// //         className="w-full h-full object-contain"
// //       />
// //     </div>
// //   );
// // })}

// //                 </div>
                
// //               )}
// //             </div>
// //           </div>

// //           {/* --- Right Column: Details --- */}
// //           <div className="lg:col-span-7">
// //             {/* Title & Price Header */}
// //             <div className="mb-10">
// //               <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
// //                 <span className="bg-gray-100 px-3 py-1 rounded-lg">
// //                   {product.itemType}
// //                 </span>
// //                 <span>•</span>
// //                 <span>ID: {id.slice(0, 8)}</span>
// //               </div>

// //               {editMode ? (
// //                 <InputText
// //                   value={product.title}
// //                   onChange={(e) => updateBasicField("title", e.target.value)}
// //                   className="text-4xl font-black w-full !p-4 !bg-gray-50 !border-dashed !border-2 !border-gray-300 focus:!border-[#1a1a2e] rounded-xl mb-4"
// //                 />
// //               ) : (
// //                 <h1 className="text-4xl md:text-5xl font-black text-[#1a1a2e] font-playfair leading-[1.1] mb-6 drop-shadow-sm">
// //                   {product.title}
// //                 </h1>
// //               )}

// //               <div className="flex items-end gap-6 pb-8 border-b border-gray-100">
              
// // <InputText
// //   type="number"
// //   value={price.amount}
// //   onChange={(e) => {
// //     const newPrice = {
// //       ...price,
// //       amount: Number(e.target.value),
// //     };

// //     setProduct((prev) => ({
// //       ...prev,
// //       prices: [newPrice],
// //     }));

// //     setChanges((prev) => ({
// //       ...prev,
// //       basic: new Set(prev.basic).add("price"),
// //     }));
// //   }}
// //   className="!text-4xl !font-black !w-40 !border-dashed !border-2 !border-gray-300 focus:!border-[#1a1a2e]"
// // />


// //                 <div className="h-12 w-px bg-gray-200 mx-2"></div>
      
// // <InputText
// //   type="number"
// //   value={stockQty}
// //   onChange={(e) => {
// //     const newInventory = {
// //       ...(product.inventories?.[0] || {}),
// //       quantityAvailable: Number(e.target.value),
// //     };

// //     setProduct((prev) => ({
// //       ...prev,
// //       inventories: [newInventory],
// //     }));

// //     setChanges((prev) => ({
// //       ...prev,
// //       basic: new Set(prev.basic).add("inventory"),
// //     }));
// //   }}
// //   className="!text-2xl !font-bold !w-28"
// // />

// //               </div>
// //             </div>

// //             {/* Custom Tabs */}
// //             <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl mb-8 w-fit">
// //               {["specifications", "description", "warranty"].map((tab) => (
// //                 <button
// //                   key={tab}
// //                   onClick={() => setActiveTab(tab)}
// //                   className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab ? "bg-white text-[#1a1a2e] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
// //                 >
// //                   {tab}
// //                 </button>
// //               ))}
// //             </div>

// //             {/* Tab Content Area */}
// // <div className="space-y-6">
// //               {/* 1. Specifications */}
// //               {activeTab === "specifications" && (
// //                 <div className="grid grid-cols-1 gap-6 animate-fade-in">
// //                   {attributes["processor-and-memory-features"] &&
// //                     (editMode
// //                       ? renderObjectEditor(
// //                           "processor-and-memory-features",
// //                           attributes["processor-and-memory-features"].value,
// //                         )
// //                       : renderSpecTable(
// //                           <FaMicrochip />,
// //                           "Processor & Memory",
// //                           attributes["processor-and-memory-features"].value,
// //                         ))}

// //                   {attributes["general"] &&
// //                     (editMode
// //                       ? renderObjectEditor(
// //                           "general",
// //                           attributes["general"].value,
// //                         )
// //                       : renderSpecTable(
// //                           <FaCogs />,
// //                           "General Specs",
// //                           attributes["general"].value,
// //                         ))}

// //                   {attributes["specialization"] &&
// //                     (editMode
// //                       ? renderArrayEditor(
// //                           "specialization",
// //                           attributes["specialization"].value,
// //                         )
// //                       : renderFeatureList(
// //                           <FaStar />,
// //                           "Key Highlights",
// //                           attributes["specialization"].value || [],
// //                         ))}
// //                 </div>
// //               )}

// //               {/* 2. Description */}
// //               {activeTab === "description" && (
// //                 <div
// //                   className={`animate-fade-in p-8 rounded-[24px] ${editMode ? "bg-blue-50/50 border border-blue-200 border-dashed" : "bg-white border border-gray-100 shadow-sm"}`}
// //                 >
// //                   <h3 className="font-bold text-[#1a1a2e] text-lg mb-6 flex items-center gap-3">
// //                     <div className="w-1 h-6 bg-[#daa520] rounded-full"></div>{" "}
// //                     Product Story
// //                   </h3>
// //                   {editMode ? (
// //                     <InputTextarea
// //                       value={product.description || ""}
// //                       onChange={(e) =>
// //                         updateBasicField("description", e.target.value)
// //                       }
// //                       rows={10}
// //                       className="w-full !p-5 !rounded-xl !border-gray-300 !text-base !leading-relaxed focus:!border-[#1a1a2e] focus:!ring-0"
// //                     />
// //                   ) : (
// //                     <p className="text-gray-600 leading-loose text-lg whitespace-pre-line font-serif">
// //                       {product.description ||
// //                         "No description available for this product."}
// //                     </p>
// //                   )}
// //                 </div>
// //               )}

// //               {/* 3. Warranty */}
// //               {activeTab === "warranty" && (
// //                 <div className="animate-fade-in bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
// //                   <div className="flex items-center gap-4 mb-8">
// //                     <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl shadow-sm">
// //                       <FaShieldAlt />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-bold text-[#1a1a2e] text-xl">
// //                         Warranty & Support
// //                       </h3>
// //                       <p className="text-sm text-gray-500">
// //                         Official manufacturer coverage
// //                       </p>
// //                     </div>
// //                   </div>
// //                   {attributes.warranty ? (
// //                     editMode ? (
// //                       renderObjectEditor("warranty", attributes.warranty.value)
// //                     ) : (
// //                       renderSpecTable(
// //                         <FaShieldAlt />,
// //                         "Coverage Details",
// //                         attributes.warranty.value,
// //                       )
// //                     )
// //                   ) : (
// //                     <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
// //                       No warranty information added.
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* --- Floating Save Bar --- */}
// //       {(changes.basic.size > 0 || changes.attributes.size > 0) && (
// // <div className="fixed bottom-4 left-1/2 md:bottom-8
// //  transform -translate-x-1/2 bg-[#1a1a2e] text-white pl-6 pr-2 py-2 rounded-full shadow-2xl shadow-indigo-900/40 z-50 flex items-center gap-6 animate-slide-up border border-white/10 max-w-[95vw]">
// // <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
// //             <span className="w-2.5 h-2.5 rounded-full bg-[#daa520] animate-pulse"></span>
// //             {changes.basic.size + changes.attributes.size} Unsaved Changes
// //           </div>
// //           <div className="h-6 w-px bg-white/20"></div>
// //           <div className="flex gap-1">
// //             <button
// //               onClick={handleCancel}
// //               className="px-5 py-2.5 hover:bg-white/10 rounded-full text-xs font-bold transition-all"
// //             >
// //               DISCARD
// //             </button>
// //             <button
// //               onClick={handleSaveChanges}
// //               className="px-6 py-2.5 bg-white text-[#1a1a2e] rounded-full text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
// //             >
// //               <FaSave className="text-indigo-600" /> SAVE CHANGES
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );

// // // return (
// // //   <div className="animate-fade-in relative bg-slate-50 min-h-screen pb-40">
// // //     <Toast ref={toast} />

// // //     {/* ===== TOP BAR ===== */}
// // //     <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
// // //       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
// // //         <button
// // //           onClick={() => navigate(-1)}
// // //           className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-900"
// // //         >
// // //           <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
// // //             <FaArrowLeft />
// // //           </span>
// // //           Back
// // //         </button>

// // //         <div className="flex gap-2">
// // //           <Button
// // //             icon={<FaPen />}
// // //             label={editMode ? "Editing" : "Edit"}
// // //             className="!bg-slate-900 !border-slate-900 !rounded-xl !px-5"
// // //             onClick={() => setEditMode(true)}
// // //           />
// // //           <Button
// // //             icon={<FaImages />}
// // //             label="Media"
// // //             className="!bg-slate-100 !text-slate-800 !rounded-xl"
// // //             onClick={() => navigate(`/product/${id}/media`)}
// // //           />
// // //           <Button
// // //             icon={<FaList />}
// // //             label="Attributes"
// // //             className=" !border-slate-200 !rounded-xl"
// // //             onClick={() => navigate(`/product/${id}/attributes`)}
// // //           />
// // //         </div>
// // //       </div>
// // //     </div>

// // //     {/* ===== MAIN ===== */}
// // //     <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

// // //       {/* ===== LEFT : MEDIA ===== */}
// // //       <div className="lg:col-span-5">
// // //         <div className="lg:sticky lg:top-28 space-y-6">

// // //           {/* IMAGE STAGE */}
// // //           <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 aspect-square flex items-center justify-center relative">
// // //             {mediaList.length > 0 ? (
// // //               <img
// // //                 src={mediaList[activeImage]?.url}
// // //                 className="w-full h-full object-contain"
// // //               />
// // //             ) : (
// // //               <FaBoxOpen className="text-7xl text-slate-200" />
// // //             )}

// // //             <div className="absolute top-5 left-5 flex gap-2">
// // //               <span
// // //                 className={`px-4 py-1 rounded-full text-xs font-bold ${
// // //                   stockQty > 0
// // //                     ? "bg-blue-100 text-blue-700"
// // //                     : "bg-red-100 text-red-700"
// // //                 }`}
// // //               >
// // //                 {stockQty > 0 ? "In Stock" : "Out of Stock"}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           {/* THUMBNAILS */}
// // //           {mediaList.length > 1 && (
// // //             <div className="flex gap-3 overflow-x-auto">
// // //               {mediaList.map((m, i) => {
// // //                 const selected = selectedMediaIds.has(m.id);
// // //                 return (
// // //                   <div
// // //                     key={m.id}
// // //                     className={`relative w-20 h-20 rounded-xl border bg-white p-2 cursor-pointer
// // //                     ${activeImage === i ? "border-slate-900" : "border-slate-200"}
// // //                     ${selected ? "ring-2 ring-red-400" : ""}`}
// // //                   >
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={selected}
// // //                       onChange={(e) => {
// // //                         setSelectedMediaIds(prev => {
// // //                           const next = new Set(prev);
// // //                           e.target.checked ? next.add(m.id) : next.delete(m.id);
// // //                           return next;
// // //                         });
// // //                       }}
// // //                       className="absolute top-1 left-1"
// // //                     />
// // //                     <button
// // //                       onClick={() => deleteMedia([m.id])}
// // //                       className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500"
// // //                     >
// // //                       <FaTrash size={10} />
// // //                     </button>
// // //                     <img
// // //                       src={m.url}
// // //                       onClick={() => setActiveImage(i)}
// // //                       className="w-full h-full object-contain"
// // //                     />
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ===== RIGHT : DETAILS ===== */}
// // //       <div className="lg:col-span-7 space-y-10">

// // //         {/* HEADER */}
// // //         <div>
// // //           <div className="flex gap-3 text-xs font-bold uppercase text-slate-400 mb-4">
// // //             <span className="bg-slate-200 px-3 py-1 rounded-lg">
// // //               {product.itemType}
// // //             </span>
// // //             <span>ID {id.slice(0, 8)}</span>
// // //           </div>

// // //           {editMode ? (
// // //             <InputText
// // //               value={product.title}
// // //               onChange={(e) => updateBasicField("title", e.target.value)}
// // //               className="!text-4xl !font-black !w-full !p-4 !rounded-2xl !bg-slate-100"
// // //             />
// // //           ) : (
// // //             <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
// // //               {product.title}
// // //             </h1>
// // //           )}

// // //           {/* PRICE + STOCK */}
// // //           <div className="mt-6 flex items-end gap-6 border-b pb-8">
// // //             <InputText
// // //               type="number"
// // //               value={price.amount}
// // //               onChange={(e) => {
// // //                 setProduct(prev => ({
// // //                   ...prev,
// // //                   prices: [{ ...price, amount: Number(e.target.value) }]
// // //                 }));
// // //                 setChanges(p => ({ ...p, basic: new Set(p.basic).add("price") }));
// // //               }}
// // //               className="!text-4xl !font-black !w-40"
// // //             />

// // //             <InputText
// // //               type="number"
// // //               value={stockQty}
// // //               onChange={(e) => {
// // //                 setProduct(prev => ({
// // //                   ...prev,
// // //                   inventories: [{
// // //                     ...(product.inventories?.[0] || {}),
// // //                     quantityAvailable: Number(e.target.value)
// // //                   }]
// // //                 }));
// // //                 setChanges(p => ({ ...p, basic: new Set(p.basic).add("inventory") }));
// // //               }}
// // //               className="!text-2xl !font-bold !w-28"
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* TABS */}
// // //         <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
// // //           {["specifications", "description", "warranty"].map(tab => (
// // //             <button
// // //               key={tab}
// // //               onClick={() => setActiveTab(tab)}
// // //               className={`px-6 py-2 rounded-xl text-sm font-bold capitalize
// // //               ${activeTab === tab ? "bg-white shadow" : "text-slate-500"}`}
// // //             >
// // //               {tab}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* TAB CONTENT */}
// // //         <div className="space-y-6">
// // //           {activeTab === "specifications" && (
// // //             <div className="space-y-6">
// // //               {attributes.general &&
// // //                 (editMode
// // //                   ? renderObjectEditor("general", attributes.general.value)
// // //                   : renderSpecTable(<FaCogs />, "General Specs", attributes.general.value))}
// // //             </div>
// // //           )}

// // //           {activeTab === "description" && (
// // //             <div className="bg-white rounded-3xl p-8 border border-slate-200">
// // //               {editMode ? (
// // //                 <InputTextarea
// // //                   value={product.description || ""}
// // //                   onChange={(e) => updateBasicField("description", e.target.value)}
// // //                   rows={8}
// // //                   className="!w-full !rounded-xl"
// // //                 />
// // //               ) : (
// // //                 <p className="text-slate-600 leading-loose text-lg">
// // //                   {product.description || "No description provided."}
// // //                 </p>
// // //               )}
// // //             </div>
// // //           )}

// // //           {activeTab === "warranty" && (
// // //             <div className="bg-white rounded-3xl p-8 border border-slate-200">
// // //               {attributes.warranty
// // //                 ? editMode
// // //                   ? renderObjectEditor("warranty", attributes.warranty.value)
// // //                   : renderSpecTable(<FaShieldAlt />, "Warranty", attributes.warranty.value)
// // //                 : <p className="text-slate-400">No warranty info</p>}
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>

// // //     {/* ===== FLOATING SAVE BAR ===== */}
// // //     {(changes.basic.size > 0 || changes.attributes.size > 0) && (
// // //       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full flex gap-6 items-center shadow-2xl z-50">
// // //         <span className="text-sm font-bold">
// // //           {changes.basic.size + changes.attributes.size} Unsaved changes
// // //         </span>
// // //         <div className="flex gap-2">
// // //           <button
// // //             onClick={handleCancel}
// // //             className="px-4 py-2 text-xs font-bold hover:bg-white/10 rounded-full"
// // //           >
// // //             DISCARD
// // //           </button>
// // //           <button
// // //             onClick={handleSaveChanges}
// // //             className="px-5 py-2 bg-white text-slate-900 rounded-full text-xs font-bold flex items-center gap-2"
// // //           >
// // //             <FaSave /> SAVE
// // //           </button>
// // //         </div>
// // //       </div>
// // //     )}
// // //   </div>
// // // );

// // };

// // export default ProductDetails;
  



// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiGet,apiPost, apiDelete, apiPatch } from "../services/api";
// import { useBusiness } from "../context/BusinessContext";

// // PrimeReact & Icons
// import { Button } from "primereact/button";
// import { Toast } from "primereact/toast";
// import { Skeleton } from "primereact/skeleton";
// import { InputText } from "primereact/inputtext";
// import { InputTextarea } from "primereact/inputtextarea";
// import {
//   FaCheck,
//   FaImages,
//   FaTimes,
//   FaSave,
//   FaPen,
//   FaPlus,
//   FaTrash,
//   FaBoxOpen,
//   FaShieldAlt,
//   FaList,
//   FaArrowLeft,
//   FaMemory,
//   FaMicrochip,
//   FaCogs,
//   FaStar,
//   FaKey,
// } from "react-icons/fa";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const { businessId } = useBusiness();
//   const navigate = useNavigate();
//   const toast = useRef(null);

//   // --- State ---
//   const [product, setProduct] = useState(null);
//   const [originalProduct, setOriginalProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("specifications");
//   const [activeImage, setActiveImage] = useState(0);
//   const [changes, setChanges] = useState({
//     basic: new Set(),
//     attributes: new Set(),
//   });
//   const [mediaList, setMediaList] = useState([]);
//   const [selectedMediaIds, setSelectedMediaIds] = useState(new Set());
//   const [deleting, setDeleting] = useState(false);

//   // --- 1. Load & Normalize Data ---
//   useEffect(() => {
//     if (businessId && id) fetchProduct();
//   }, [businessId, id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await apiGet(
//         `/seller/business/${businessId}/products/${id}`,
//       );
//       if (response.data.success) {
//         const data = response.data.data;
//         data.attributes = normalizeAttributes(data.attributes);
//         setProduct(data);
//         setOriginalProduct(JSON.parse(JSON.stringify(data)));
//         setMediaList(data.media || []);
//         setSelectedMediaIds(new Set());
//       }
//     } catch (error) {
//       console.error(error);
//       toast.current?.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Failed to load product",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteMedia = async (mediaIds = []) => {
//     if (mediaIds.length === 0) return;

//     if (!confirm(`Delete ${mediaIds.length} media file(s)?`)) return;

//     try {
//       setDeleting(true);

//       await apiDelete(
//         `/seller/business/${businessId}/items/${id}/media`,
//         { mediaIds }
//       );

//       setMediaList(prev =>
//         prev.filter(m => !mediaIds.includes(m.id))
//       );

//       setActiveImage(prev => {
//         const remaining = mediaList.length - mediaIds.length;
//         if (remaining <= 0) return 0;
//         return prev >= remaining ? 0 : prev;
//       });

//       setSelectedMediaIds(new Set());

//       toast.current.show({
//         severity: "success",
//         summary: "Deleted",
//         detail: "Media deleted successfully",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail:
//           err?.response?.data?.message ||
//           "Failed to delete media",
//       });
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const normalizeAttributes = (attrs = {}) => {
//     const normalized = {};
//     for (const [key, val] of Object.entries(attrs)) {
//       normalized[key] = {
//         ...val,
//         value: val.value,
//         attributeDefinitionId:
//           val.attributeDefinitionId || val.definitionId || null,
//         source: val.source || val.sourceType || "custom",
//       };
//     }
//     return normalized;
//   };

//   // --- 2. Edit Logic ---
//   const updateBasicField = (field, value) => {
//     setProduct((prev) => ({ ...prev, [field]: value }));
//     setChanges((prev) => ({ ...prev, basic: prev.basic.add(field) }));
//   };

//   const updateAttributeValue = (attrKey, newVal) => {
//     setProduct((prev) => ({
//       ...prev,
//       attributes: {
//         ...prev.attributes,
//         [attrKey]: { ...prev.attributes[attrKey], value: newVal },
//       },
//     }));
//     setChanges((prev) => ({
//       ...prev,
//       attributes: prev.attributes.add(attrKey),
//     }));
//   };

//   // --- 3. Dynamic Editors ---
//   const renderObjectEditor = (attrKey, data) => {
//     if (!data || typeof data !== "object") return null;
//     return (
//       <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
//         {Object.entries(data).map(([key, val], idx) => (
//           <div key={idx} className="flex gap-3 items-center group">
//             <div className="w-1/3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//               {key}
//             </div>
//             <InputText
//               value={val}
//               onChange={(e) => {
//                 const newData = { ...data, [key]: e.target.value };
//                 updateAttributeValue(attrKey, newData);
//               }}
//               className="flex-1 !py-2 !px-3 !text-sm !rounded-lg !border-gray-200 focus:!border-[#1a1a2e] focus:!ring-0 transition-all"
//             />
//             <button
//               onClick={() => {
//                 const newData = { ...data };
//                 delete newData[key];
//                 updateAttributeValue(attrKey, newData);
//               }}
//               className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
//             >
//               <FaTrash />
//             </button>
//           </div>
//         ))}
//         <Button
//           label="Add Field"
//           icon={<FaPlus className="mr-2 text-[10px]" />}
//           className="!bg-white !text-[#1a1a2e] !border border-gray-200 !px-3 !py-1.5 !text-xs !rounded-lg hover:!bg-gray-50 !shadow-sm"
//           onClick={() => {
//             const key = prompt("Enter new field name:");
//             if (key) {
//               const newData = { ...data, [key]: "" };
//               updateAttributeValue(attrKey, newData);
//             }
//           }}
//         />
//       </div>
//     );
//   };

//   const renderArrayEditor = (attrKey, arrayData) => {
//     const list = Array.isArray(arrayData) ? arrayData : [];
//     return (
//       <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
//         {list.map((item, idx) => (
//           <div key={idx} className="flex gap-2 items-center group">
//             <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[10px] font-bold text-gray-400 border border-gray-200">
//               {idx + 1}
//             </span>
//             <InputTextarea
//               value={item}
//               onChange={(e) => {
//                 const newList = [...list];
//                 newList[idx] = e.target.value;
//                 updateAttributeValue(attrKey, newList);
//               }}
//               rows={1}
//               autoResize
//               className="flex-1 !py-2 !px-3 !text-sm !rounded-lg !border-gray-200 focus:!border-[#1a1a2e] focus:!ring-0"
//             />
//             <button
//               onClick={() =>
//                 updateAttributeValue(
//                   attrKey,
//                   list.filter((_, i) => i !== idx),
//                 )
//               }
//               className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         ))}
//         <Button
//           label="Add Item"
//           icon={<FaPlus className="mr-2 text-[10px]" />}
//           className="!bg-white !text-[#1a1a2e] !border border-gray-200 !px-3 !py-1.5 !text-xs !rounded-lg hover:!bg-gray-50 !shadow-sm"
//           onClick={() => updateAttributeValue(attrKey, [...list, ""])}
//         />
//       </div>
//     );
//   };

//   const renderSpecTable = (icon, title, data) => {
//     if (!data || typeof data !== "object") return null;

//     return (
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
//         <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#1a1a2e] shadow-sm">
//             {icon}
//           </div>
//           <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide">
//             {title}
//           </h3>
//         </div>

//         <div className="divide-y divide-gray-50">
//           {Object.entries(data).map(([k, v], i) => (
//             <div
//               key={i}
//               className="flex px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
//             >
//               <div className="w-1/3 text-sm font-medium text-gray-500">{k}</div>
//               <div className="w-2/3 text-sm font-semibold text-[#1a1a2e]">
//                 {String(v)}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderFeatureList = (icon, title, list) => (
//     <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden">
//       <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
//       <div className="flex items-center gap-3 mb-6 relative z-10">
//         <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#daa520] backdrop-blur-sm border border-white/10">
//           {icon}
//         </div>
//         <h3 className="font-bold text-lg">{title}</h3>
//       </div>
//       <ul className="space-y-3 relative z-10">
//         {list.map((item, i) => (
//           <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
//             <FaCheck className="text-[#daa520] mt-1 flex-shrink-0 text-xs" />
//             <span className="leading-relaxed">{item}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

//   const handleSaveChanges = async () => {
//     if (changes.basic.size === 0 && changes.attributes.size === 0) return;

//     try {
//       const payload = {};

//       /* ---------------- ITEM ---------------- */
//       if (changes.basic.size > 0) {
//         const item = {};

//         if (changes.basic.has("title")) {
//           item.title = product.title;
//         }

//         if (changes.basic.has("description")) {
//           item.description = product.description;
//         }

//         if (changes.basic.has("status")) {
//           item.status = product.status || "active";
//         }

//         if (changes.basic.has("visibility")) {
//           item.visibility = product.visibility || "public";
//         }

//         if (Object.keys(item).length > 0) {
//           payload.item = item;
//         }
//       }

//       /* ---------------- PRICE ---------------- */
//       if (changes.basic.has("price")) {
//         payload.price = {
//           currency: product.prices?.[0]?.currency || "INR",
//           amount: product.prices?.[0]?.amount || 0,
//         };
//       }

//       /* ---------------- INVENTORY (Physical Only) ---------------- */
//       if (changes.basic.has("inventory") && product.itemType !== 'digital') {
//         payload.inventory = {
//           quantityAvailable:
//             product.inventories?.[0]?.quantityAvailable ?? 0,
//           status:
//             product.inventories?.[0]?.quantityAvailable > 0
//               ? "available"
//               : "out_of_stock",
//         };
//       }

//       /* ---------------- ATTRIBUTES (OPTIONAL) ---------------- */
//       if (changes.attributes.size > 0) {
//         payload.attributes = [];

//         changes.attributes.forEach((key) => {
//           const attr = product.attributes[key];
//           if (!attr) return;

//           payload.attributes.push({
//             attributeDefinitionId: attr.attributeDefinitionId,
//             sourceType: attr.source || "custom",
//             value: attr.value,
//           });
//         });
//       }

//       if (Object.keys(payload).length === 0) return;

//       /* ---------------- API CALL ---------------- */
//       await apiPatch(
//         `/seller/business/${businessId}/items/${id}`,
//         payload
//       );

//       toast.current.show({
//         severity: "success",
//         summary: "Saved",
//         detail: "Product updated successfully",
//       });

//       setEditMode(false);
//       setChanges({ basic: new Set(), attributes: new Set() });
//       fetchProduct();
//     } catch (err) {
//       console.error(err);
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail:
//           err?.response?.data?.message ||
//           "Failed to update product",
//       });
//     }
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "instant" });
//   }, [id]);

//   const handleCancel = () => {
//     if (
//       (changes.basic.size > 0 || changes.attributes.size > 0) &&
//       !confirm("Discard unsaved changes?")
//     )
//       return;
//     setProduct(JSON.parse(JSON.stringify(originalProduct)));
//     setChanges({ basic: new Set(), attributes: new Set() });
//     setEditMode(false);
//   };

//   // --- 6. Main Render ---
//   if (loading)
//     return (
//       <div className="p-8 max-w-7xl mx-auto">
//         <div className="grid grid-cols-12 gap-8">
//           <div className="col-span-5">
//             <Skeleton height="500px" className="rounded-3xl" />
//           </div>
//           <div className="col-span-7 space-y-4">
//             <Skeleton height="40px" width="60%" />
//             <Skeleton height="20px" width="40%" />
//             <Skeleton height="200px" />
//           </div>
//         </div>
//       </div>
//     );
//   if (!product)
//     return (
//       <div className="p-20 text-center">
//         <div className="text-6xl mb-4">📦</div>
//         <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
//       </div>
//     );

//   const isDigital = product.itemType === 'digital';
//   const stockQty = isDigital 
//     ? (product.digitalAssets?.length || 0)
//     : (product.inventories?.[0]?.quantityAvailable || 0);
//   const price = product.prices?.[0] || { amount: 0, currency: "INR" };
//   const attributes = product.attributes || {};

//   return (
//     <div className="animate-fade-in relative">
//       <Toast ref={toast} />

//       {/* --- Top Navigation Bar --- */}
//       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center mb-8 shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1a1a2e] transition-colors group"
//         >
//           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#1a1a2e] group-hover:text-white transition-all">
//             <FaArrowLeft className="text-xs" />
//           </div>
//           Back to Dashboard
//         </button>

//         <div className="flex gap-2">
//           <Button
//             icon={<FaPen />}
//             label={editMode ? "Editing" : "Edit"}
//             className="!bg-slate-900 !border-slate-900 !rounded-xl !px-5"
//             onClick={() => setEditMode(true)}
//           />
   

// <Button
//   icon={<FaImages />}
//   label="Media"
//   className="!bg-slate-100 !text-slate-800 !rounded-xl"
//   onClick={() => navigate(`/dashboard/product/${id}/media`, { replace: false })}
// />

// <Button
//   icon={<FaList />}
//   label="Attributes"  
//   className="!border-slate-200 !rounded-xl"
//   onClick={() => navigate(`/dashboard/product/${id}/attributes`, { replace: false })}
// />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

//           {/* --- Left Column: Visuals (Sticky) --- */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="lg:sticky lg:top-28">
//               {/* Main Image Stage */}
//               <div className="aspect-square md:aspect-[4/3] bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 flex items-center justify-center p-10 md:p-10 relative overflow-hidden group">
//                 <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50"></div>
//                 {mediaList.length > 0 ? (
//                   <img
//                     src={mediaList[activeImage]?.url}
//                     alt={product.title}
//                     className="w-full h-full object-contain mix-blend-multiply relative z-10"
//                   />
//                 ) : (
//                   <FaBoxOpen className="text-8xl text-gray-200 relative z-10" />
//                 )}

//                 {/* Status Tags */}
//                 <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
//                   <span
//                     className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${stockQty > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
//                   >
//                     {isDigital 
//                       ? (stockQty > 0 ? `${stockQty} Keys Available` : "No Keys") 
//                       : (stockQty > 0 ? "In Stock" : "Out of Stock")
//                     }
//                   </span>
//                   {isDigital && (
//                     <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg flex items-center gap-2">
//                       <FaKey /> DIGITAL PRODUCT
//                     </span>
//                   )}
//                   {attributes.brand && (
//                     <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1a1a2e] text-white shadow-lg">
//                       {attributes.brand.value}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {selectedMediaIds.size > 0 && (
//                 <div className="flex items-center justify-between mb-4 px-2">
//                   <span className="text-sm font-bold text-red-600">
//                     {selectedMediaIds.size} selected
//                   </span>

//                   <Button
//                     label={deleting ? "Deleting..." : "Delete Selected"}
//                     icon={<FaTrash className="mr-2" />}
//                     disabled={deleting}
//                     className="!bg-red-600 !border-red-600 !text-white !px-4 !py-2 !rounded-xl !text-sm"
//                     onClick={() =>
//                       deleteMedia(Array.from(selectedMediaIds))
//                     }
//                   />
//                 </div>
//               )}

//               {/* Thumbnails */}
//               {mediaList.length > 1 && (
//                 <div className="flex gap-4 mt-10 overflow-x-auto pb-4 px-2">
//                   {mediaList.map((m, i) => {
//                     const isSelected = selectedMediaIds.has(m.id);

//                     return (
//                       <div
//                         key={m.id}
//                         className={`relative w-20 h-20 rounded-2xl border-2 p-2 bg-white cursor-pointer
//                           ${activeImage === i ? "border-[#1a1a2e]" : "border-gray-200"}
//                           ${isSelected ? "ring-2 ring-red-400" : ""}`}
//                       >
//                         {/* checkbox */}
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={(e) => {
//                             setSelectedMediaIds(prev => {
//                               const next = new Set(prev);
//                               e.target.checked ? next.add(m.id) : next.delete(m.id);
//                               return next;
//                             });
//                           }}
//                           className="absolute top-1 left-1 z-20"
//                         />

//                         {/* single delete */}
//                         <button
//                           onClick={() => deleteMedia([m.id])}
//                           className="absolute top-1 right-1 z-20 bg-white text-red-500 rounded-full p-1 shadow hover:scale-110"
//                           title="Delete image"
//                         >
//                           <FaTrash size={10} />
//                         </button>

//                         <img
//                           src={m.url}
//                           onClick={() => setActiveImage(i)}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* --- Right Column: Details --- */}
//           <div className="lg:col-span-7">
//             {/* Title & Price Header */}
//             <div className="mb-10">
//               <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
//                 <span className="bg-gray-100 px-3 py-1 rounded-lg">
//                   {product.itemType}
//                 </span>
//                 <span>•</span>
//                 <span>ID: {id.slice(0, 8)}</span>
//               </div>

//               {editMode ? (
//                 <InputText
//                   value={product.title}
//                   onChange={(e) => updateBasicField("title", e.target.value)}
//                   className="text-4xl font-black w-full !p-4 !bg-gray-50 !border-dashed !border-2 !border-gray-300 focus:!border-[#1a1a2e] rounded-xl mb-4"
//                 />
//               ) : (
//                 <h1 className="text-4xl md:text-5xl font-black text-[#1a1a2e] font-playfair leading-[1.1] mb-6 drop-shadow-sm">
//                   {product.title}
//                 </h1>
//               )}

//               <div className="flex items-end gap-6 pb-8 border-b border-gray-100">
//                 <InputText
//                   type="number"
//                   value={price.amount}
//                   onChange={(e) => {
//                     const newPrice = {
//                       ...price,
//                       amount: Number(e.target.value),
//                     };

//                     setProduct((prev) => ({
//                       ...prev,
//                       prices: [newPrice],
//                     }));

//                     setChanges((prev) => ({
//                       ...prev,
//                       basic: new Set(prev.basic).add("price"),
//                     }));
//                   }}
//                   className="!text-4xl !font-black !w-40 !border-dashed !border-2 !border-gray-300 focus:!border-[#1a1a2e]"
//                 />

//                 <div className="h-12 w-px bg-gray-200 mx-2"></div>

//                 {!isDigital && (
//                   <InputText
//                     type="number"
//                     value={stockQty}
//                     onChange={(e) => {
//                       const newInventory = {
//                         ...(product.inventories?.[0] || {}),
//                         quantityAvailable: Number(e.target.value),
//                       };

//                       setProduct((prev) => ({
//                         ...prev,
//                         inventories: [newInventory],
//                       }));

//                       setChanges((prev) => ({
//                         ...prev,
//                         basic: new Set(prev.basic).add("inventory"),
//                       }));
//                     }}
//                     className="!text-2xl !font-bold !w-28"
//                   />
//                 )}

//                 {isDigital && (
//                   <div className="flex flex-col">
//                     <span className="text-sm text-gray-500 font-medium mb-1">Available Keys</span>
//                     <span className="text-2xl font-black text-blue-600">{stockQty}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Custom Tabs */}
//             <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl mb-8 w-fit">
//               {["specifications", "description", "warranty"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab ? "bg-white text-[#1a1a2e] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Tab Content Area */}
//             <div className="space-y-6">
//               {/* 1. Specifications */}
//               {activeTab === "specifications" && (
//                 <div className="grid grid-cols-1 gap-6 animate-fade-in">
//                   {attributes["processor-and-memory-features"] &&
//                     (editMode
//                       ? renderObjectEditor(
//                           "processor-and-memory-features",
//                           attributes["processor-and-memory-features"].value,
//                         )
//                       : renderSpecTable(
//                           <FaMicrochip />,
//                           "Processor & Memory",
//                           attributes["processor-and-memory-features"].value,
//                         ))}

//                   {attributes["general"] &&
//                     (editMode
//                       ? renderObjectEditor(
//                           "general",
//                           attributes["general"].value,
//                         )
//                       : renderSpecTable(
//                           <FaCogs />,
//                           "General Specs",
//                           attributes["general"].value,
//                         ))}

//                   {attributes["specialization"] &&
//                     (editMode
//                       ? renderArrayEditor(
//                           "specialization",
//                           attributes["specialization"].value,
//                         )
//                       : renderFeatureList(
//                           <FaStar />,
//                           "Key Highlights",
//                           attributes["specialization"].value || [],
//                         ))}
//                 </div>
//               )}

//               {/* 2. Description */}
//               {activeTab === "description" && (
//                 <div
//                   className={`animate-fade-in p-8 rounded-[24px] ${editMode ? "bg-blue-50/50 border border-blue-200 border-dashed" : "bg-white border border-gray-100 shadow-sm"}`}
//                 >
//                   <h3 className="font-bold text-[#1a1a2e] text-lg mb-6 flex items-center gap-3">
//                     <div className="w-1 h-6 bg-[#daa520] rounded-full"></div>{" "}
//                     Product Story
//                   </h3>
//                   {editMode ? (
//                     <InputTextarea
//                       value={product.description || ""}
//                       onChange={(e) =>
//                         updateBasicField("description", e.target.value)
//                       }
//                       rows={10}
//                       className="w-full !p-5 !rounded-xl !border-gray-300 !text-base !leading-relaxed focus:!border-[#1a1a2e] focus:!ring-0"
//                     />
//                   ) : (
//                     <p className="text-gray-600 leading-loose text-lg whitespace-pre-line font-serif">
//                       {product.description ||
//                         "No description available for this product."}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* 3. Warranty */}
//               {activeTab === "warranty" && (
//                 <div className="animate-fade-in bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
//                   <div className="flex items-center gap-4 mb-8">
//                     <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl shadow-sm">
//                       <FaShieldAlt />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-[#1a1a2e] text-xl">
//                         Warranty & Support
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Official manufacturer coverage
//                       </p>
//                     </div>
//                   </div>
//                   {attributes.warranty ? (
//                     editMode ? (
//                       renderObjectEditor("warranty", attributes.warranty.value)
//                     ) : (
//                       renderSpecTable(
//                         <FaShieldAlt />,
//                         "Coverage Details",
//                         attributes.warranty.value,
//                       )
//                     )
//                   ) : (
//                     <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
//                       No warranty information added.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- Floating Save Bar --- */}
//       {(changes.basic.size > 0 || changes.attributes.size > 0) && (
//         <div className="fixed bottom-4 left-1/2 md:bottom-8 transform -translate-x-1/2 bg-[#1a1a2e] text-white pl-6 pr-2 py-2 rounded-full shadow-2xl shadow-indigo-900/40 z-50 flex items-center gap-6 animate-slide-up border border-white/10 max-w-[95vw]">
//           <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
//             <span className="w-2.5 h-2.5 rounded-full bg-[#daa520] animate-pulse"></span>
//             {changes.basic.size + changes.attributes.size} Unsaved Changes
//           </div>
//           <div className="h-6 w-px bg-white/20"></div>
//           <div className="flex gap-1">
//             <button
//               onClick={handleCancel}
//               className="px-5 py-2.5 hover:bg-white/10 rounded-full text-xs font-bold transition-all"
//             >
//               DISCARD
//             </button>
//             <button
//               onClick={handleSaveChanges}
//               className="px-6 py-2.5 bg-white text-[#1a1a2e] rounded-full text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
//             >
//               <FaSave className="text-indigo-600" /> SAVE CHANGES
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete, apiPatch } from "../services/api";
import { useBusiness } from "../context/BusinessContext";

// PrimeReact & Icons
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import {
  FaCheck,
  FaImages,
  FaTimes,
  FaSave,
  FaPen,
  FaPlus,
  FaTrash,
  FaBoxOpen,
  FaShieldAlt,
  FaList,
  FaArrowLeft,
  FaMemory,
  FaMicrochip,
  FaCogs,
  FaStar,
  FaKey,
  FaTag,
  FaHashtag,
  FaCheckCircle,
  FaEdit,
  FaInfoCircle,
} from "react-icons/fa";

const color = {
  primary: '#0B77A7',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const getAttrIcon = (key = "") => {
  const k = key.toLowerCase();
  if (k.includes("processor") || k.includes("cpu") || k.includes("chip")) return <FaMicrochip />;
  if (k.includes("memory") || k.includes("ram") || k.includes("storage")) return <FaMemory />;
  if (k.includes("warranty") || k.includes("shield") || k.includes("support")) return <FaShieldAlt />;
  if (k.includes("general") || k.includes("spec") || k.includes("cog")) return <FaCogs />;
  if (k.includes("special") || k.includes("feature") || k.includes("highlight")) return <FaStar />;
  if (k.includes("tag") || k.includes("brand") || k.includes("category")) return <FaTag />;
  return <FaHashtag />;
};

const humanise = (key = "") =>
  key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const SKIP_IN_SPECS = new Set([
  "description",
  "brand",
  "is_featured",
  "warranty",
]);

const ProductDetails = () => {
  const { id } = useParams();
  const { businessId } = useBusiness();
  const navigate = useNavigate();
  const toast = useRef(null);

  // --- State ---
  const [product, setProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("specifications");
  const [activeImage, setActiveImage] = useState(0);
  const [changes, setChanges] = useState({
    basic: new Set(),
    attributes: new Set(),
  });
  const [mediaList, setMediaList] = useState([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  // --- 1. Load & Normalize Data ---
  useEffect(() => {
    if (businessId && id) fetchProduct();
  }, [businessId, id]);

  const fetchProduct = async () => {
    try {
      const response = await apiGet(
        `/seller/business/${businessId}/products/${id}`,
      );
      if (response.data.success) {
        const data = response.data.data;
        data.attributes = normalizeAttributes(data.attributes);
        setProduct(data);
        setOriginalProduct(JSON.parse(JSON.stringify(data)));
        setMediaList(data.media || []);
        setSelectedMediaIds(new Set());
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load product",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaIds = []) => {
    if (mediaIds.length === 0) return;

    if (!confirm(`Delete ${mediaIds.length} media file(s)?`)) return;

    try {
      setDeleting(true);

      await apiDelete(
        `/seller/business/${businessId}/items/${id}/media`,
        { mediaIds }
      );

      setMediaList(prev =>
        prev.filter(m => !mediaIds.includes(m.id))
      );

      setActiveImage(prev => {
        const remaining = mediaList.length - mediaIds.length;
        if (remaining <= 0) return 0;
        return prev >= remaining ? 0 : prev;
      });

      setSelectedMediaIds(new Set());

      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Media deleted successfully",
      });
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          err?.response?.data?.message ||
          "Failed to delete media",
      });
    } finally {
      setDeleting(false);
    }
  };

  const normalizeAttributes = (attrs = {}) => {
    const normalized = {};
    for (const [key, val] of Object.entries(attrs)) {
      normalized[key] = {
        ...val,
        value: val.value,
        attributeDefinitionId:
          val.attributeDefinitionId || val.definitionId || null,
        source: val.source || val.sourceType || "custom",
      };
    }
    return normalized;
  };

  // --- 2. Edit Logic ---
  const updateBasicField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    setChanges((prev) => ({ ...prev, basic: prev.basic.add(field) }));
  };

  const updateAttributeValue = (attrKey, newVal) => {
    setProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attrKey]: { ...prev.attributes[attrKey], value: newVal },
      },
    }));
    setChanges((prev) => ({
      ...prev,
      attributes: prev.attributes.add(attrKey),
    }));
  };

  // --- 3. Dynamic Editors ---
  const renderObjectEditor = (attrKey, data) => {
    if (!data || typeof data !== "object") return null;
    return (
      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        {Object.entries(data).map(([key, val], idx) => (
          <div key={idx} className="flex gap-3 items-center group">
            <div className="w-1/3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {key}
            </div>
            <InputText
              value={val}
              onChange={(e) => {
                const newData = { ...data, [key]: e.target.value };
                updateAttributeValue(attrKey, newData);
              }}
              className="flex-1 !py-3 !px-4 !text-sm !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20 transition-all"
            />
            <button
              onClick={() => {
                const newData = { ...data };
                delete newData[key];
                updateAttributeValue(attrKey, newData);
              }}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <Button
          label="Add Field"
          icon={<FaPlus className="mr-2 text-xs" />}
          className="!bg-blue-50 !text-blue-600 !border-none !px-4 !py-2 !text-xs !font-semibold !rounded-xl hover:!bg-blue-100 transition-all"
          onClick={() => {
            const key = prompt("Enter new field name:");
            if (key) {
              const newData = { ...data, [key]: "" };
              updateAttributeValue(attrKey, newData);
            }
          }}
        />
      </div>
    );
  };

  const renderArrayEditor = (attrKey, arrayData) => {
    const list = Array.isArray(arrayData) ? arrayData : [];
    return (
      <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
        {list.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center group">
            <span className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-xs font-bold border border-gray-300" style={{ color: color.primary }}>
              {idx + 1}
            </span>
            <InputTextarea
              value={item}
              onChange={(e) => {
                const newList = [...list];
                newList[idx] = e.target.value;
                updateAttributeValue(attrKey, newList);
              }}
              rows={1}
              autoResize
              className="flex-1 !py-3 !px-4 !text-sm !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
            />
            <button
              onClick={() =>
                updateAttributeValue(
                  attrKey,
                  list.filter((_, i) => i !== idx),
                )
              }
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        ))}
        <Button
          label="Add Item"
          icon={<FaPlus className="mr-2 text-xs" />}
          className="!bg-blue-50 !text-blue-600 !border-none !px-4 !py-2 !text-xs !font-semibold !rounded-xl hover:!bg-blue-100 transition-all"
          onClick={() => updateAttributeValue(attrKey, [...list, ""])}
        />
      </div>
    );
  };

  const renderStringEditor = (attrKey, value) => (
    <InputTextarea
      value={value || ""}
      onChange={(e) => updateAttributeValue(attrKey, e.target.value)}
      rows={3}
      autoResize
      className="w-full !py-3 !px-4 !text-sm !rounded-xl !bg-white !border !border-gray-200 focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
    />
  );

  const renderAttrEditor = (attrKey, value) => {
    if (Array.isArray(value)) return renderArrayEditor(attrKey, value);
    if (value && typeof value === "object") return renderObjectEditor(attrKey, value);
    return renderStringEditor(attrKey, value);
  };

  const renderStringCard = (icon, title, value) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 hover:shadow-md transition-shadow">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color.primary }}>
          {icon}
        </div>
        <h3 className="font-bold text-[#212121] text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{String(value)}</p>
      </div>
    </div>
  );

  const renderAttrView = (attrKey, value) => {
    const icon = getAttrIcon(attrKey);
    const title = humanise(attrKey);
    if (Array.isArray(value) && value.length > 0) return renderFeatureList(icon, title, value);
    if (value && typeof value === "object" && Object.keys(value).length > 0) return renderSpecTable(icon, title, value);
    if (typeof value === "string" && value.trim()) return renderStringCard(icon, title, value);
    if (typeof value === "boolean") return renderStringCard(icon, title, value ? "Yes" : "No");
    return null;
  };

  const renderSpecTable = (icon, title, data) => {
    if (!data || typeof data !== "object") return null;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 hover:shadow-md transition-shadow">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color.primary }}>
            {icon}
          </div>
          <h3 className="font-bold text-[#212121] text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {Object.entries(data).map(([k, v], i) => (
            <div
              key={i}
              className="flex px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-1/3 text-sm font-semibold text-gray-600">{k}</div>
              <div className="w-2/3 text-sm font-bold text-[#212121]">
                {String(v)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeatureList = (icon, title, list) => (
    <div className="rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)` }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-md">
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <ul className="space-y-3 relative z-10">
        {list.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm items-start">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaCheck className="text-white text-xs" />
            </div>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const handleSaveChanges = async () => {
    if (changes.basic.size === 0 && changes.attributes.size === 0) return;

    try {
      const payload = {};

      if (changes.basic.size > 0) {
        const item = {};

        if (changes.basic.has("title")) {
          item.title = product.title;
        }

        if (changes.basic.has("description")) {
          item.description = product.description;
        }

        if (changes.basic.has("status")) {
          item.status = product.status || "active";
        }

        if (changes.basic.has("visibility")) {
          item.visibility = product.visibility || "public";
        }

        if (Object.keys(item).length > 0) {
          payload.item = item;
        }
      }

      if (changes.basic.has("price")) {
        payload.price = {
          currency: product.prices?.[0]?.currency || "INR",
          amount: product.prices?.[0]?.amount || 0,
        };
      }

      if (changes.basic.has("inventory") && product.itemType !== 'digital') {
        payload.inventory = {
          quantityAvailable:
            product.inventories?.[0]?.quantityAvailable ?? 0,
          status:
            product.inventories?.[0]?.quantityAvailable > 0
              ? "available"
              : "out_of_stock",
        };
      }

      if (changes.attributes.size > 0) {
        payload.attributes = [];

        changes.attributes.forEach((key) => {
          const attr = product.attributes[key];
          if (!attr) return;

          payload.attributes.push({
            attributeDefinitionId: attr.attributeDefinitionId,
            sourceType: attr.source || "custom",
            value: attr.value,
          });
        });
      }

      if (Object.keys(payload).length === 0) return;

      await apiPatch(
        `/seller/business/${businessId}/items/${id}`,
        payload
      );

      toast.current.show({
        severity: "success",
        summary: "Saved",
        detail: "Product updated successfully",
      });

      setEditMode(false);
      setChanges({ basic: new Set(), attributes: new Set() });
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          err?.response?.data?.message ||
          "Failed to update product",
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const handleCancel = () => {
    if (
      (changes.basic.size > 0 || changes.attributes.size > 0) &&
      !confirm("Discard unsaved changes?")
    )
      return;
    setProduct(JSON.parse(JSON.stringify(originalProduct)));
    setChanges({ basic: new Set(), attributes: new Set() });
    setEditMode(false);
  };

  // --- 6. Main Render ---
  if (loading)
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-5">
            <Skeleton height="500px" className="rounded-2xl" />
          </div>
          <div className="col-span-7 space-y-4">
            <Skeleton height="40px" width="60%" />
            <Skeleton height="20px" width="40%" />
            <Skeleton height="200px" />
          </div>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
          <FaBoxOpen className="text-4xl" style={{ color: color.primary }} />
        </div>
        <h2 className="text-2xl font-bold text-[#212121]">Product Not Found</h2>
      </div>
    );

  const isDigital = product.itemType === 'digital';
  const stockQty = isDigital 
    ? (product.digitalAssets?.length || 0)
    : (product.inventories?.[0]?.quantityAvailable || 0);
  const price = product.prices?.[0] || { amount: 0, currency: "INR" };
  const attributes = product.attributes || {};

  const descriptionFromAttr = attributes["description"]?.value;
  const displayDescription = descriptionFromAttr || product.description || "";
  const specAttributes = Object.entries(attributes).filter(
    ([key]) => !SKIP_IN_SPECS.has(key)
  );

  return (
    <div className="animate-fade-in relative pb-20">
      <Toast ref={toast} />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex justify-between items-center mb-8 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0B77A7] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-[#0B77A7] group-hover:text-white transition-all">
            <FaArrowLeft className="text-xs" />
          </div>
          Back
        </button>

        <div className="flex gap-2">
          <Button
            icon={<FaPen className="text-xs" />}
            label={editMode ? "Editing" : "Edit"}
            className="!border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!scale-105 active:!scale-95 transition-all shadow-sm"
            style={{ backgroundColor: color.primary }}
            onClick={() => setEditMode(true)}
          />

          <Button
            icon={<FaImages className="text-xs mr-2" />}
            label="Media"
            className="!bg-blue-50 !text-blue-600 !border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!bg-blue-100 hover:!scale-105 active:!scale-95 transition-all"
            onClick={() => navigate(`/dashboard/product/${id}/media`, { replace: false })}
          />

          <Button
            icon={<FaList className="text-xs mr-2" />}
            label="Attributes"  
            className="!bg-gray-100 !text-gray-700 !border-none !rounded-xl !px-5 !py-3 !text-sm !font-semibold hover:!bg-gray-200 hover:!scale-105 active:!scale-95 transition-all"
            onClick={() => navigate(`/dashboard/product/${id}/attributes`, { replace: false })}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column: Visuals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-28">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 shadow-lg flex items-center justify-center p-10 relative overflow-hidden group">
                {mediaList.length > 0 ? (
                  <img
                    src={mediaList[activeImage]?.url}
                    alt={product.title}
                    className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <FaBoxOpen className="text-8xl text-gray-200 relative z-10" />
                )}

                {/* Status Tags */}
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${stockQty > 0 ? "bg-blue-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {isDigital 
                      ? (stockQty > 0 ? `${stockQty} Keys` : "No Keys") 
                      : (stockQty > 0 ? "In Stock" : "Out of Stock")
                    }
                  </span>
                  {isDigital && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md flex items-center gap-2">
                      <FaKey className="text-xs" /> DIGITAL
                    </span>
                  )}
                  {attributes.brand && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md" style={{ backgroundColor: color.primary }}>
                      {attributes.brand.value}
                    </span>
                  )}
                </div>
              </div>

              {selectedMediaIds.size > 0 && (
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-sm font-bold text-red-600">
                    {selectedMediaIds.size} selected
                  </span>

                  <Button
                    label={deleting ? "Deleting..." : "Delete Selected"}
                    icon={<FaTrash className="mr-2 text-xs" />}
                    disabled={deleting}
                    className="!bg-red-500 !border-none !text-white !px-4 !py-2 !rounded-xl !text-xs !font-semibold hover:!bg-red-600 hover:!scale-105 active:!scale-95 transition-all shadow-md"
                    onClick={() =>
                      deleteMedia(Array.from(selectedMediaIds))
                    }
                  />
                </div>
              )}

              {/* Thumbnails */}
              {mediaList.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto pb-4 px-2">
                  {mediaList.map((m, i) => {
                    const isSelected = selectedMediaIds.has(m.id);

                    return (
                      <div
                        key={m.id}
                        className={`relative w-20 h-20 rounded-xl border-2 p-2 bg-white cursor-pointer flex-shrink-0 transition-all
                          ${activeImage === i ? "border-[#0B77A7] shadow-md" : "border-gray-200"}
                          ${isSelected ? "ring-2 ring-red-400" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            setSelectedMediaIds(prev => {
                              const next = new Set(prev);
                              e.target.checked ? next.add(m.id) : next.delete(m.id);
                              return next;
                            });
                          }}
                          className="absolute top-1 left-1 z-20 w-4 h-4 rounded"
                        />

                        <button
                          onClick={() => deleteMedia([m.id])}
                          className="absolute top-1 right-1 z-20 bg-white text-red-500 rounded-full p-1 shadow hover:scale-110 transition-transform"
                          title="Delete image"
                        >
                          <FaTrash size={10} />
                        </button>

                        <img
                          src={m.url}
                          onClick={() => setActiveImage(i)}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7">
            {/* Title & Price */}
            <div className="mb-10">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                  {product.itemType}
                </span>
                <span>•</span>
                <span className="font-mono">ID: {id.slice(0, 8)}</span>
              </div>

              {editMode ? (
                <InputText
                  value={product.title}
                  onChange={(e) => updateBasicField("title", e.target.value)}
                  className="text-4xl font-black w-full !p-4 !bg-gray-50 !border-2 !border-dashed !border-gray-300 focus:!border-[#0B77A7] !rounded-xl mb-6"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-black text-[#212121] leading-[1.1] mb-6">
                  {product.title}
                </h1>
              )}

              {/* <div className="flex items-end gap-6 pb-6 border-b border-gray-100">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">Price</label>
                  <InputText
                    type="number"
                    value={price.amount}
                    onChange={(e) => {
                      const newPrice = {
                        ...price,
                        amount: Number(e.target.value),
                      };

                      setProduct((prev) => ({
                        ...prev,
                        prices: [newPrice],
                      }));

                      setChanges((prev) => ({
                        ...prev,
                        basic: new Set(prev.basic).add("price"),
                      }));
                    }}
                    className="!text-3xl !font-black !border-2 !border-dashed !border-gray-300 focus:!border-[#0B77A7] !rounded-xl !px-4 !py-3"
                    style={{ color: color.primary }}
                  />
                </div> */}



{/* ye discount ke liye add kiya he upr vala normal tha  */}
<div className="flex items-end gap-6 pb-6 border-b border-gray-100">
  <div className="flex-1">
    <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">Price</label>

    {editMode ? (
      <InputText
        type="number"
        value={price.amount}
        onChange={(e) => {
          const newPrice = { ...price, amount: Number(e.target.value) };
          setProduct((prev) => ({ ...prev, prices: [newPrice] }));
          setChanges((prev) => ({
            ...prev,
            basic: new Set(prev.basic).add("price"),
          }));
        }}
        className="!text-3xl !font-black !border-2 !border-dashed !border-gray-300 focus:!border-[#0B77A7] !rounded-xl !px-4 !py-3"
        style={{ color: color.primary }}
      />
    ) : product.discountPricing?.discountTotal > 0 ? (
      <div className="flex flex-col gap-1">
        {/* Discount badge */}
        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit">
          {product.discountPricing.discounts[0]?.name} &nbsp;•&nbsp;
          {product.discountPricing.discounts[0]?.value}% OFF
        </span>
        {/* Original price strikethrough */}
        <span className="text-lg text-gray-400 line-through font-semibold">
          ₹{product.discountPricing.basePrice.toLocaleString("en-IN")}
        </span>
        {/* Final price */}
        <span className="text-4xl font-black text-green-600">
          ₹{product.discountPricing.finalPrice.toLocaleString("en-IN")}
        </span>
        {/* Savings */}
        <span className="text-xs text-green-600 font-semibold">
          You save ₹{product.discountPricing.discountTotal.toLocaleString("en-IN")}
        </span>
      </div>
    ) : (
      <div className="text-4xl font-black" style={{ color: color.primary }}>
        ₹{Number(price.amount).toLocaleString("en-IN")}
      </div>
    )}
  </div>

                {!isDigital && (
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">Stock</label>
                    <InputText
                      type="number"
                      value={stockQty}
                      onChange={(e) => {
                        const newInventory = {
                          ...(product.inventories?.[0] || {}),
                          quantityAvailable: Number(e.target.value),
                        };

                        setProduct((prev) => ({
                          ...prev,
                          inventories: [newInventory],
                        }));

                        setChanges((prev) => ({
                          ...prev,
                          basic: new Set(prev.basic).add("inventory"),
                        }));
                      }}
                      className="!text-2xl !font-bold !border-2 !border-dashed !border-gray-300 focus:!border-[#0B77A7] !rounded-xl !px-4 !py-3"
                    />
                  </div>
                )}

                {isDigital && (
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">Available Keys</label>
                    <div className="text-2xl font-black text-blue-600 px-4 py-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                      {stockQty}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                <div className="flex gap-2">
                  {["specifications", "description", "warranty"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
                      style={activeTab === tab ? { backgroundColor: color.primary } : {}}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Specifications */}
              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  {specAttributes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
                        <FaCogs className="text-3xl" style={{ color: color.primary }} />
                      </div>
                      <p className="text-gray-500 font-semibold mb-2">No specifications added yet</p>
                      <p className="text-xs text-gray-400">
                        Use the{" "}
                        <button
                          onClick={() => navigate(`/dashboard/product/${id}/attributes`)}
                          className="underline font-semibold"
                          style={{ color: color.primary }}
                        >
                          Attributes editor
                        </button>{" "}
                        to add specs
                      </p>
                    </div>
                  ) : editMode ? (
                    specAttributes.map(([key, attr]) => (
                      <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: color.primary }}>
                            {getAttrIcon(key)}
                          </div>
                          <span className="font-bold text-[#212121] text-sm uppercase tracking-wide">
                            {humanise(key)}
                          </span>
                        </div>
                        <div className="p-6">
                          {renderAttrEditor(key, attr.value)}
                        </div>
                      </div>
                    ))
                  ) : (
                    specAttributes.map(([key, attr]) => (
                      <div key={key}>{renderAttrView(key, attr.value)}</div>
                    ))
                  )}
                </div>
              )}

              {/* Description */}
              {activeTab === "description" && (
                <div
                  className={`animate-fade-in p-8 rounded-2xl ${editMode ? "bg-blue-50 border-2 border-dashed border-blue-200" : "bg-white border border-gray-100 shadow-sm"}`}
                >
                  <h3 className="font-bold text-[#212121] text-lg mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color.primary }}></div>
                    Product Description
                  </h3>
                  {editMode ? (
                    <>
                      <InputTextarea
                        value={displayDescription}
                        onChange={(e) => {
                          if (attributes["description"]) {
                            updateAttributeValue("description", e.target.value);
                          }
                          updateBasicField("description", e.target.value);
                        }}
                        rows={10}
                        className="w-full !p-5 !rounded-xl !border-2 !border-gray-300 !text-base !leading-relaxed focus:!border-[#0B77A7] focus:!ring-2 focus:!ring-[#0B77A7]/20"
                      />
                      {descriptionFromAttr && (
                        <div className="flex items-center gap-2 text-xs text-blue-700 mt-3 bg-blue-100 px-3 py-2 rounded-lg">
                          <FaInfoCircle />
                          <span className="font-semibold">This description is synced from the Attributes section</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-600 leading-loose text-base whitespace-pre-line">
                      {displayDescription ||
                        "No description available for this product."}
                    </p>
                  )}
                </div>
              )}

              {/* Warranty */}
              {activeTab === "warranty" && (
                <div className="animate-fade-in bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: color.primary }}>
                      <FaShieldAlt className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#212121] text-xl">
                        Warranty & Support
                      </h3>
                      <p className="text-sm text-gray-500">
                        Official manufacturer coverage
                      </p>
                    </div>
                  </div>
                  {attributes.warranty ? (
                    editMode ? (
                      renderObjectEditor("warranty", attributes.warranty.value)
                    ) : (
                      renderSpecTable(
                        <FaShieldAlt />,
                        "Coverage Details",
                        attributes.warranty.value,
                      )
                    )
                  ) : (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      No warranty information added
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      {(changes.basic.size > 0 || changes.attributes.size > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 pb-6">
            <div className="rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ backgroundColor: color.primary }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg">Unsaved Changes</p>
                  <p className="text-sm text-white/80">
                    {changes.basic.size + changes.attributes.size} change{(changes.basic.size + changes.attributes.size) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                >
                  <FaTimes className="text-xs" /> Discard
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ color: color.primary }}
                >
                  <FaSave className="text-xs" /> Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
