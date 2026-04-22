import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';
import { imageService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Image as ImageType } from '../types/index';

export const HomeFeed = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchImages = async (searchTerm: string = '') => {
    setLoading(true);
    try {
      const response = await imageService.getAll(1, 50, searchTerm);
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchImages(searchInput);
  };

  const getRandomHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 400, 450];
    return heights[index % heights.length];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-8">
          <h1
            className="text-2xl font-bold text-pinterest-red cursor-pointer"
            onClick={() => navigate('/')}
          >
            CLGP-CAPSTONE
          </h1>
          <form onSubmit={handleSearch} className="hidden md:block w-96">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-pinterest-red/50 transition-colors"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/add-image')}
              >
                Create
              </Button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Icons.Bell className="w-6 h-6 text-gray-700" />
              </button>
              <div
                className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                onClick={() => navigate('/profile')}
              >
                {user.anh_dai_dien ? (
                  <img
                    src={getImageUrl(user.anh_dai_dien)}
                    alt={user.ho_ten}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-semibold">
                    {user.ho_ten?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Masonry Grid Container */}
      <div className="pt-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pinterest-red"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No images found</p>
              {search && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    fetchImages('');
                  }}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.hinh_id}
                  className="break-inside-avoid mb-4 group relative cursor-pointer"
                  onClick={() => navigate(`/image/${image.hinh_id}`)}
                >
                  <div
                    className="w-full rounded-lg overflow-hidden relative bg-gray-200"
                    style={{ height: `${getRandomHeight(index)}px` }}
                  >
                    <img
                      src={getImageUrl(image.duong_dan)}
                      alt={image.ten_hinh || ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Save image logic
                        }}
                      >
                        Save
                      </Button>
                      <button
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icons.Share2 className="w-5 h-5 text-gray-900" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.ten_hinh || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-600">
                      by {image.nguoi_dung.ho_ten}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
