import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { contentApi } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import {
  buildDiscoveryVideoDetail,
  getRelatedDiscoveryVideos,
} from '../../data/discoveryVideos';
import { isVideoLiked, toggleLikedVideo } from '../../utils/likedVideosStorage';
import { addViewedContent } from '../../utils/viewHistoryStorage';
import {
  hasFavoriteItem,
  toggleFavoriteItem,
} from '../../utils/personalCenterStorage';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedContent, setRelatedContent] = useState([]);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [articlePageIndex, setArticlePageIndex] = useState(0);

  const getImagePath = (path) => {
    if (!path || path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  useEffect(() => {
    loadContent();
  }, [id, user]);

  useEffect(() => {
    setArticlePageIndex(0);
  }, [id]);

  useEffect(() => {
    if (!actionMessage) return undefined;

    const timer = window.setTimeout(() => setActionMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const syncInteractionState = (targetId) => {
    setLiked(Boolean(user && isVideoLiked(user, targetId)));
    setFavorited(Boolean(user && hasFavoriteItem(user, 'content', targetId)));
  };

  const loadContent = async () => {
    setLoading(true);
    setIsPlaying(false);

    const localContent = buildDiscoveryVideoDetail(id);
    if (localContent) {
      syncInteractionState(localContent.id);
      setContent({
        ...localContent,
        likes: localContent.likes + (user && isVideoLiked(user, localContent.id) ? 1 : 0),
      });
      setRelatedContent(getRelatedDiscoveryVideos(id, 3));
      if (user) {
        addViewedContent(user, localContent);
      }
      setLoading(false);
      return;
    }

    try {
      const data = await contentApi.getDetail(id);
      if (data) {
        setContent({
          ...data,
          authorAvatar:
            data.authorAvatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author?.charAt(0) || 'U')}&background=0D8ABC&color=fff`,
          publishDate: formatDate(data.createTime),
          thumbnail: data.cover || data.thumbnail,
          videoUrl: data.videoUrl,
          likes: data.likes || 0,
        });
        syncInteractionState(data.id);
        if (user) {
          addViewedContent(user, {
            targetId: data.id,
            title: data.title,
            cover: data.cover || data.thumbnail,
            author: data.author,
            type: data.type || 'content',
            duration: data.duration,
            views: data.views,
            publishDate: formatDate(data.createTime),
          });
        }
      }

      const related = await contentApi.getList({ page: 1, size: 4 });
      if (related && related.records) {
        setRelatedContent(related.records.filter((item) => item.id !== Number(id)).slice(0, 3));
      }
    } catch (error) {
      console.error('加载内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = toggleLikedVideo(user, {
      targetId: content.id,
      title: content.title,
      cover: content.thumbnail || content.cover,
      author: content.author,
      type: content.type || 'video',
      views: content.views,
      duration: content.duration,
      publishDate: content.publishDate,
    });

    setLiked(result.liked);
    setContent((prev) => ({
      ...prev,
      likes: Math.max(0, Number(prev?.likes || 0) + (result.liked ? 1 : -1)),
    }));
    setActionMessage(result.liked ? '已加入我点赞的视频' : '已取消点赞');
  };

  const handleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = toggleFavoriteItem(user, {
      targetType: 'content',
      targetId: content.id,
      title: content.title,
      image: content.thumbnail || content.cover,
      author: content.author,
      tags: content.tags,
      note: '来自内容详情页收藏',
    });

    setFavorited(result.favorited);
    setActionMessage(result.favorited ? '已收藏到个人中心' : '已取消收藏');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setActionMessage('链接已复制，可以直接发给同事');
    } catch (error) {
      console.error('复制链接失败:', error);
      setActionMessage('复制失败，请手动复制地址栏链接');
    }
  };

  if (loading) {
    return (
      <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600">
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="aspect-video bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600">
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">内容不存在或已删除</p>
          <button onClick={() => navigate('/discovery')} className="mt-4 text-slate-700 hover:underline">
            浏览更多内容
          </button>
        </div>
      </div>
    );
  }

  const isVideo = content.type === 'video' || content.type === 'vlog';
  const isArticle = content.type === 'article';
  const articlePages = isArticle
    ? (Array.isArray(content.articlePages) && content.articlePages.length > 0
      ? content.articlePages
      : [{ id: 'page-1', title: '第 1 页', sections: content.sections || [] }])
    : [];
  const currentArticlePage = isArticle
    ? articlePages[Math.min(articlePageIndex, Math.max(articlePages.length - 1, 0))]
    : null;
  const contentContainerClassName = isArticle ? 'max-w-7xl' : 'max-w-4xl';

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className={`${contentContainerClassName} mx-auto px-4 py-3`}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
        </div>
      </div>

      <div className={`${contentContainerClassName} mx-auto px-4 py-8`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
          {actionMessage && (
            <div className="shrink-0 hidden md:flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} />
              {actionMessage}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={content.authorAvatar} alt={content.author} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-medium text-gray-900">{content.author}</p>
              <p className="text-sm text-gray-500">{content.publishDate}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {(content.views || 0).toLocaleString()}
            </span>
            <span className={`flex items-center gap-1 ${liked ? 'text-rose-500' : ''}`}>
              <ThumbsUp size={16} />
              {(content.likes || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {isVideo ? (
          <div className="relative bg-black rounded-xl overflow-hidden mb-8 aspect-video">
            {!isPlaying ? (
              <>
                <img
                  src={getImagePath(content.thumbnail)}
                  alt={content.title}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.target.src = '/products/placeholder-content.svg';
                  }}
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                    <Play size={48} className="text-slate-700 ml-1" />
                  </div>
                </button>
                {content.duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {content.duration}
                  </div>
                )}
              </>
            ) : (
              <video
                src={getImagePath(content.videoUrl)}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden mb-8">
            <img
              src={getImagePath(content.thumbnail)}
              alt={content.title}
              className="w-full max-h-96 object-cover"
              onError={(event) => {
                event.target.src = '/products/placeholder-content.svg';
              }}
            />
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <FileText size={14} />
              文章
            </div>
          </div>
        )}

        {content.description && !isArticle && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">简介</h3>
            <p className="text-gray-600 leading-relaxed">{content.description}</p>
          </div>
        )}

        {isArticle && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6 mb-6">
            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-8 lg:px-12 lg:py-10">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-6">
                <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-white">
                  第 {articlePageIndex + 1} / {articlePages.length} 页
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  共 {content.sections?.length || 0} 个章节
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {content.readTime || '长文阅读'}
                </span>
              </div>

              <div className="pb-8 mb-8 border-b border-slate-200">
                <p className="text-lg leading-9 text-slate-700">
                  {content.description}
                </p>
              </div>

              <div className="space-y-10">
                {currentArticlePage?.sections.map((section, index) => (
                  <section
                    key={section.title}
                    className={index === 0 ? '' : 'pt-8 border-t border-slate-100'}
                  >
                    <h3 className="text-2xl font-semibold text-slate-900 mb-5 leading-9">{section.title}</h3>
                    <div className="space-y-5">
                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="text-[16px] lg:text-[17px] leading-9 text-slate-700">
                          {paragraph}
                        </p>
                      ))}
                      {section.bullets?.length > 0 && (
                        <div className="space-y-4">
                          {section.bullets.map((bullet) => (
                            <div key={bullet} className="flex items-start gap-3 text-slate-700">
                              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-slate-700"></span>
                              <span className="text-[16px] lg:text-[17px] leading-8">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </article>

            <aside className="space-y-4 xl:sticky xl:top-24 self-start">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900">阅读导航</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">分页切换和当前章节都放在右侧，不占正文阅读面积。</p>
                </div>
                {articlePages.length > 1 && (
                  <div className="px-4 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setArticlePageIndex((page) => Math.max(page - 1, 0))}
                        disabled={articlePageIndex === 0}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ChevronLeft size={16} />
                          上一页
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setArticlePageIndex((page) => Math.min(page + 1, articlePages.length - 1))}
                        disabled={articlePageIndex === articlePages.length - 1}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="flex items-center justify-center gap-2">
                          下一页
                          <ChevronRight size={16} />
                        </span>
                      </button>
                    </div>
                </div>
                )}
                <div className="p-4 space-y-2">
                  {articlePages.map((page, index) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setArticlePageIndex(index)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                        articlePageIndex === index
                          ? 'border-slate-200 bg-slate-50'
                          : 'border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className={`text-sm font-semibold ${articlePageIndex === index ? 'text-slate-800' : 'text-slate-700'}`}>
                          {page.title}
                        </span>
                        <span className="text-xs text-slate-400">{page.sections.length} 节</span>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">
                        {page.sections.map((section) => section.title).join(' · ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <h4 className="text-sm font-semibold text-slate-950 mb-3">本页章节</h4>
                <div className="space-y-2">
                  {currentArticlePage?.sections.map((section) => (
                    <div key={section.title} className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-600">
                      {section.title}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {!isArticle && Array.isArray(content.sections) && content.sections.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm space-y-6">
            {content.sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 leading-relaxed mb-2">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length > 0 && (
                  <div className="space-y-2">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-2 text-gray-600">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.content && !Array.isArray(content.sections) && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
              liked ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-700 text-white hover:bg-slate-800'
            }`}
          >
            <ThumbsUp size={20} />
            {liked ? '已点赞' : '点赞'}
          </button>
          <button
            onClick={handleFavorite}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${
              favorited
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark size={20} />
            {favorited ? '已收藏' : '收藏'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 size={20} />
            分享
          </button>
        </div>

        {actionMessage && (
          <div className="mb-8 md:hidden rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        )}

        {relatedContent.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">相关推荐</h3>
            <div className="space-y-4">
              {relatedContent.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/content/${item.id}`)}
                  className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <img
                    src={getImagePath(item.cover || item.thumbnail)}
                    alt={item.title}
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(event) => {
                      event.target.src = '/products/placeholder-content.svg';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {(item.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail;
