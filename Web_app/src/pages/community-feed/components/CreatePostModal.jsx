import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postData, setPostData] = useState({
    content: '',
    type: 'story',
    image: null,
    location: '',
    tags: [],
    metrics: []
  });
  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const postTypeOptions = [
    { value: 'story', label: 'Impact Story' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'opportunity', label: 'Opportunity Share' },
    { value: 'photo', label: 'Photo Story' },
    { value: 'milestone', label: 'Milestone' }
  ];

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e?.target?.result);
        setPostData(prev => ({ ...prev, image: e?.target?.result }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag?.trim() && !postData?.tags?.includes(newTag?.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev?.tags, newTag?.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev?.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (postData?.content?.trim()) {
      onSubmit(postData);
      setPostData({
        content: '',
        type: 'story',
        image: null,
        location: '',
        tags: [],
        metrics: []
      });
      setImagePreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Share Your Story</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
              alt="Your avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-foreground">Alex Johnson</div>
              <div className="text-sm text-muted-foreground">Community Volunteer</div>
            </div>
          </div>

          {/* Post Type */}
          <Select
            label="Post Type"
            options={postTypeOptions}
            value={postData?.type}
            onChange={(value) => setPostData(prev => ({ ...prev, type: value }))}
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Share your story *
            </label>
            <textarea
              value={postData?.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e?.target?.value }))}
              placeholder="What impact did you make? Share your volunteer experience..."
              className="w-full h-32 px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Add Photo
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setPostData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ) : (
                <div>
                  <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <Input
            label="Location (Optional)"
            type="text"
            value={postData?.location}
            onChange={(e) => setPostData(prev => ({ ...prev, location: e?.target?.value }))}
            placeholder="Where did this happen?"
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e?.target?.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {postData?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/70"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Impact Metrics (for achievements) */}
          {postData?.type === 'achievement' && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-3">Impact Metrics (Optional)</h3>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Hours"
                  type="number"
                  placeholder="0"
                />
                <Input
                  label="People Helped"
                  type="number"
                  placeholder="0"
                />
                <Input
                  label="Events"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={16} />
                <span>Public</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Globe" size={16} />
                <span>Anyone can see this</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!postData?.content?.trim()}>
                Share Story
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;