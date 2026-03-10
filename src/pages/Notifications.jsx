// import { useEffect, useState } from "react";
// import { useBusiness } from "../context/BusinessContext";
// import { apiGet } from "../services/api";
// import { FaCircle } from "react-icons/fa";

// const CATEGORIES = [
//   { label: "All", value: "" },
//   { label: "Orders", value: "order" },
//   { label: "Refunds", value: "refund" },
//   { label: "Catalog", value: "catalog" }
// ];

// const Notifications = () => {
//   const { businessId } = useBusiness();

//   const [notifications, setNotifications] = useState([]);
//   const [category, setCategory] = useState("");
//   const [unreadOnly, setUnreadOnly] = useState(false);
//   const [hasMore, setHasMore] = useState(true);


//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(false);

//   // ================= FETCH =================
// //   const fetchNotifications = async (reset = false) => {
// //     setLoading(true);
// //     try {
// //       const res = await apiGet(
// //         `/seller/business/${businessId}/notifications`,
// //         {
// //           params: {
// //             page,
// //             limit,
// //             category: category || undefined,
// //             unreadOnly: unreadOnly || undefined
// //           }
// //         }
// //       );

// //       const data = res.data;

// //       setTotal(data.total);
// //       setNotifications((prev) =>
// //         reset ? data.notifications : [...prev, ...data.notifications]
// //       );
// //     } catch (err) {
// //       console.error("Notification fetch failed", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const fetchNotifications = async (reset = false) => {
//   setLoading(true);
//   try {
//     const res = await apiGet(
//       `/seller/business/${businessId}/notifications`,
//       {
//         params: {
//           page,
//           limit,
//           category: category || undefined,
//           unreadOnly: unreadOnly || undefined
//         }
//       }
//     );

//     const data = res.data;

//     setTotal(data.total);

//     setNotifications((prev) =>
//       reset ? data.notifications : [...prev, ...data.notifications]
//     );

//     // ✅ REAL pagination check
//     const loadedCount = reset
//       ? data.notifications.length
//       : notifications.length + data.notifications.length;

//     setHasMore(loadedCount < data.total);
//   } catch (err) {
//     console.error("Notification fetch failed", err);
//   } finally {
//     setLoading(false);
//   }
// };


//   // ================= EFFECTS =================
// //   useEffect(() => {
// //     setPage(1);
// //     fetchNotifications(true);
// //     // eslint-disable-next-line
// //   }, [category, unreadOnly]);


//   // Jab filter change ho → sirf reset page
// useEffect(() => {
//   setPage(1);
// }, [category, unreadOnly]);

// // Jab page change ho → API call
// useEffect(() => {
//   fetchNotifications(page === 1);
//   // eslint-disable-next-line
// }, [page]);

//   useEffect(() => {
//     if (page > 1) fetchNotifications();
//     // eslint-disable-next-line
//   }, [page]);

//   // ================= UI =================
//   return (
//     <div className="space-y-6">

//       {/* ===== HEADER ===== */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//         <h1 className="text-xl font-semibold text-slate-800">
//           Notifications
//         </h1>

//         <label className="flex items-center gap-2 text-sm cursor-pointer">
//           <input
//             type="checkbox"
//             checked={unreadOnly}
//             onChange={(e) => setUnreadOnly(e.target.checked)}
//             className="accent-yellow-500"
//           />
//           Show unread only
//         </label>
//       </div>

//       {/* ===== CATEGORY TABS ===== */}
//       <div className="flex gap-2 overflow-x-auto">
//         {CATEGORIES.map((cat) => (
//           <button
//             key={cat.label}
//             onClick={() => setCategory(cat.value)}
//             className={`px-4 py-2 rounded-full text-sm font-medium border transition
//               ${
//                 category === cat.value
//                   ? "bg-yellow-500 text-black border-yellow-500"
//                   : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
//               }`}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       {/* ===== LIST ===== */}
//       <div className="space-y-3">
//         {notifications.length === 0 && !loading && (
//           <div className="bg-white rounded-xl p-8 text-center text-slate-500">
//             No notifications found
//           </div>
//         )}

//         {notifications.map((n) => {
//           const isUnread = !n.readAt;

//           return (
//             <div
//               key={n.notificationId}
//               className={`relative bg-white rounded-xl p-4 border transition
//                 ${
//                   isUnread
//                     ? "border-yellow-300 bg-yellow-50/60"
//                     : "border-slate-200"
//                 }`}
//             >
//               {isUnread && (
//                 <FaCircle className="absolute top-4 right-4 text-[8px] text-yellow-500" />
//               )}

//               <div className="flex flex-col gap-1">
//                 <p className="text-sm font-semibold text-slate-800">
//                   {n.title}
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   {n.message}
//                 </p>

//                 <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
//                   <span className="capitalize">{n.category}</span>
//                   <span>•</span>
//                   <span>
//                     {new Date(n.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ===== LOAD MORE ===== */}
// {hasMore && (
//         <div className="flex justify-center pt-4">
//           <button
//             disabled={loading}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-6 py-2 rounded-lg bg-[#090040] text-white text-sm
//                        hover:bg-[#12006b] transition disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "Load more"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;

import { useEffect, useState } from "react";
import { useBusiness } from "../context/BusinessContext";
import { apiGet } from "../services/api";
import { 
  FaCircle, 
  FaBell, 
  FaCheckCircle, 
  FaBox, 
  FaMoneyBillWave,
  FaTags,
  FaFilter,
  FaClock,
  FaInbox
} from "react-icons/fa";

