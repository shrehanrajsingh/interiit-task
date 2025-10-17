import { FaRegSmile } from "react-icons/fa";
import { FaThumbsUp, FaThumbsDown, FaLink, FaShare } from "react-icons/fa6";
import {
  FaXmark,
  FaReply,
  FaAngleDown,
  FaAngleUp,
  FaChevronDown,
  FaChevronUp,
  FaHeart,
  FaCircleCheck,
  FaEllipsisVertical,
  FaPaperPlane,
  FaFaceSmile,
  FaImage,
} from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { Roboto, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
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

  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const fadeInOverlay = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6">
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInOverlay}
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-8xl max-h-[95vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-emerald-900/20 border border-gray-800/50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex justify-between items-center border-b border-gray-700/50 shadow-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center">
                  <FaHeart className="text-white text-xs sm:text-sm" />
                </div>
                <h2
                  className={`text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text ${interFont.variable} font-sans tracking-tight`}
                >
                  Discussion <span className="text-emerald-400">Thread</span>
                </h2>
                <span className="hidden sm:flex items-center gap-1 bg-gray-800/70 py-1 px-3 rounded-full text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {comments.length} comments
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 p-1.5 sm:p-2 transition-colors duration-200"
                >
                  <FaShare size={14} className="sm:hidden" />
                  <FaShare size={16} className="hidden sm:block" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 p-1.5 sm:p-2 transition-colors duration-200"
                >
                  <FaLink size={14} className="sm:hidden" />
                  <FaLink size={16} className="hidden sm:block" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                  <FaXmark size={16} className="sm:hidden" />
                  <FaXmark size={18} className="hidden sm:block" />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-gradient-to-b from-gray-900/95 to-gray-950/95">
              <div className="md:w-1/2 md:border-r border-gray-800/50 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full p-0.5 shadow-lg shadow-emerald-900/30">
                      <div className="w-full h-full bg-gray-950 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
                          S
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-base sm:text-lg text-gray-100 font-bold tracking-tight">
                          shrehanrajsingh
                        </h1>
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-xs px-1.5 py-0.5 rounded text-white font-medium flex items-center">
                          <FaCircleCheck size={10} className="mr-1" />
                          Author
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                        <h3>26 mins ago</h3>
                        <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span className="text-emerald-400/80">
                          Financial Mathematics
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 relative rounded-lg sm:rounded-xl overflow-hidden group shadow-xl shadow-black/30">
                    <video
                      src="/post-video.mp4"
                      loop
                      muted
                      autoPlay
                      playsInline
                      controls
                      className="w-full rounded-lg sm:rounded-xl"
                    ></video>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 sm:mt-8"
                  >
                    <h3
                      className={`text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 ${interFont.variable} font-sans`}
                    >
                      The Black-Scholes Equation
                    </h3>
                    <p
                      className={`text-sm sm:text-base text-gray-300 leading-relaxed ${robotoFont.variable} font-sans`}
                    >
                      The Black-Scholes equation is one of the most influential
                      formulas in finance. Developed by Fischer Black, Myron
                      Scholes, and later extended by Robert Merton, it provides
                      a theoretical framework for pricing European-style
                      options: financial contracts that give the right (but not
                      the obligation) to buy or sell an asset at a fixed price
                      in the future.
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-5 sm:mt-8 pb-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-md sm:rounded-lg text-xs sm:text-sm text-gray-300 transition-colors"
                      >
                        <FaHeart className="text-red-400" />
                        <span>24 likes</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-md sm:rounded-lg text-xs sm:text-sm text-gray-300 transition-colors"
                      >
                        <FaShare className="text-emerald-400" />
                        <span>Share</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-md sm:rounded-lg text-xs sm:text-sm text-gray-300 transition-colors"
                      >
                        <FaRegSmile className="text-amber-400" />
                        <span>React</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800/50 shadow-lg">
                  <div className="flex gap-2 sm:gap-3 items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex-shrink-0 flex justify-center items-center text-base sm:text-lg font-semibold shadow-lg shadow-emerald-900/20">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          ref={commentInputRef}
                          placeholder={
                            replyingTo
                              ? "Write a thoughtful reply..."
                              : "Add to the discussion..."
                          }
                          value={newComment}
                          onChange={(e) => setNC(e.target.value)}
                          className="w-full bg-gray-800/80 text-gray-200 rounded-lg p-3 sm:p-4 outline-none resize-none h-20 sm:h-24 focus:ring-2 focus:ring-emerald-500/50 transition-all pr-10 sm:pr-12 placeholder-gray-500 shadow-inner shadow-black/10 text-sm sm:text-base"
                        ></textarea>
                        <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex flex-col gap-2 sm:gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-700/70 hover:bg-gray-600/70 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            <FaFaceSmile size={14} className="sm:hidden" />
                            <FaFaceSmile
                              size={16}
                              className="hidden sm:block"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-700/70 hover:bg-gray-600/70 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            <FaImage size={14} className="sm:hidden" />
                            <FaImage size={16} className="hidden sm:block" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 sm:mt-3">
                        {replyingTo && (
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setRT(null)}
                            className="text-gray-400 hover:text-white flex items-center gap-1 py-1 px-2 sm:px-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-md text-xs sm:text-sm transition-all duration-200"
                          >
                            <FaXmark size={10} className="sm:hidden" />
                            <FaXmark size={12} className="hidden sm:block" />
                            <span>Cancel reply</span>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          disabled={!newComment.trim()}
                          onClick={handleSubmitComment}
                          className={twMerge(
                            "bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-900/20 ml-auto transition-all duration-300",
                            !newComment.trim() &&
                              "opacity-50 cursor-not-allowed from-gray-700 to-gray-600 shadow-none"
                          )}
                        >
                          <FaPaperPlane size={14} className="text-white/90" />
                          {replyingTo ? "Post Reply" : "Post Comment"}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col overflow-hidden border-t md:border-t-0 border-gray-800/50">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-900/90 border-b border-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-medium text-gray-200 ${interFont.variable} font-sans`}
                    >
                      Comments
                    </h3>
                    <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full text-gray-400">
                      {comments.length}
                    </span>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 sm:px-3 rounded-md transition-colors">
                      Newest
                    </button>
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 sm:px-3 rounded-md transition-colors">
                      Top
                    </button>
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-3 rounded-md transition-colors">
                      Controversial
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                    {cTree.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-t-transparent border-emerald-500 rounded-full mb-3"></div>
                        <p className="text-sm sm:text-base text-gray-400">
                          Loading the conversation...
                        </p>
                      </div>
                    ) : (
                      cTree.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <CommentComponent
                            comment={comment}
                            getRelativeTime={getRelativeTime}
                            depth={0}
                            onReply={(commentId) => setRT(commentId)}
                          />
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
  const [disliked, setDisliked] = useState(false);
  const [expandDR, setEDR] = useState<boolean>(false);
  const [isLR, setILR] = useState<boolean>(false);
  const [viewedReplies, setVR] = useState<number>(0);
  const [showActions, setShowActions] = useState(false);
  const maxDepth = 3; // max depth
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
    }
  };

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

  const getUserColor = (id: string) => {
    const colors = [
      "from-emerald-500 to-teal-700",
      "from-blue-500 to-indigo-700",
      "from-purple-500 to-pink-700",
      "from-amber-500 to-red-700",
      "from-pink-500 to-rose-700",
    ];

    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const userColor = getUserColor(comment.user.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        depth > 0
          ? `ml-${Math.min(depth * 2, 6)} sm:ml-${Math.min(
              depth * 4,
              12
            )} pl-2 sm:pl-4 border-l-2 border-gray-800/70`
          : ""
      }`}
    >
      <div className="group relative">
        {depth === 0 && (
          <div className="absolute left-0 top-4 h-[calc(100%-16px)] w-0.5 sm:w-1 bg-gradient-to-b from-emerald-500/30 to-transparent rounded-full"></div>
        )}

        <div className="flex gap-2 sm:gap-3 relative">
          <div
            className={`mt-1 w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br ${userColor} p-0.5 shadow-lg flex items-center justify-center overflow-hidden group-hover:shadow-emerald-900/20`}
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
              {comment.user.avatar ? (
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base sm:text-lg font-medium bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                  {userInitial}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <h4
                    className={`font-semibold text-sm sm:text-base text-gray-100 ${interFont.variable} font-sans`}
                  >
                    {comment.user.name}
                  </h4>
                  {comment.user.id === "user1" && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                      Author
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-3">
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {getRelativeTime(comment.created_at)}
                  </span>
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-white p-0.5 sm:p-1 rounded-full hover:bg-gray-800/70"
                      onClick={() => setShowActions(!showActions)}
                    >
                      <FaEllipsisVertical size={12} className="sm:hidden" />
                      <FaEllipsisVertical
                        size={14}
                        className="hidden sm:block"
                      />
                    </button>

                    {showActions && (
                      <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1 w-28 sm:w-36 z-10">
                        <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                          Copy text
                        </button>
                        <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm text-gray-300 ${robotoFont.variable} font-sans`}
              >
                {comment.text}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-4 mt-1 sm:mt-2 px-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={twMerge(
                  "flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs py-1 px-1.5 sm:px-2 rounded-md transition-all",
                  liked
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50"
                )}
                onClick={handleLike}
              >
                <FaThumbsUp size={10} className="sm:hidden" />
                <FaThumbsUp size={12} className="hidden sm:block" />
                <span>{liked ? comment.upvotes + 1 : comment.upvotes}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={twMerge(
                  "flex items-center gap-1.5 text-xs py-1 px-2 rounded-md transition-all",
                  disliked
                    ? "text-red-400 bg-red-500/10"
                    : "text-gray-400 hover:text-red-400 hover:bg-gray-800/50"
                )}
                onClick={handleDislike}
              >
                <FaThumbsDown size={12} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReply(comment.id)}
                className="text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 flex items-center gap-1.5 py-1 px-2 rounded-md transition-all"
              >
                <FaReply size={12} />
                <span>Reply</span>
              </motion.button>

              {hasReplies && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-gray-400 hover:text-purple-400 hover:bg-gray-800/50 flex items-center gap-1.5 ml-auto py-1 px-2 rounded-md transition-all"
                  onClick={() => setSR(!showReplies)}
                >
                  {showReplies ? (
                    <>
                      <FaAngleUp size={12} />
                      <span>
                        Hide {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </span>
                    </>
                  ) : (
                    <>
                      <FaAngleDown size={12} />
                      <span>
                        Show {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </span>
                    </>
                  )}
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {hasReplies && showReplies && depth < maxDepth && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {comment.replies.map((reply) => (
                    <CommentComponent
                      key={reply.id}
                      comment={reply}
                      getRelativeTime={getRelativeTime}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasReplies && showReplies && depth >= maxDepth && expandDR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden pl-2"
                >
                  {comment.replies.map((reply) => (
                    <CommentComponent
                      key={reply.id}
                      comment={reply}
                      getRelativeTime={getRelativeTime}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {hasReplies && depth >= maxDepth && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={handleExpandReplies}
                className={`mt-3 flex items-center gap-2 ${
                  expandDR
                    ? "bg-gray-800/80"
                    : "bg-gray-800/40 hover:bg-gray-800/60"
                } py-2.5 px-4 rounded-lg cursor-pointer group ${
                  isLR ? "opacity-80 pointer-events-none" : ""
                } transition-all duration-300 border border-gray-700/30 shadow-lg`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    expandDR ? "bg-emerald-600/40" : "bg-emerald-600/20"
                  } text-emerald-400 group-hover:bg-emerald-600/30 transition-all shadow-inner`}
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
                  <span className="text-emerald-400 text-sm font-medium">
                    {isLR
                      ? "Loading replies..."
                      : expandDR
                      ? "Hide nested replies"
                      : `View ${comment.replies.length} nested ${
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
                      {viewedReplies} of {comment.replies.length} replies loaded
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
