
type SpotifyAppDataDau = {
  date: string;
  number_of_daus: number;
};

type SpotifyAppDataMau = {
  date: string;
  number_of_maus: number;
};

type SpotifyAppDataRequests = {
  date: string;
  number_of_requests: number;
};

type SpotifyAppDataEndpoint = {
  endpoint: string;
  days: Array<SpotifyAppDataRequests>;
};

type SpotifyAppCountryUsers = {
  country_code: string;
  number_of_users: number;
}

type MapData = {
  last_known_date: string;
  locations: Array<SpotifyAppCountryUsers>;
}

interface ErrorHandling {
  error?: { message: string };
}

export type SpotifyAppData = {
  dau: Array<SpotifyAppDataDau>;
  mau: Array<SpotifyAppDataMau>;
  endpoints: Array<SpotifyAppDataEndpoint>;
  total_requests: Array<SpotifyAppDataRequests>;
  map_data: MapData
} & ErrorHandling;
