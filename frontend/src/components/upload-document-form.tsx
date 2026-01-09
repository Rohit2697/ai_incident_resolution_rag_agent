import { useState } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"


export default function UploadDocuemtForm(){
    const [file,setFile]=useState<File|null>(null)
    const [jobId,setJobId]=useState<string|null>(null)
    const [collection_name,setCollection_name]=useState<string|null>(null)
    const handleUpload=async()=>{

       if(!file || !collection_name) return

       const formData=new FormData()
       formData.append("file",file)
       formData.append("collection_name",collection_name)

        const res=await fetch("http://localhost:8080/upload-document",{
            method:"POST",
            body:formData
        })
        const response=await res.json()
        setJobId(response.job_id)

    }


    return(
        <Card>
            <Input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)}/>
            <Input type="text" placeholder="enter your collection name..."
             onChange={(e)=>setCollection_name(e.target.value||null)}/>
            <Button onClick={handleUpload} type="button" variant="outline">upload</Button>
            {/* need to complete this component */}
        </Card>
    )

}