import { fetchWrapper } from "../helpers"
import getConfig from "next/config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

// register
export const register = (
  { email, name, password }:
  {
    email: string,
    name: string,
    password: string
  }
) => {
  return fetchWrapper.post(`${baseUrl}/register`, { email, name, password })
}

// uploaded images
export const uploadedImages = () => {
  return fetchWrapper.get(`${baseUrl}/v1/uploads`)
}

// reverse from coords to real location info
export const geoReverse = ({ lat, lon }: { lat: number, lon: number }) => {
  const config: AxiosRequestConfig = {
    params: {
      lat, lon, format: "json"
    }
  }
  return axios.get("https://nominatim.openstreetmap.org/reverse", config)
    .then((response: AxiosResponse<any, any>) => {
      const data = response.data
      if (response.status != 200) {
        const error = response.statusText
        return Promise.reject(error)
      } else if (data.error != undefined) {
        return Promise.reject(data.error)
      }
      return data
    })
}