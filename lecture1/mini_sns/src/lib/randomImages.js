// 게시물 음식 이미지: Foodish API(키 불필요, 음식 사진 전용) 사용
// 응답 실패 시 picsum.photos 시드 이미지로 대체
export async function getRandomFoodImage() {
  try {
    const res = await fetch('https://foodish-api.com/api/');
    if (!res.ok) throw new Error('foodish api error');
    const data = await res.json();
    if (!data?.image) throw new Error('no image in response');
    return data.image;
  } catch {
    const seed = Math.floor(Math.random() * 100000);
    return `https://picsum.photos/seed/food-${seed}/600/600`;
  }
}

// 프로필 이미지: randomuser.me 인물 사진(키 불필요)
export function getRandomProfileImage() {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const id = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}
