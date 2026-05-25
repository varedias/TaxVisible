import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Eye, ThumbsUp, Star, Clock, MessageSquare, CheckCircle2, FileText, LayoutGrid, Gauge, Video, BookOpen, ShoppingCart, BarChart3 } from 'lucide-react';
import {
  discoveryCategories,
  discoverySortOptions,
  getDiscoveryVideos,
} from '../../data/discoveryVideos';
import { useAuth } from '../../context/AuthContext';
import { getLikedVideos, LIKED_VIDEOS_UPDATED_EVENT } from '../../utils/likedVideosStorage';

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 8;

const Discovery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const { user } = useAuth();

  const enCategoryNames = {
    '全部': 'All',
    '设备测评': 'Reviews',
    '实拍Vlog': 'Factory Tours',
    '使用教程': 'Tutorials',
    '设备买卖': 'Trading',
    '行业分析': 'Analysis'
  };
  const enSortNames = {
    '综合排序': 'Popular',
    '最新发布': 'Latest',
    '最多播放': 'Most Viewed',
    '最多点赞': 'Most Liked'
  };
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [likedIds, setLikedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const getImagePath = (path) => {
    if (!path) return '/products/placeholder-content.svg';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const syncLikedIds = () => {
      const records = getLikedVideos(user);
      setLikedIds(records.map((item) => Number(item.targetId)));
    };

    syncLikedIds();
    window.addEventListener(LIKED_VIDEOS_UPDATED_EVENT, syncLikedIds);

    return () => {
      window.removeEventListener(LIKED_VIDEOS_UPDATED_EVENT, syncLikedIds);
    };
  }, [user]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, sortBy]);

  const displayVideos = getDiscoveryVideos({ activeCategory, sortBy });
  const visibleVideos = displayVideos.slice(0, visibleCount);
  const hasMoreVideos = visibleVideos.length < displayVideos.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 pt-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 sticky top-0 z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {discoveryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${activeCategory === category.id
                      ? 'bg-slate-700 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category.id === 'all' && <LayoutGrid size={16} className="mr-1.5" />}
                  {category.id === 'review' && <Gauge size={16} className="mr-1.5" />}
                  {category.id === 'vlog' && <Video size={16} className="mr-1.5" />}
                  {category.id === 'tutorial' && <BookOpen size={16} className="mr-1.5" />}
                  {category.id === 'trading' && <ShoppingCart size={16} className="mr-1.5" />}
                  {category.id === 'analysis' && <BarChart3 size={16} className="mr-1.5" />}
                  {isEnglish ? enCategoryNames[category.name] || category.name : category.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">{isEnglish ? 'Sort:' : '排序:'}</span>
              {discoverySortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${sortBy === option.id
                      ? 'bg-slate-50 text-slate-700 border border-slate-200'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {isEnglish ? enSortNames[option.name] || option.name : option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 text-sm text-gray-500">
          <span>{isEnglish ? `${visibleVideos.length} of ${displayVideos.length} items` : `共 ${displayVideos.length} 条内容，当前展示 ${visibleVideos.length} 条`}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {visibleVideos.map((video) => {
            const isLiked = likedIds.includes(video.id);
            const isArticle = video.type === 'article';

            return (
              <div
                key={video.id}
                onClick={() => navigate(isEnglish ? `/en/content/${video.id}` : `/content/${video.id}`)}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={getImagePath(video.cover)}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(event) => {
                      event.target.src = '/products/placeholder-content.svg';
                    }}
                  />
                  {!isArticle && video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded z-10">
                      {video.duration}
                    </div>
                  )}
                  {!isArticle && (
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-10 pointer-events-none">
                      <div className="bg-white/0 group-hover:bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-all duration-300">
                        <Play size={28} className="text-slate-700" />
                      </div>
                    </div>
                  )}
                  {isArticle ? (
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                      <FileText size={12} />
                      {isEnglish ? 'Deep Dive' : '深度解读'}
                    </div>
                  ) : (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                      <Star size={12} className="fill-white" />
                      {video.rating}
                    </div>
                  )}
                  {isLiked && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                      <CheckCircle2 size={12} />
                      {isEnglish ? 'Liked' : '已点赞'}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-3 min-h-[40px] group-hover:text-slate-700">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={video.avatar}
                      alt={video.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-600">{video.author}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {isEnglish ? `${(video.views / 1000).toFixed(1)}k` : `${(video.views / 10000).toFixed(1)}万`}
                      </span>
                      <span className={`flex items-center gap-1 ${isLiked ? 'text-rose-500' : ''}`}>
                        <ThumbsUp size={14} />
                        {video.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {video.comments}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {video.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {video.uploadTime}
                    </span>
                    {isArticle ? (
                      <span>{video.readTime || (isEnglish ? 'Deep Read' : '深度阅读')}</span>
                    ) : (
                      isLiked && <span>{isEnglish ? 'Synced to profile' : '已同步到个人中心'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          {hasMoreVideos ? (
            <button
              onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
              className="px-8 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-slate-700 hover:text-slate-700 transition-all font-medium"
            >
              {isEnglish ? 'Load More' : '加载更多内容'}
            </button>
          ) : (
            <span className="inline-flex px-6 py-2.5 bg-gray-100 text-gray-500 rounded-full text-sm">
              {isEnglish ? 'All content displayed' : '已显示全部内容'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
