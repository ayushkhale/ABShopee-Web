import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const color = {
  primary: '#2196F3',
  secondary: '#0057ae',
  background: '#F5F5F5',
  text: '#212121',
};

const FloatingNotification = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <button
        onClick={() => navigate("/dashboard/notifications")}
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
        style={{ backgroundColor: color.primary }}
        title="Notifications"
      >
        <FaBell className="text-xl" />

        {/* Unread badge */}
        {unreadCount > 0 ? (
          <span
            className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm" />
        )}
      </button>
    </div>
  );
};

export default FloatingNotification;
