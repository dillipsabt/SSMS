import API from "../../../services/api";

export const getCountries = () => {
  return API.get("/location/countries");
};

export const getStates = (countryId) => {
  return API.get("/location/states", {
    params: { countryId },
  });
};

export const getCities = (stateId) => {
  return API.get("/location/cities", {
    params: { stateId },
  });
};
