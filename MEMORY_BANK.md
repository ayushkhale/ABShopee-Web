# 🧠 Project Memory Bank: TechElite Dashboard

## 📌 Project Summary
**TechElite** is a premium Seller Administration Dashboard designed for high-end tech catalog management. 
* **Tech Stack:** React JS (Vite), Tailwind CSS, PrimeReact.
* **Backend Base:** `http://localhost:9100`
* **Primary Business ID:** `da81a423-2230-4586-b47b-07268479cb24`

---

## 🏗️ System Architecture

### 1. Foundation & Routing
* **`main.jsx`**: The application root. Wraps the app in `PrimeReactProvider` and `BusinessProvider`.
* **`App.jsx`**: Centralizes navigation using `react-router-dom`. Implements a nested route strategy where all pages render within the `DashboardLayout`.
* **`layout/DashboardLayout.jsx`**: The global shell. Features a responsive sidebar, a "glassmorphism" sticky header, and a global Hero Banner.

### 2. State Management (`context/BusinessContext.jsx`)
* **Global Context:** Provides `businessId`, `globalCategories`, and a `refreshTrigger` mechanism to sync data across different pages (e.g., updating categories in the manager reflects on the home page).

### 3. API & Networking (`services/api.js`)
* **Axios Client:** Centralized instance with a 10s timeout.
* **Interceptors:** * *Request:* Prepared for Bearer Token injection.
    * *Response:* Global error logging and Promise rejection.
* **Method Wrappers:** Clean exports for `apiGet`, `apiPost`, `apiPut`, and `apiDelete`.

---

## 🛠️ Feature Directory

### 📦 Inventory & Products
* **`DashboardHome.jsx`**: The hub. Displays product stats and a searchable/filterable `DataView` (Grid/List). Includes an inline **Add Inventory** modal.
* **`AddItem.jsx`**: Step-one product creation. Handles basic info, pricing (INR), and initial category assignment with JSON metadata support.
* **`ProductDetails.jsx`**: High-end product showcase. Features a sticky image gallery and tabbed interface for Specs, Description, and Warranty.

### ⚙️ Technical Management
* **`CategoryManager.jsx`**: A Master-Detail interface using a checkbox tree to assign products to various business categories.
* **`ProductAttributes.jsx`**: A dynamic, schema-based form builder. It renders inputs based on data types (`enum`, `boolean`, `json`, `array`) and tracks "dirty" changes for optimized saving.
* **`ProductMedia.jsx`**: A specialized upload module. Supports **Primary** cover images and **Gallery** (Images/Video) uploads using `FormData` and `onUploadProgress` tracking.

---

## 🎨 Design System
* **Colors:** Deep Navy (`#1a1a2e`), Elite Gold (`#daa520`), Mint Emerald, and Soft Gray backgrounds.
* **UI Components:** Heavy reliance on **PrimeReact** for complex inputs (TreeSelect, InputNumber, DataView) and **React-Icons** for visual cues.
* **UX Patterns:** * Floating Action Bars for unsaved changes.
    * Skeleton screens for perceived performance.
    * Indian Locale (`en-IN`) for currency formatting.

---

## 📋 Roadmap & Placeholders
* **Orders Page:** Route defined, component pending logic.
* **Analytics:** Section icon present, module pending.
* **Auth Flow:** Logic structured in `api.js` interceptors but currently commented out.

---
*Last Updated: 2026-02-03*