export async function fetchLocationStats(
  login: string
): Promise<Record<string, string> | null> {
  try {
    const response = await fetch(
      `https://translate.intra.42.fr/users/${login}/locations_stats.json`,
      {
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('네트워크 오류');
    return await response.json();
  } catch (error) {
    console.error('요청 실패:', error);
    return null;
  }
}
