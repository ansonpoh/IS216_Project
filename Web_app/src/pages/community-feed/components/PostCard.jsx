import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (newComment?.trim()) {
      onComment(post?.id, newComment);
      setNewComment('');
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 animate-fade-in">
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <Image
          src={post?.author?.avatar}
          alt={post?.author?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground">{post?.author?.name}</h3>
            {post?.author?.verified && (
              <Icon name="CheckCircle" size={16} className="text-primary" />
            )}
            {post?.author?.badge && (
              <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full">
                {post?.author?.badge}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{formatTimeAgo(post?.timestamp)}</span>
            {post?.location && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{post?.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-foreground mb-3 leading-relaxed">{post?.content}</p>
        
        {post?.image && (
          <div className="rounded-lg overflow-hidden mb-3">
            <Image
              src={post?.image}
              alt="Post image"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Impact Metrics */}
        {post?.metrics && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-1 mb-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Impact Achieved</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {post?.metrics?.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-primary">{metric?.value}</div>
                  <div className="text-xs text-muted-foreground">{metric?.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {post?.tags && post?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Engagement Stats */}
      <div className="flex items-center space-x-6 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Heart" size={14} className="text-destructive" />
          <span>{post?.likes} likes</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="MessageCircle" size={14} />
          <span>{post?.comments?.length} comments</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Share2" size={14} />
          <span>{post?.shares} shares</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post?.id)}
          className={`flex items-center space-x-2 ${post?.isLiked ? 'text-destructive' : ''}`}
        >
          <Icon name={post?.isLiked ? "Heart" : "Heart"} size={16} />
          <span>Like</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2"
        >
          <Icon name="MessageCircle" size={16} />
          <span>Comment</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(post?.id)}
          className="flex items-center space-x-2"
        >
          <Icon name="Share2" size={16} />
          <span>Share</span>
        </Button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          {/* Existing Comments */}
          <div className="space-y-3 mb-4">
            {post?.comments?.map((comment) => (
              <div key={comment?.id} className="flex space-x-3">
                <Image
                  src={comment?.author?.avatar}
                  alt={comment?.author?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="font-medium text-sm text-foreground">
                      {comment?.author?.name}
                    </div>
                    <p className="text-sm text-foreground">{comment?.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatTimeAgo(comment?.timestamp)}</span>
                    <button className="hover:text-foreground">Like</button>
                    <button className="hover:text-foreground">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="flex space-x-3">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-muted border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="sm" disabled={!newComment?.trim()}>
                <Icon name="Send" size={14} />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;