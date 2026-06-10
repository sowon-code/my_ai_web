// 별도 likes 테이블 없이 sns_posts.likes_count만 사용하므로,
// "내가 좋아요 누른 게시물" 상태는 사용자별로 localStorage에 보관한다.
const STORAGE_PREFIX = 'mini_sns_likes_';

export function getLikedPostIds(username) {
  const raw = localStorage.getItem(STORAGE_PREFIX + username);
  return new Set(raw ? JSON.parse(raw) : []);
}

export function setLikedPostIds(username, idsSet) {
  localStorage.setItem(STORAGE_PREFIX + username, JSON.stringify([...idsSet]));
}
