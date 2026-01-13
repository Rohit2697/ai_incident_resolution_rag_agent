import { UploadDocument } from "@/components/UploadDocument";


export default function UploadDocumentPage() {
  return (
    <div className="h-full flex justify-center px-6 pt-16">
      {/* Content column */}
      <div className="w-full max-w-2xl">
        <UploadDocument />
      </div>
    </div>
  );
}
