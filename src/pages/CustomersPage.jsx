import { useState, useRef } from "react";
import apiClient from "../services/api";
import { useBusiness } from "../context/BusinessContext";

// Icons
import {
  FaUsers,
  FaFileUpload,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaFileCsv,
} from "react-icons/fa";

// PrimeReact
import { Button }     from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toast }      from "primereact/toast";
import { Tag }        from "primereact/tag";
import { Divider }    from "primereact/divider";

const CustomersPage = () => {
  const { businessId } = useBusiness();
  const toast           = useRef(null);
  const fileUploadRef   = useRef(null);

  const [uploading,   setUploading]   = useState(false);
  const [uploadDone,  setUploadDone]  = useState(false);
  const [resultFile,  setResultFile]  = useState(null); // { url, filename }

  // ------------------------------------------------------------------ //
  //  Bulk Upload Handler
  // ------------------------------------------------------------------ //
  const handleBulkUpload = async (event) => {
    const file = event.files?.[0];

    if (!file) {
      toast.current?.show({
        severity: "warn",
        summary: "No File",
        detail: "Please select a CSV or Excel file.",
      });
      return;
    }

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      toast.current?.show({
        severity: "error",
        summary: "Invalid File",
        detail: "Only CSV or .xlsx files are accepted.",
      });
      fileUploadRef.current?.clear();
      return;
    }

    setUploading(true);
    setUploadDone(false);
    setResultFile(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/seller/business/${businessId}/customers/bulk/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      // ---- Extract filename from Content-Disposition header ----
      let filename = "customers_bulk_result.csv";
      const cd = response.headers["content-disposition"];
      if (cd) {
        const match = cd.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      // ---- Create object URL for download ----
      const blob    = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
//ye download button vala he
    //   setResultFile({ url: blobUrl, filename });
    //   setUploadDone(true);

    //   toast.current?.show({
    //     severity: "success",
    //     summary: "Upload Complete",
    //     detail: "Customers processed. Download the result file below.",
    //   });

// Auto download immediately
const a = document.createElement("a");
a.href = blobUrl;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
window.URL.revokeObjectURL(blobUrl);

toast.current?.show({
  severity: "success",
  summary: "Upload Complete",
  detail: "Customers processed! Result file downloaded automatically.",
});

    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Upload Failed",
        detail: error?.response?.data?.message || error.message || "Something went wrong.",
      });
    } finally {
      setUploading(false);
      fileUploadRef.current?.clear();
    }
  };

  // ------------------------------------------------------------------ //
  //  Download Result File
  // ------------------------------------------------------------------ //
  const downloadResult = () => {
    if (!resultFile) return;
    const a     = document.createElement("a");
    a.href      = resultFile.url;
    a.download  = resultFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ------------------------------------------------------------------ //
  //  Download Sample CSV Template
  // ------------------------------------------------------------------ //
  const downloadSampleCsv = () => {
    const header = "identifier,type\n";
    const rows   = [
      "customer@example.com,retail",
      "9876543210,wholesale",
      "distributor@firm.com,distributor",
    ].join("\n");

    const blob    = new Blob([header + rows], { type: "text/csv" });
    const url     = window.URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = "customers_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ------------------------------------------------------------------ //
  //  Render
  // ------------------------------------------------------------------ //
  return (
    <div className="animate-fade-in pb-10">
      <Toast ref={toast} />

      {/* ---- Page Header ---- */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
          <FaUsers />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Bulk import wholesale, retail & distributor customers
          </p>
        </div>
      </div>

      {/* ---- Main Card ---- */}
      <div className="bg-white rounded-[28px] border border-[#e8ecf0] shadow-sm p-8 max-w-2xl">

        {/* How-it-works info strip */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
          <FaInfoCircle className="text-blue-400 mt-0.5 shrink-0 text-lg" />
          <div className="text-sm text-blue-700 space-y-1">
            <p className="font-bold">How bulk import works</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-600 text-xs">
              <li>Upload a CSV / Excel file with <code className="bg-blue-100 px-1 rounded">identifier</code> (email or Indian mobile) and optional <code className="bg-blue-100 px-1 rounded">type</code> column.</li>
              <li>Existing users are linked to your business automatically.</li>
              <li>New users get a temporary password and an onboarding email.</li>
              <li>A result file is downloaded with per-row success / failure details.</li>
            </ul>
          </div>
        </div>

        {/* Supported columns table */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Supported Columns
          </p>
          <div className="border border-[#e8ecf0] rounded-2xl overflow-hidden text-sm">
            <div className="grid grid-cols-3 bg-gray-50 px-4 py-2 font-bold text-gray-600 text-xs">
              <span>Column</span>
              <span>Required</span>
              <span>Description</span>
            </div>
            <Divider className="!my-0" />
            <div className="grid grid-cols-3 px-4 py-3 text-xs text-gray-700 border-b border-[#f0f0f0]">
              <code className="text-purple-600 font-bold">identifier</code>
              <span className="text-emerald-600 font-bold">✅ Yes</span>
              <span>Email or Indian mobile number</span>
            </div>
            <div className="grid grid-cols-3 px-4 py-3 text-xs text-gray-700">
              <code className="text-purple-600 font-bold">type</code>
              <span className="text-gray-400">Optional</span>
              <span>
                <Tag value="retail"       severity="info"    className="!text-[10px] !px-2 mr-1" />
                <Tag value="wholesale"    severity="warning" className="!text-[10px] !px-2 mr-1" />
                <Tag value="distributor" severity="success" className="!text-[10px] !px-2" />
              </span>
            </div>
          </div>
        </div>

        {/* Sample CSV Download */}
        <Button
          label="Download Sample CSV Template"
          icon={<FaFileCsv className="mr-2" />}
          onClick={downloadSampleCsv}
          className="!bg-gray-100 !text-gray-600 !border-none !rounded-xl !text-xs !font-bold !px-5 !py-2.5 hover:!bg-gray-200 mb-6 transition-all"
        />

        <Divider />

        {/* Upload Zone */}
        <div className="mt-4">
          <p className="text-sm font-bold text-[#1a1a2e] mb-3">
            Upload Customer File
          </p>

          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            accept=".csv,.xlsx"
            maxFileSize={10_000_000}
            customUpload
            uploadHandler={handleBulkUpload}
            auto={false}
            chooseLabel={uploading ? "Uploading…" : "Choose CSV / Excel File"}
            uploadLabel="Upload Now"
            className="w-full"
            chooseOptions={{
              icon: <FaFileUpload className="mr-2" />,
              className: `!w-full !bg-indigo-600 !text-white !border-none !rounded-xl !text-sm !font-bold !px-6 !py-3 hover:!bg-indigo-700 transition-all ${uploading ? "!opacity-60 !pointer-events-none" : ""}`,
            }}
            uploadOptions={{
              className: "hidden", // auto=false hone par yeh hide karo; button manually trigger nahi chahiye
            }}
            disabled={uploading}
          />

          <p className="text-xs text-gray-400 mt-2">
            Max file size: 10 MB &nbsp;·&nbsp; Accepted: .csv, .xlsx
          </p>
        </div>

        {/* Result Download */}
        {uploadDone && resultFile && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-emerald-500 text-xl shrink-0" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">
                  Processing complete!
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Download the result file to see per-row success &amp; failure details.
                </p>
              </div>
            </div>
            <Button
              label="Download Result"
              icon={<FaDownload className="mr-2" />}
              onClick={downloadResult}
              className="!bg-emerald-600 !border-none !rounded-xl !text-xs !font-bold !px-5 !py-2.5 shrink-0 shadow-md hover:!bg-emerald-700 transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;