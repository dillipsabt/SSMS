import superAdminApi from "../../../SuperAdmin/api/axios";

export const getSuperAdminCountries = () =>
  superAdminApi.get("master/location/countries");

export const getSuperAdminStates = (countryId) =>
  superAdminApi.get("master/location/states", { params: { countryId } });

export const getSuperAdminCities = (stateId) =>
  superAdminApi.get("master/location/cities", { params: { stateId } });
