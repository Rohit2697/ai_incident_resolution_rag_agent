import { UploadDocument } from "@/components/UploadDocument";
import type { Dispatch, SetStateAction } from "react";

type UploadDocumentPageProps = {
  setRefreshSideBar:Dispatch<SetStateAction<boolean>>;
  user:string
};
export default function UploadDocumentPage({user, setRefreshSideBar}: UploadDocumentPageProps) {
  return (
    <div className="h-full flex justify-center px-6 pt-16">
      {/* Content column */}
      <div className="w-full max-w-2xl">
        <UploadDocument setRefreshSideBar={setRefreshSideBar} user={user}/>
      </div>
    </div>
  );
}
