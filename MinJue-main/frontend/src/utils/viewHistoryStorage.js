const STORAGE_PREFIX = 'minjue:view-history';
export const VIEW_HISTORY_UPDATED_EVENT = 'minjue:view-history-updated';

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

const readRecords = (user) => {
  if (!user || typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(user));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('读取浏览记录失败:', error);
    return [];
  }
};

const emitUpdate = (user, records) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(VIEW_HISTORY_UPDATED_EVENT, {
    detail: {
      scope: getUserScope(user),
      total: records.length,
    },
  }));
};

const writeRecords = (user, records) => {
  if (!user || typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getStorageKey(user), JSON.stringify(records));
    emitUpdate(user, records);
  } catch (error) {
    console.error('写入浏览记录失败:', error);
  }
};

export const getViewedContent = (user) => readRecords(user);

export const addViewedContent = (user, content) => {
  if (!user || !content) return [];

  const normalizedTargetId = normalizeTargetId(content.targetId ?? content.id);
  const currentRecords = readRecords(user).filter(
    (item) => normalizeTargetId(item.targetId) !== normalizedTargetId
  );

  const nextRecords = [
    {
      targetId: normalizedTargetId,
      title: content.title || '未命名内容',
      cover: content.cover || content.thumbnail || '',
      author: content.author || '匿名作者',
      type: content.type || 'video',
      duration: content.duration || '',
      views: Number(content.views || 0),
      publishDate: content.publishDate || '',
      tags: Array.isArray(content.tags) ? content.tags.slice(0, 4) : [],
      viewedAt: new Date().toISOString(),
    },
    ...currentRecords,
  ].slice(0, 24);

  writeRecords(user, nextRecords);
  return nextRecords;
};

export const removeViewedContent = (user, targetId) => {
  const normalizedTargetId = normalizeTargetId(targetId);
  const nextRecords = readRecords(user).filter(
    (item) => normalizeTargetId(item.targetId) !== normalizedTargetId
  );

  writeRecords(user, nextRecords);
  return nextRecords;
};

export const clearViewedContent = (user) => {
  writeRecords(user, []);
  return [];
};
