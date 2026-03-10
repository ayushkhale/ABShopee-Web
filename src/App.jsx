import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import AddItem from "./pages/AddItem";
import Purchases from "./pages/Purchases";
import ProductDetails from "./pages/ProductDetails";
import ProductAttributes from "./pages/ProductAttributes";
import ProductMedia from "./pages/ProductMedia";
import CategoryManager from "./pages/CategoryManager";
import Orders from "./pages/Orders";
import Transactions from "./pages/Transactions";
import RegisterBusiness from "./pages/RegisterBusiness";
import Notifications from "./pages/Notifications";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomersPage from './pages/CustomersPage';
import CustomersListPage from './pages/CustomersListPage';
import Discounts from "./pages/Discounts";
import TaxSettings from "./pages/TaxSettings";
import CreateDiscount from "./pages/CreateDiscount";
import CreateTaxCode from "./pages/CreateTaxCode";
import CreateTaxRule from "./pages/CreateTaxRule";
import BusinessProfile from "./pages/BusinessProfile";
import PurchaseRowDetailedScreen from "./pages/PurchaseRowDetailedScreen";

// Placeholder
const Products = () => (
  <div className="p-4 text-2xl font-bold text-slate-400">
    Products Page (Coming Soon)
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-business" element={<RegisterBusiness />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id/attributes" element={<ProductAttributes />} />
          <Route path="product/:id/media" element={<ProductMedia />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="register-business" element={<RegisterBusiness />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="customers/bulk-import" element={<CustomersPage />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="discounts/create" element={<CreateDiscount />} />
          <Route path="tax" element={<TaxSettings />} />
          <Route path="tax/create" element={<CreateTaxCode />} />
          <Route path="tax-rule/create" element={<CreateTaxRule />} />
          <Route path="business-profile" element={<BusinessProfile />} />

          {/* added by ayush */}
          <Route path="purchase-item/:itemId" element={<PurchaseRowDetailedScreen />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;