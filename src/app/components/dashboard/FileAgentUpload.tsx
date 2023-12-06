import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';
import React, { useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  image: string;
}

const FileAgentUpload: React.FC<FileUploadProps> = ({ onFileChange, image }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log(image);
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
  
    if (file) {
      const userConfirmed = window.confirm('آیا می‌خواهید این عکس را بارگذاری کنید؟');
  
      if (userConfirmed) {
        try {
          const token = GetToken();
          const formData = new FormData();
          formData.append('photo', file);
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/set-photo-agent`, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            onFileChange(file);
            setSelectedFile(file);
          } else {
            console.error('خطا در بارگذاری عکس:', response.statusText);
          }
        } catch (error) {
          console.error('خطا در بارگذاری عکس:', error);
        }
      } else {
        // کاربر بارگذاری را رد کرد
        onFileChange(null);
      }
    }
  };
  

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div className="flex items-center flex-col gap-2">
      <div className="flex-shrink-0 w-16 h-16 relative">
        {selectedFile ? (
          <>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="پیش‌نمایش"
              className="w-full h-full object-cover rounded-full"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 w-[20px] h-[20px] p-1 text-xs bg-red-500 text-white rounded-full"
            >
              X
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full">
            {image && <Image loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`} alt="profile photo" width={100} height={100} className="w-full h-full object-cover rounded-full"/>}
          </div>
        )}
      </div>

      <label className="flex items-center justify-center  text-xs px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFile ? 'تغییر عکس' : 'بارگذاری عکس'}
      </label>
    </div>
  );
};

export default FileAgentUpload;
