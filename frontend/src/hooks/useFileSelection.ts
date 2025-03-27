import { useState } from "react";

const useFileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const addFile = (file: File) => {
    setSelectedFiles((prev) => [...prev, file]);
  };

  const removeFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  return [addFile, removeFile, selectedFiles] as const;
};

export default useFileSelection;
