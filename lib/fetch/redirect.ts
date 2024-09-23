const infoQuery = `
  query ($mediaId: Int) {
  Media(id: $mediaId) {
    type
  }
}`;

export const fetchRedirect = async (id: string): Promise<string> => {
  const variables = {
    mediaId: id,
  };

  const response = await fetch(`https://graphql.anilist.co`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: infoQuery, variables }),
  });

  const json = (await response.json()) as {
    data: { Media: { type: string } };
  };

  return json.data.Media.type;
};
