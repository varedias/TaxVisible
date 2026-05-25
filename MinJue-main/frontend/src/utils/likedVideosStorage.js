const STORAGE_PREFIX = 'minjue:liked-videos';
export const LIKED_VIDEOS_UPDATED_EVENT = 'minjue:liked-videos-updated';

const normalizeTargetId = (value) => Number(value);

const getUserScope = (user) => {
  if (user?.id !== undefined && user?.id !== null) {
    return String(user.id);
  }
  if (user?.username) {
    return user.username;
  }
  return 'guest';
};

const getStorageKey = (user) => `${STORAGE_PREFIX}:${getUserScope(user)}`;

const readLikedVideos = (user) => {
  if (!user || typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(user));
    const records = raw ? JSON.parse(raw) : [];
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('读取点赞视频缓存失败:', error);
    return [];
  }
};

const emitUpdate = (user, records) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(LIKED_VIDEOS_UPDATED_EVENT, {
    detail: {
      scope: getUserScope(user),
      total: records.length,
    },
  }));
};

const writeLikedVideos = (user, records) => {
  if (!user || typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getStorageKey(user), JSON.stringify(records));
    emitUpdate(user, records);
  } catch (error) {
    console.error('写入点赞视频缓存失败:', error);
  }
};

export const getLikedVideos = (user) => readLikedVideos(user);

export const getLikedVideosPage = (user, { page = 1, size = 6 } = {}) => {
  const records = readLikedVideos(user);
  const safeSize = Math.max(1, Number(size) || 6);
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * safeSize;

  return {
    records: records.slice(start, start + safeSize),
    total,
    pages: totalPages,
    current,
  };
};

export const isVideoLiked = (user, targetId) => {
  const normalizedTargetId = normalizeTargetId(targetId);
  return readLikedVideos(user).some((item) => normalizeTargetId(item.targetId) === normalizedTargetId);
};

export const toggleLikedVideo = (user, video) => {
  const normalizedTargetId = normalizeTargetId(video?.targetId ?? video?.id);
  const currentRecords = readLikedVideos(user);
  const existed = currentRecords.some((item) => normalizeTargetId(item.targetId) === normalizedTargetId);

  const nextRecords = existed
    ? currentRecords.filter((item) => normalizeTargetId(item.targetId) !== normalizedTargetId)
    : [
        {
          targetId: normalizedTargetId,
          title: video?.title || '未命名视频',
          cover: video?.cover || video?.thumbnail || '',
          author: video?.author || '匿名作者',
          type: video?.type || 'video',
          views: Number(video?.views || 0),
          duration: video?.duration || '',
          publishDate: video?.publishDate || '',
          likedAt: new Date().toISOString(),
        },
        ...currentRecords,
      ];

  writeLikedVideos(user, nextRecords);
  return {
    liked: !existed,
    records: nextRecords,
  };
};

export const removeLikedVideo = (user, targetId) => {
  const normalizedTargetId = normalizeTargetId(targetId);
  const nextRecords = readLikedVideos(user).filter(
    (item) => normalizeTargetId(item.targetId) !== normalizedTargetId
  );

  writeLikedVideos(user, nextRecords);
  return nextRecords;
};
