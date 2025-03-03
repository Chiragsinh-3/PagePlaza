import { Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import useFilePreview from "@/hooks/useFilePreview";
import { Plus } from "lucide-react";

const { Dragger } = Upload;

interface DragAndDropProps {
  addFile: (file: File) => void;
  removeFile: (file: UploadFile) => void;
}

const DragAndDrop = ({ addFile, removeFile }: DragAndDropProps) => {
  const [handlePreview, previewContent] = useFilePreview() as [
    (file: UploadFile) => void,
    React.ReactNode
  ];

  const beforeUploadHandler = (file: File) => {
    addFile(file);
    return false;
  };

  return (
    <>
      <Dragger
        multiple={true}
        onRemove={removeFile}
        showUploadList={true}
        listType='picture-card'
        beforeUpload={beforeUploadHandler}
        onPreview={handlePreview}
        accept='image/*'
        className=''
      >
        <div className='flex items-center justify-center'>
          <p className='ant-upload-drag-icon '>
            <Plus />
          </p>
        </div>
        <p className='ant-upload-text'>
          Click this area or drag files to upload
        </p>
      </Dragger>
      <div className=''>{previewContent}</div>
    </>
  );
};

export default DragAndDrop;
