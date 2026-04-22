import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icons } from '../components/ui/Icon';
import { userService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const EditProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setName(currentUser.ho_ten || '');
    setAge(currentUser.tuoi?.toString() || '');
    setAvatarPreview(currentUser.anh_dai_dien || '');
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const formData = new FormData();
      let hasChanges = false;

      if (name.trim() && name.trim() !== currentUser?.ho_ten) {
        formData.append('ho_ten', name.trim());
        hasChanges = true;
      }

      if (age && parseInt(age) !== currentUser?.tuoi) {
        const ageNum = parseInt(age);
        if (ageNum > 0 && ageNum <= 120) {
          formData.append('tuoi', ageNum.toString());
          hasChanges = true;
        } else {
          setMessage({ type: 'error', text: 'Age must be between 1 and 120' });
          setSaving(false);
          return;
        }
      }

      if (avatarFile) {
        formData.append('image', avatarFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        setMessage({ type: 'error', text: 'No changes to save' });
        setSaving(false);
        return;
      }

      const response = await userService.updateProfile(formData);
      updateUser(response.user); // update the context with the new user data
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      navigate('/profile', { replace: true });
    } catch (error) {
      const err = error as { response?: { data?: { message: string } } };
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Navigation */}
      <div className="w-60 bg-gray-50 p-6 space-y-2">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

        <button className="w-full flex items-center gap-3 px-3 py-3 bg-pinterest-red text-white rounded-lg font-medium">
          <Icons.User className="w-5 h-5" />
          Public Profile
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-3 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-100">
          <Icons.Settings className="w-5 h-5" />
          Account Settings
        </button>

        <button
          className="w-full flex items-center gap-3 px-3 py-3 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-100"
          onClick={logout}
        >
          <Icons.LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 max-w-3xl">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">Public Profile</h1>

          {message && (
            <div
              className={`p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : message.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Photo Section */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarFile ? avatarPreview : getImageUrl(avatarPreview)}
                  alt={currentUser.ho_ten}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-2xl font-semibold">
                  {currentUser.ho_ten?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-4 py-2 text-sm cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Upload a new profile picture (JPEG, PNG, WebP)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min={1}
              max={120}
            />

            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
