const axios = require("axios");
const geoUserName = "leosultanov";

const geoNamesAxios = axios.create({
    baseURL: "http://api.geonames.org"
  });
  
geoNamesAxios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

const getCountryCode = async (lat, lng) => {
    const res = await geoNamesAxios.get(`countryCode?lat=${lat}&lng=${lng}&username=${geoUserName}&type=Json`);
    return res;
}
  
module.exports = {
    geoNamesAxios,
    getCountryCode
}