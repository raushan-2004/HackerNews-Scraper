import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const StoryCard = ({ story, onBookmark, isBookmarked }) => {
  // Format the date to "X hours ago"
  const formatTime = (timeStr) => {
    try {
      // Handle the case where HN title attribute might have extra info after space
      const isoPart = timeStr.split(' ')[0];
      return formatDistanceToNow(parseISO(isoPart), { addSuffix: true });
    } catch (error) {
      return timeStr; // Fallback to raw string
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all shadow-lg group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 leading-tight">
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            {story.title}
          </a>
        </h3>
        <button 
          onClick={() => onBookmark(story._id)}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${isBookmarked ? 'text-orange-500 bg-orange-500/10' : 'text-gray-500 hover:text-orange-400 bg-gray-700/50'}`}
          title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      <div className="mt-auto pt-4 flex flex-wrap items-center text-xs text-gray-400 gap-y-2">
        <span className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold text-gray-300">{story.points}</span>
          <span className="ml-1">pts</span>
        </span>
        
        <span className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {story.author}
        </span>
        
        <span className="flex items-center ml-auto italic">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(story.postedAt)}
        </span>
      </div>
    </div>
  );
};

export default StoryCard;
