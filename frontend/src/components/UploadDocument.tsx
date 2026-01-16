import UploadDocumentForm from "@/components/upload-document-form";
import type { Dispatch, SetStateAction } from "react";



type UploadDocumentProps = {
  user: string;
  setRefreshSideBar: Dispatch<SetStateAction<boolean>>;
};

export function UploadDocument({user, setRefreshSideBar}: UploadDocumentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Upload document</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a PDF to index it for chat
        </p>
      </div>

      <UploadDocumentForm setRefreshSideBar={setRefreshSideBar} user={user} />
    </div>
  );
}