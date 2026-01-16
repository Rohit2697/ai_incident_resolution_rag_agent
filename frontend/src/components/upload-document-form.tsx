import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useNavigate } from 'react-router-dom';
type UploadDocumentFormProps = {
  user: string;
  setRefreshSideBar: Dispatch<SetStateAction<boolean>>;
};

export default function UploadDocuemtForm({user, setRefreshSideBar}: UploadDocumentFormProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [collection_name, setCollection_name] = useState<string | null>(null);
  const [fileChooseError, setFileChooseError] = useState('');
  const [collection_nameError, setCollection_nameError] = useState('');
  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [uploadDocumentError, setUploadDocumentError] = useState('');
  const in_porogress_handler = useRef<boolean>(false);
   const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const collection_name_input_Ref = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChoose = (e: ChangeEvent<HTMLInputElement>) => {
    setFileChooseError('');
    if (!e.target.files) return setFileChooseError('No file choosen!');
    if (!e.target.files?.[0].name.endsWith('.pdf'))
      return setFileChooseError('Only PDF file allowed!');
    setFile(e.target.files?.[0]);
  };

  useEffect(() => {
    if (!jobId) return;

    const check_job_result = async () => {
      setUploadDocumentError('');
      try {
        const res = await fetch(
          `http://localhost:8080/upload-docs-worker-result/${jobId}`,
          {
            method: 'GET',
          }
        );

        const result = await res.json();
        console.log(result);
        if (result.status == 'in_progress') {
          if (!in_porogress_handler.current) {
            setProgress(60);
            in_porogress_handler.current = true;
          }
          return;
        }
        if (result.status == 'failed') {
          console.log(result.error);
          setUploadDocumentError('Unable to Upload the docuemnt!');
          setUploading(false);
          if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
          }
        }
        if (result.status == 'finished') {
          setProgress(100);
          setTimeout(() => {
            setFile(null);
            setCollection_name(null);
            setJobId(null);
            setUploading(false);
            setRefreshSideBar(true);
            navigate(`/chat?collection_name=${collection_name}`);

            // setShowUpload(false)
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            if (collection_name_input_Ref.current) {
              collection_name_input_Ref.current.value = '';
            }
            if (timeRef.current) {
              clearInterval(timeRef.current);
              timeRef.current = null;
            }
          }, 1000);
        }
      } catch (err) {
        console.log(err);
        setUploading(false);
        setUploadDocumentError('Unable to Upload the docuemnt!');
      }
    };

    timeRef.current = setInterval(check_job_result, 2000);
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
        timeRef.current = null;
      }
    };
  }, [jobId]);

  const handleUpload = async () => {
    setUploadDocumentError('');
    setUploading(true);
    if (!file || !collection_name) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection_name', collection_name);
    formData.append('userId', user);
    try {
      const res = await fetch('http://localhost:8080/upload-document', {
        method: 'POST',
        body: formData,
      });
      const response = await res.json();
      if (res.status !== 200) {
        setUploading(false);
        return setUploadDocumentError(response.detail|| response.detail.message || 'Unable to Upload the docuemnt!');
      }
      setJobId(response.job_id);
      setProgress(30);
    } catch (err) {
      setUploading(false);
      console.log(err);
      setUploadDocumentError('Unable to Upload the docuemnt!');
    }
  };

  const handleCollectionNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCollection_nameError('');
    if (!e.target.value)
      return setCollection_nameError('Collection name is required!');
    setCollection_name(e.target.value);
  };

  return (
    <Card className="rounded-xl shadow-md">
      <div className="flex flex-col gap-4 p-4">
        {/* FILE INPUT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">PDF file</label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChoose}
            ref={fileInputRef}
            disabled={uploading}
          />
          {fileChooseError && (
            <p className="text-xs text-red-500">{fileChooseError}</p>
          )}
        </div>

        {/* COLLECTION NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Collection name</label>
          <Input
            type="text"
            placeholder="e.g. company_docs_2024"
            ref={collection_name_input_Ref}
            onChange={handleCollectionNameInput}
            disabled={uploading}
          />
          {collection_nameError && (
            <p className="text-xs text-red-500">{collection_nameError}</p>
          )}
        </div>

        {/* UPLOAD BUTTON */}
        {file && collection_name && (
          <Button
            onClick={handleUpload}
            type="button"
            className="mt-2 bg-violet-600 hover:bg-violet-700"
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload document'}
          </Button>
        )}

        {/* PROGRESS */}
        {uploading && jobId && (
          <div className="flex flex-col gap-1 pt-2">
            <Progress value={progress} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Job ID: {jobId}</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {/* ERROR */}
        {uploadDocumentError && (
          <p className="text-sm text-red-500 text-center">
            {uploadDocumentError}
          </p>
        )}
      </div>
    </Card>
  );
}
