import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';
import { userService, imageService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Image } from '../types/index';

type TabType = 'created' | 'saved';

export const UserProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchImages = async (page: number, tab: TabType) => {
    setLoading(true);
    try {
      let response;
      if (tab === 'created') {
        response = await userService.getCreatedImages(page, 20);
      } else {
        response = await userService.getSavedImages(page, 20);
      }
      setImages(response.images);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchImages(1, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentUser?.nguoi_dung_id]);

  const handlePageChange = (newPage: number) => {
    fetchImages(newPage, activeTab);
  };

  const handleDelete = async (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await imageService.delete(imageId);
      setImages((prev) => prev.filter((img) => img.hinh_id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-40 h-40 rounded-full flex-shrink-0 overflow-hidden bg-gray-200">
              {currentUser.anh_dai_dien ? (
                <img
                  src={getImageUrl(currentUser.anh_dai_dien)}
                  alt={currentUser.ho_ten}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-4xl font-semibold">
                  {currentUser.ho_ten.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser.ho_ten}
                </h1>
              </div>
              <p className="text-gray-600 mb-1">{currentUser.email}</p>
              {currentUser.tuoi && (
                <p className="text-gray-500 text-sm mb-4">
                  Age: {currentUser.tuoi}
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Log out
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'created'
                ? 'bg-pinterest-red text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('created')}
            >
              Created
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'saved'
                ? 'bg-pinterest-red text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pinterest-red"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <Icons.Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {activeTab === 'created'
                ? "You haven't created any images yet"
                : "You haven't saved any images yet"}
            </p>
            {activeTab === 'created' && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => navigate('/add-image')}
              >
                Upload your first image
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {images.map((image) => (
                <div
                  key={image.hinh_id}
                  className="break-inside-avoid mb-4 group relative cursor-pointer"
                  onClick={() => navigate(`/image/${image.hinh_id}`)}
                >
                  <div
                    className="w-full rounded-lg overflow-hidden relative bg-gray-200"
                    style={{ height: `${200 + Math.random() * 200}px` }}
                  >
                    <img
                      src={getImageUrl(image.duong_dan)}
                      alt={image.ten_hinh || ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex gap-2">
                        {activeTab === 'created' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleDelete(e, image.hinh_id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.ten_hinh || 'Untitled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${pagination.page === page
                        ? 'bg-pinterest-red text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
