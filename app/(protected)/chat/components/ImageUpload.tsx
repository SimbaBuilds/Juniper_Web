'use client'

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageStorageService } from '@/app/lib/services/ImageStorageService';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  onImageRemoved: () => void;
  disabled?: boolean;
  userId: string;
  compact?: boolean;
  hasSelectedImage?: boolean;
}

export function ImageUpload({ 
  onImageSelected, 
  onImageRemoved, 
  disabled = false, 
  userId,
  compact = false,
  hasSelectedImage = false
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;

    console.log('🔄 ImageUpload: File selected', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Validate file type
    if (!ImageStorageService.isSupportedFileType(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size
    if (file.size > ImageStorageService.getFileSizeLimit()) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    // Start upload
    setIsUploading(true);

    try {
      console.log('🔄 ImageUpload: Starting upload');
      const uploadResult = await ImageStorageService.uploadChatImage(
        userId,
        file,
        `chat_image_${Date.now()}.${file.type.split('/')[1]}`
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      console.log('✅ ImageUpload: Upload successful', { imageUrl: uploadResult.imageUrl });
      
      // Notify parent component
      if (uploadResult.imageUrl) {
        onImageSelected(uploadResult.imageUrl);
      }

      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('❌ ImageUpload: Upload failed:', error);
      
      // Remove preview on error
      setSelectedImage(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Failed to upload image: ${errorMessage}`);
      
    } finally {
      setIsUploading(false);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    console.log('🔄 ImageUpload: Removing image');
    
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
    
    onImageRemoved();
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  // In compact mode, only show the button (no preview or guidelines)
  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleButtonClick}
          disabled={disabled || isUploading || hasSelectedImage}
          title={hasSelectedImage ? "Image already selected" : "Add image"}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
      </>
    );
  }

  // Full mode (original behavior)
  return (
    <div className="flex flex-col gap-2">
      {/* Image Preview */}
      {selectedImage && (
        <div className="relative inline-block">
          <img
            src={selectedImage}
            alt="Selected image"
            className="max-w-32 max-h-32 rounded-lg border border-border object-cover"
          />
          {!isUploading && (
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              {selectedImage ? 'Change Image' : 'Add Image'}
            </>
          )}
        </Button>
      </div>

      {/* Upload Guidelines */}
      <p className="text-xs text-muted-foreground">
        Supported: JPEG, PNG, GIF, WebP • Max size: 10MB
      </p>
    </div>
  );
}