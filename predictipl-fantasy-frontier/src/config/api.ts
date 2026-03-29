export const API_CONFIG = {
  RAPIDAPI_KEY: 'cd5aafa043msh71a96cbee1dbddap1adb52jsn47c123a43902',
  RAPIDAPI_HOST: 'cricbuzz-cricket.p.rapidapi.com',
  IPL_SERIES_ID: '9241',
};
export const getApiOptions = () => ({
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_CONFIG.RAPIDAPI_KEY,
    'x-rapidapi-host': API_CONFIG.RAPIDAPI_HOST
  }
});