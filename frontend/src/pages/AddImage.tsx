import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Icons } from '../components/ui/Icon';
import { imageService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const AddImage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (title.trim()) {
        formData.append('ten_hinh', title.trim());
      }
      if (description.trim()) {
        formData.append('mo_ta', description.trim());
      }

      const response = await imageService.upload(formData);
      navigate(`/image/${response.image.hinh_id}`);
    } catch (error) {
      const err = error as { response?: { data?: { message: string } } };
      setError(
        err.response?.data?.message || 'Failed to upload image. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Pin</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-8">
          {/* Upload Zone */}
          <div className="w-[480px]">
            <div
              className={`w-full h-[500px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-colors ${
                previewUrl
                  ? 'border-pinterest-red bg-gray-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'
              }`}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Icons.Upload className="w-16 h-16 text-pinterest-red" />
                  <p className="text-lg font-semibold text-gray-900">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Panel */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Add your title
              </label>
              <Input
                placeholder="e.g. Sunset Photography"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/255 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tell everyone what your Pin is about
              </label>
              <TextArea
                placeholder="Add a detailed description..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publishing...
                  </div>
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
