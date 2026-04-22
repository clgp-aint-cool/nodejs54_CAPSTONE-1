import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Icons } from '../components/ui/Icon';
import { imageService, commentService, savedService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Image as ImageType, Comment } from '../types/index';

export const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [image, setImage] = useState<ImageType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchImageAndComments(parseInt(id));
    }
  }, [id]);

  const fetchImageAndComments = async (imageId: number) => {
    setLoading(true);
    try {
      const [imageRes, commentsRes] = await Promise.all([
        imageService.getById(imageId),
        commentService.getByImageId(imageId),
      ]);
      setImage(imageRes.image);
      setComments(commentsRes.comments);

      if (user) {
        const savedRes = await savedService.checkSaved(imageId);
        setIsSaved(savedRes.saved);
      }
    } catch (error) {
      console.error('Failed to fetch image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await savedService.unsave(parseInt(id!));
        setIsSaved(false);
      } else {
        await savedService.save(parseInt(id!));
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await commentService.add(parseInt(id!), commentText.trim());
      setComments([res.comment, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentService.delete(commentId);
      setComments(comments.filter((c) => c.binh_luan_id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    return user && comment.nguoi_dung.nguoi_dung_id === user.nguoi_dung_id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pinterest-red"></div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Image not found</h1>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left - Large Image */}
      <div className="hidden lg:block w-[640px] p-8">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <img
            src={getImageUrl(image.duong_dan)}
            alt={image.ten_hinh || ''}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right - Details Panel */}
      <div className="flex-1 max-w-[560px] p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {image.ten_hinh || 'Untitled'}
            </h1>
            {image.mo_ta && (
              <p className="text-gray-600 text-lg">{image.mo_ta}</p>
            )}
          </div>

          {/* Uploader Info */}
          <div className="flex items-center gap-3">
            <Avatar
              size="lg"
              fallback={image.nguoi_dung.ho_ten.charAt(0)}
              className="bg-gray-300"
              src={getImageUrl(image.nguoi_dung.anh_dai_dien)}
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {image.nguoi_dung.ho_ten}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
            {user?.nguoi_dung_id !== image.nguoi_dung.nguoi_dung_id && (
              <Button variant="outline" size="sm">
                Follow
              </Button>
            )}
          </div>

          {/* Saved Status */}
          {isSaved && (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
              <Icons.Bookmark className="w-4 h-4 text-pinterest-red fill-current" />
              <span className="text-sm font-medium text-red-700">
                Saved to your collection
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSaveToggle}
              disabled={saving}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isSaved ? (
                'Saved'
              ) : (
                'Save'
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                navigator.share?.({
                  title: image.ten_hinh,
                  text: image.mo_ta,
                  url: window.location.href,
                });
              }}
            >
              <Icons.Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <Avatar
                    size="sm"
                    fallback={user.ho_ten.charAt(0)}
                    className="bg-gray-300 flex-shrink-0"
                    src={getImageUrl(user.anh_dai_dien)}
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-pinterest-red"
                      rows={2}
                      maxLength={255}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={!commentText.trim() || submittingComment}
                      >
                        {submittingComment ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">
                  Log in to add a comment
                </p>
                <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                  Log in
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.binh_luan_id} className="flex gap-3">
                    <Avatar
                      size="sm"
                      fallback={comment.nguoi_dung.ho_ten.charAt(0)}
                      className="bg-gray-300 flex-shrink-0"
                      src={getImageUrl(comment.nguoi_dung.anh_dai_dien)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-900">
                          {comment.nguoi_dung.ho_ten}
                        </p>
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.binh_luan_id)
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Icons.X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600">{comment.noi_dung}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.ngay_binh_luan).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* More Like This */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">More like this</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* TODO: Fetch related images */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-40 h-30 flex-shrink-0 bg-gray-200 rounded-lg cursor-pointer"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
