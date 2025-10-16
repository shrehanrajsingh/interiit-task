import { FaThumbsUp } from "react-icons/fa";
import {
  FaXmark,
  FaReply,
  FaAngleDown,
  FaAngleUp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Roboto } from "next/font/google";

const robotoFont = Roboto({
  subsets: ["latin"],
});

/**
 * Typescript interface for data
 * given in users.json
 */
type User = {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
};

/**
 * Typescript type for data
 * given in comments.json
 */
type Comment = {
  id: number;
  parent_id: number | null;
  text: string;
  upvotes: number;
  created_at: string;
  user_id: string;
};

/**
 * This is a nested tree structure
 * Where the value node is `Comment`
 * and replies refer to children
 */
type CommentWithUser = Comment & {
  user: User;
  replies: CommentWithUser[];
};

/**
 * Metadata for a comment pane
 */
interface CommentProps {
  isOpen: boolean;
  onClose: () => void;
  comments: any[];
  users: any[];
}

export default function CommentSection({
  isOpen,
  onClose,
  comments,
  users,
}: CommentProps) {
  const [cTree, setCTree] = useState<CommentWithUser[]>([]);
  const [newComment, setNC] = useState("");
  const [replyingTo, setRT] = useState<number | null>(null);

  const buildCommentTree = () => {
    const usersMap: Record<string, User> = {};
    users.forEach((user: User) => {
      usersMap[user.id] = user;
    });

    const commentsMap: Record<number, CommentWithUser> = {};

    const enhancedComments = comments.map((comment: Comment) => {
      const commentWithUser = {
        ...comment,
        user: usersMap[comment.user_id] || {
          id: "unknown",
          name: "Anonymous",
          avatar: "https://i.pravatar.cc/150?img=0",
          created_at: new Date().toISOString(),
        },
        replies: [],
      };
      commentsMap[comment.id] = commentWithUser;
      return commentWithUser;
    });

    const rootComments: CommentWithUser[] = [];
    enhancedComments.forEach((comment: CommentWithUser) => {
      if (comment.parent_id === null) {
        rootComments.push(comment);
      } else {
        const parentComment = commentsMap[comment.parent_id];
        if (parentComment) {
          parentComment.replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      }
    });

    // sort comments by upvotes
    rootComments.sort((a, b) => b.upvotes - a.upvotes);

    // sort replies by creation date (newer first)
    Object.values(commentsMap).forEach((comment) => {
      comment.replies.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return rootComments;
  };

  useEffect(() => {
    if (isOpen) {
      setCTree(buildCommentTree());
    }
  }, [isOpen, comments, users]);

  /* relative date formatting */
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / (365 * 24 * 60 * 60);
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / (30 * 24 * 60 * 60);
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / (24 * 60 * 60);
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / (60 * 60);
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      alert(`Comment submitted: ${newComment}`);
      setNC("");
      setRT(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-11/12 max-w-4/5 max-h-[90vh] rounded-xl overflow-hidden flex flex-col">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaXmark size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* post */}
          <div className="w-1/2 p-6 border-r border-gray-700 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 flex justify-center items-center text-2xl rounded-full">
                S
              </div>
              <div>
                <h1 className="text-lg text-gray-200 font-bold">
                  shrehanrajsingh
                </h1>
                <h3 className="text-sm text-gray-300">26 mins ago</h3>
              </div>
            </div>

            <div className="mt-4">
              <video
                src="/post-video.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full rounded-lg"
              ></video>
            </div>

            <p
              className={`mt-6 text-gray-300 text-lg tracking-wider ${robotoFont.className}`}
            >
              The Black-Scholes equation is one of the most influential formulas
              in finance. Developed by Fischer Black, Myron Scholes, and later
              extended by Robert Merton, it provides a theoretical framework for
              pricing European-style options: financial contracts that give the
              right (but not the obligation) to buy or sell an asset at a fixed
              price in the future.
            </p>

            <div className="mb-6 mt-6 bg-gray-800 p-4 rounded-lg">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-emerald-600 flex-shrink-0 flex justify-center items-center rounded-full text-lg">
                  S
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder={
                      replyingTo ? "Write a reply..." : "Add a comment..."
                    }
                    value={newComment}
                    onChange={(e) => setNC(e.target.value)}
                    className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 outline-none resize-none h-20 focus:ring-2 focus:ring-emerald-600 transition-all"
                  ></textarea>
                  <div className="flex justify-between mt-2">
                    {replyingTo && (
                      <button
                        onClick={() => setRT(null)}
                        className="text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        <FaXmark size={12} />
                        <span>Cancel reply</span>
                      </button>
                    )}
                    <button
                      onClick={handleSubmitComment}
                      className="bg-emerald-600 cursor-pointer text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-emerald-500 transition-colors ml-auto"
                    >
                      {replyingTo ? "Reply" : "Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* comments */}
          <div className="w-1/2 p-6 overflow-y-auto scrollbar-hide">
            {/* comments */}
            <div className="space-y-6">
              {cTree.length === 0 ? (
                <p className="text-center text-gray-400">Loading comments...</p>
              ) : (
                cTree.map((comment) => (
                  <CommentComponent
                    key={comment.id}
                    comment={comment}
                    getRelativeTime={getRelativeTime}
                    depth={0}
                    onReply={(commentId) => setRT(commentId)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentComponent({
  comment,
  getRelativeTime,
  depth = 0,
  onReply,
}: {
  comment: CommentWithUser;
  getRelativeTime: (date: string) => string;
  depth: number;
  onReply: (commentId: number) => void;
}) {
  const [showReplies, setSR] = useState<boolean>(true);
  const [liked, setLiked] = useState(false);
  const [expandDR, setEDR] = useState<boolean>(false);
  const [isLR, setILR] = useState<boolean>(false);
  const [viewedReplies, setVR] = useState<number>(0);
  const maxDepth = 3; // max depth
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleExpandReplies = () => {
    if (!expandDR) {
      setILR(true);

      setTimeout(() => {
        setEDR(true);
        setILR(false);
        setVR(comment.replies.length);
      }, 600);
    } else {
      setEDR(false);
      setVR(0);
    }
  };

  useEffect(() => {
    if (expandDR) {
      setVR(comment.replies.length);
    }
  }, [expandDR, comment.replies.length]);

  const userInitial = comment.user.name ? comment.user.name.charAt(0) : "?";

  return (
    <div
      className={`${depth > 0 ? "pl-3 sm:pl-6 border-l border-gray-700" : ""}`}
    >
      <div className="flex gap-3">
        {/* avatar */}
        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-lg font-medium overflow-hidden">
          {comment.user.avatar ? (
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            userInitial
          )}
        </div>

        {/* content */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-200">
                {comment.user.name}
              </h4>
              <span className="text-xs text-gray-400">
                {getRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="mt-1 text-gray-300">{comment.text}</p>
          </div>

          {/* actions */}
          <div className="flex gap-4 mt-1 px-1">
            <button
              className={`flex items-center gap-1 text-xs ${
                liked
                  ? "text-emerald-400"
                  : "text-gray-400 hover:text-emerald-400"
              }`}
              onClick={() => setLiked(!liked)}
            >
              <FaThumbsUp size={12} />
              <span>{liked ? comment.upvotes + 1 : comment.upvotes}</span>
            </button>
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <FaReply size={12} />
              <span>Reply</span>
            </button>

            {/* toggle replies button */}
            {hasReplies && (
              <button
                className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1"
                onClick={() => setSR(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <FaAngleUp size={12} />
                    <span>Hide replies ({comment.replies.length})</span>
                  </>
                ) : (
                  <>
                    <FaAngleDown size={12} />
                    <span>Show replies ({comment.replies.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* replies */}
          {hasReplies && showReplies && depth < maxDepth && (
            <div className="mt-3 space-y-3 transition-all duration-300">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  getRelativeTime={getRelativeTime}
                  depth={depth + 1}
                  onReply={onReply}
                />
              ))}
            </div>
          )}

          {hasReplies && showReplies && depth >= maxDepth && expandDR && (
            <div className="mt-3 space-y-3 transition-all duration-500 animate-fadeIn pl-3">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  getRelativeTime={getRelativeTime}
                  depth={depth + 1}
                  onReply={onReply}
                />
              ))}
            </div>
          )}

          {/* View more replies */}
          {hasReplies && depth >= maxDepth && (
            <div
              onClick={handleExpandReplies}
              className={`mt-3 flex items-center gap-2 transition-all duration-200 ${
                expandDR ? "bg-gray-800/60" : "hover:bg-gray-800/60"
              } py-2 px-3 rounded-md cursor-pointer group ${
                isLR ? "opacity-80 pointer-events-none" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  expandDR ? "bg-emerald-600/40" : "bg-emerald-600/20"
                } text-emerald-500 group-hover:bg-emerald-600/30 transition-all`}
              >
                {isLR ? (
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-emerald-500 animate-spin" />
                ) : expandDR ? (
                  <FaChevronUp size={14} />
                ) : (
                  <FaChevronDown size={14} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-500 text-sm font-medium">
                  {isLR
                    ? "Loading replies..."
                    : expandDR
                    ? "Hide replies"
                    : `View ${comment.replies.length} ${
                        comment.replies.length === 1 ? "reply" : "replies"
                      }`}
                </span>
                {!expandDR && !isLR && comment.replies.length > 0 && (
                  <span className="text-gray-400 text-xs">
                    Including nested conversations
                  </span>
                )}
                {expandDR && (
                  <span className="text-gray-400 text-xs">
                    {viewedReplies} of {comment.replies.length} replies
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
