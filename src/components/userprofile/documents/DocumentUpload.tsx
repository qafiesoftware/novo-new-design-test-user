// import React, { useState } from "react";
// import Image from "next/image";
// import { X } from "lucide-react";
// interface DocumentUploadProps {
//   title: string;
//   preview?: string;
//   onChange?: (file: File) => void;
//   required?: boolean;
//   type?: string;
// }

// const DocumentUpload: React.FC<DocumentUploadProps> = ({
//   title,
//   preview,
//   onChange,
//   required = false,
//   type = "image/*",
// }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [localPreview, setLocalPreview] = useState<string | null>(preview ?? null);

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const uploaded = e.target.files?.[0];
//     if (!uploaded) return;

//     setFile(uploaded);
//     const previewUrl = URL.createObjectURL(uploaded);

//     setLocalPreview(previewUrl);
//     onChange?.(uploaded);
//   };

//   const removeFile = () => {
//     setFile(null);
//     setLocalPreview(null);
//   };

//   return (
//     <div className="w-full space-y-2">
//       <p className="text-sm font-medium dark:text-white">{title}</p>

//       {!localPreview ? (
//         <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition hover:bg-gray-50">
//           <span className="text-sm text-gray-500">Upload {title} document</span>

//           <input
//             type="file"
//             className="hidden"
//             accept={type}
//             required={required}
//             onChange={handleFile}
//           />
//         </label>
//       ) : (
//         <div className="relative w-full rounded-xl border bg-white p-3 shadow-sm">
//           <Image
//             src={localPreview}
//             alt="preview"
//             width={500}
//             height={200}
//             className="h-40 w-full rounded-lg object-contain"
//           />

//           <div className="mt-2 flex items-center justify-between">
//             <p className="truncate text-xs">{file?.name || `${title} document`}</p>

//             <div className="flex items-center gap-2">
//               <X onClick={removeFile} className="h-5 w-5 cursor-pointer text-red-500" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentUpload;

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface DocumentUploadProps {
  title: string;
  preview?: string;
  onChange?: (file: File | null) => void; // FIX: null allow karo
  required?: boolean;
  maxSizeMB?: number; // FIX: 10MB support
  acceptPdf?: boolean; // FIX: PDF support
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  preview,
  onChange,
  required = false,
  maxSizeMB = 10,
  acceptPdf = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(preview ?? null);
  const [sizeError, setSizeError] = useState<string>("");

  const acceptTypes = acceptPdf
    ? "image/jpeg,image/png,image/webp,application/pdf"
    : "image/jpeg,image/png,image/webp";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    // FIX: size validation
    if (uploaded.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`File must be under ${maxSizeMB}MB.`);
      return;
    }

    setSizeError("");
    setFile(uploaded);

    const isPdf = uploaded.type === "application/pdf";
    setLocalPreview(isPdf ? null : URL.createObjectURL(uploaded)); // PDF ka preview image nahi hoga
    onChange?.(uploaded);
  };

  const removeFile = () => {
    setFile(null);
    setLocalPreview(null);
    setSizeError("");
    onChange?.(null); // FIX: parent ko null bhejo taaki fileFront = null ho
  };

  const hasContent = !!localPreview || !!file;

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-medium dark:text-white">{title}</p>

      {!hasContent ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition hover:bg-gray-50">
          <span className="text-sm text-gray-500">Upload {title} document</span>
          <input
            type="file"
            className="hidden"
            accept={acceptTypes}
            required={required}
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="relative w-full rounded-xl border bg-white p-3 shadow-sm">
          {localPreview ? (
            <Image
              src={localPreview}
              alt="preview"
              width={500}
              height={200}
              className="h-40 w-full rounded-lg object-contain"
            />
          ) : (
            // PDF selected — no image preview
            <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
               {file?.name}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <p className="truncate text-xs">{file?.name || `${title} document`}</p>
            <X onClick={removeFile} className="h-5 w-5 cursor-pointer text-red-500" />
          </div>
        </div>
      )}

      {sizeError && <p className="text-xs text-red-500">{sizeError}</p>}
    </div>
  );
};

export default DocumentUpload;
