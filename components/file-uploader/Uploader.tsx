"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {FileRejection, useDropzone} from "react-dropzone";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {
    RenderEmptyState, RenderErrorState,
    RenderUploadedState,
    RenderUploadingState
} from "@/components/file-uploader/RenderState";
import {toast} from "sonner";
import {v4 as uuidv4} from 'uuid'
import {useConstructUrl} from "@/hooks/use-construct-url";

const IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX_FILE_SIZE = 5000 * 1024 * 1024; // 5MB

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType?: "image" | "video";
}

interface iAppProps{
    value?: string;
     onChange?: (value: string) => void;
     fileTypeAccepted : "image" | "video";
}

const Uploader = ({onChange, value, fileTypeAccepted}:iAppProps) => {
    const fileUrl = useConstructUrl(value || '');

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        isDeleting: false,
        progress: 0,
        uploading: false,
        fileType: fileTypeAccepted,
        key: value,
        objectUrl: value ? fileUrl : undefined,
    });

    const uploadFile = useCallback(
        async (file: File) => {
            setFileState((prev) => ({
                ...prev,
                uploading: true,
                progress: 0,
            }));

            try {
                const presignedResponse = await fetch("/api/s3/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted === 'image',
                    }),
                });
                if (!presignedResponse.ok) {
                    toast.error("Failed to get presigned URL");
                    setFileState((prev) => ({
                        ...prev,
                        uploading: false,
                        progress: 0,
                        error: true,
                    }));

                    return;
                }
                const {url, key} = await presignedResponse.json();

                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentageCompleted = Math.round((event.loaded * 100) / event.total);
                            setFileState((prev) => ({
                                ...prev,
                                progress: percentageCompleted,
                            }));
                        }
                    }
                    xhr.onload = () => {
                        if (xhr.status === 200 || xhr.status === 204) {
                            setFileState((prev) => ({
                                ...prev,
                                progress: 100,
                                uploading: false,
                                key: key,
                            }));
                            onChange?.(key);
                            toast.success("File uploaded successfully");
                            resolve(xhr.response);
                        } else {
                            setFileState((prev) => ({
                                ...prev,
                                uploading: false,
                                progress: 0,
                                error: true,
                            }));
                            reject(new Error("Failed to upload file"));
                        }
                    }

                    xhr.onerror = () => {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 0,
                            error: true,
                        }));
                        reject(new Error("Failed to upload file"));
                    }

                    xhr.open("PUT", url);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file);
                });

            } catch (e) {
                console.log(e)
                toast.error("Failed to upload file");
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
            }
        }
    , [onChange, fileTypeAccepted]);


    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            setFileState({
                file: file,
                uploading: true,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: fileTypeAccepted,
            });

            uploadFile(file);
        }
    }, [fileState.objectUrl, uploadFile, fileTypeAccepted]);

    async function handleRemoveFile(){
        if(fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
               isDeleting: true,
            }));

            const response = await fetch(`/api/s3/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: fileState.key
                }),
            });

            if(!response.ok) {
                toast.error("Failed to remove file from storage");

                setFileState((prev) => ({
                    ...prev,
                    isDeleting: true,
                    error: true,
                }));
                return;
            }

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            onChange?.("");

            setFileState(() => ({
                file:null,
                uploading: false,
                progress:0,
                isDeleting: false,
                objectUrl: undefined,
                id: null,
                error:false,
                fileType: fileTypeAccepted,
            }));
            toast.success("File removed successfully");
        }catch{
            toast.error("Failed to remove file from storage, please try again");
            setFileState((prev) => ({
               ...prev,
                isDeleting: false,
                error: true,
            }));
        }
    }

    function rejectFile(fileRejection: FileRejection[]) {
        if (fileRejection.length > 0) {
            const tooManyFiles = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "too-many-files");
            const fileSizeTooBig = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "file-too-large"
            )
            const fileNotValid = fileRejection.find(
                file => file.errors.length > 0 && file.errors[0].code === "file-invalid-type"
            )

            if (tooManyFiles) {
                return (
                    // <RenderErrorState error={"Too many files"} />
                    toast.error("Too many files selected, max is one file.")
                )
            }

            if (fileSizeTooBig) {
                return (
                    // <RenderErrorState error={"Too many files"} />
                    toast.error(`File size exceeded max size of ${IMAGE_MAX_FILE_SIZE / 1024 / 1024} MB.`)
                )
            }

            if (fileNotValid) {
                toast.error(`Invalid file type. Only images are allowed.`)
            }
        }

    }

    function renderContent() {
        if(fileState.uploading) {
            return (
                <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />
            )
        }

        if(fileState.error) {
            return (
                <RenderErrorState error={"Failed to upload file"} />
            )
        }

        if(fileState.objectUrl) {
            return (
                <RenderUploadedState previewUrl={fileState.objectUrl}
                                     handleRemoveFile={handleRemoveFile}
                                     isDeleting={fileState.isDeleting}
                                     fileType={fileState.fileType as "image" | "video"}
                />
            )
        }

        return <RenderEmptyState isDragActive={isDragActive}/>
    }

    useEffect(() => {
        return () => {
            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        }
    },[fileState.objectUrl])

    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: fileTypeAccepted === 'video'? {'video/*':[]} : {"image/*": []},
            maxFiles: 1,
            multiple: false,
            maxSize: fileTypeAccepted === 'image' ? IMAGE_MAX_FILE_SIZE : VIDEO_MAX_FILE_SIZE,
            onDropRejected: rejectFile,
            disabled: fileState.uploading || !!fileState.objectUrl,
        }
    )

    return (
        <Card {...getRootProps()}
              className={cn("relative border-dashed border-2 transition-colors duration-200 ease-in-out w-full min-h-64",
                  isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'
              )}>
            <input {...getInputProps()} />
            <CardContent className={"flex items-center justify-center h-full w-full p-4 "}>
                {renderContent()}
            </CardContent>
        </Card>
    )
};

export default Uploader;
