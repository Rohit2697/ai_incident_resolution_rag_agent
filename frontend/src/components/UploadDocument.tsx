import UploadDocumentForm from "@/components/upload-document-form";



// type UploadDocumentProps = {
  
//   setShowUpload: Dispatch<SetStateAction<boolean>>;
// };

export function UploadDocument() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Upload document</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a PDF to index it for chat
        </p>
      </div>

      <UploadDocumentForm />
    </div>
  );
}