const color = {
  primary: '#0B77A7',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const CATEGORIES = [
  { label: "All", value: "", icon: <FaBell /> },
  { label: "Orders", value: "order", icon: <FaBox /> },
  { label: "Refunds", value: "refund", icon: <FaMoneyBillWave /> },
  { label: "Catalog", value: "catalog", icon: <FaTags /> }
];

const Notifications = () => {
  const { businessId } = useBusiness();

  const [notifications, setNotifications] = useState([]);
  const [category, setCategory] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 20;

  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchNotifications = async (reset = false) => {
    setLoading(true);
    try {
      const res = await apiGet(
        `/seller/business/${businessId}/notifications`,
        {
          page,
          limit,
          category: category || undefined,
          unreadOnly: unreadOnly || undefined
        }
      );

      const data = res.data;

      setTotal(data.total);

      setNotifications((prev) => {
        const updated = reset
          ? data.notifications
          : [...prev, ...data.notifications];

        setHasMore(updated.length < data.total);
        return updated;
      });
    } catch (err) {
      console.error("Notification fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    setPage(1);
    fetchNotifications(true);
    // eslint-disable-next-line
  }, [category, unreadOnly]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(false);
    }
    // eslint-disable-next-line
  }, [page]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.readAt).length;

  // Get category icon
  const getCategoryIcon = (categoryValue) => {
    const cat = CATEGORIES.find(c => c.value === categoryValue);
    return cat?.icon || <FaBell />;
  };

  // Get category color
  const getCategoryColor = (categoryValue) => {
    const colors = {
      order: '#0B77A7',
      refund: '#f59e0b',
      catalog: '#8b5cf6',
      '': '#6b7280'
    };
    return colors[categoryValue] || colors[''];
  };

  // ================= UI =================
  return (
    <div className="animate-fade-in pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Stay updated with your business activities
          </p>
        </div>

        {/* Unread Filter Toggle */}
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${color.primary}15`, color: color.primary }}>
              <FaCircle className="text-[8px]" />
              <span className="text-xs font-bold">
                {unreadCount} unread
              </span>
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#0B77A7] cursor-pointer"
              style={{ accentColor: color.primary }}
            />
            <span className="text-sm font-semibold text-[#212121]">
              Show unread only
            </span>
          </label>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  category === cat.value
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={category === cat.value ? { backgroundColor: color.primary } : {}}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STATS BAR (Optional - Shows when filtered) */}
      {(category || unreadOnly) && (
        <div className="mb-6 bg-white border border-blue-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaFilter style={{ color: color.primary }} />
            <div>
              <p className="text-sm font-semibold text-[#212121]">
                Showing {notifications.length} of {total} notifications
              </p>
              <p className="text-xs text-gray-600">
                {category && `Category: ${CATEGORIES.find(c => c.value === category)?.label || 'All'}`}
                {category && unreadOnly && ' • '}
                {unreadOnly && 'Unread only'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCategory("");
              setUnreadOnly(false);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-all"
            style={{ color: color.primary }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {notifications.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${color.primary}15` }}>
              <FaInbox className="text-4xl" style={{ color: color.primary }} />
            </div>
            <p className="text-gray-500 font-semibold text-lg mb-1">No notifications found</p>
            <p className="text-gray-400 text-sm">
              {unreadOnly ? "You're all caught up! No unread notifications." : "Notifications will appear here"}
            </p>
          </div>
        )}

        {notifications.map((n) => {
          const isUnread = !n.readAt;
          const categoryColor = getCategoryColor(n.category);

          return (
            <div
              key={n.notificationId}
              className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md cursor-pointer group ${
                isUnread
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-100"
              }`}
              style={isUnread ? { backgroundColor: "#fff" } : {}}
            >
              {/* Unread Indicator */}
              {isUnread && (
                <div className="absolute top-5 right-5">
                  <div className="relative">
                    <FaCircle className="text-xs animate-pulse" style={{ color: color.primary }} />
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color.primary }}></div>
                  </div>
                </div>
              )}

              {/* Category Icon Badge */}
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: categoryColor }}
                >
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`text-sm font-bold ${isUnread ? 'text-[#212121]' : 'text-gray-700'}`}>
                      {n.title}
                    </h3>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {n.message}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      ></div>
                      <span className="capitalize font-semibold">{n.category}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <FaClock className="text-[10px]" />
                      <span>
                        {new Date(n.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {isUnread && (
                      <>
                        <span>•</span>
                        <span className="font-semibold" style={{ color: color.primary }}>
                          New
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOADING SKELETON */}
      {loading && notifications.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {hasMore && !loading && notifications.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: color.primary }}
          >
            <FaBell className="text-sm" />
            Load more notifications
          </button>
        </div>
      )}

      {/* LOADING MORE INDICATOR */}
      {loading && notifications.length > 0 && (
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <i className="pi pi-spin pi-spinner" style={{ color: color.primary }}></i>
            <span className="text-sm font-semibold text-gray-600">Loading more...</span>
          </div>
        </div>
      )}

      {/* END OF LIST */}
      {!hasMore && notifications.length > 0 && (
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <FaCheckCircle className="text-sm text-gray-500" />
            <span className="text-xs font-semibold text-gray-500">
              You've reached the end
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
