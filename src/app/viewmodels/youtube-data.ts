export interface YoutubeData {
  items: [];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: {
    totalResults: number,
    resultsPerPage: number
  };
}
