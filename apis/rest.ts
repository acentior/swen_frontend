import { fetchWrapper } from "../helpers"
import getConfig from "next/config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { userService } from "../services";

dayjs.extend(utc)

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
  return fetchWrapper.post(`${baseUrl}/register`, { email, name, password }, {'Accept': 'application/json'})
}

// uploaded images
export const uploadedImages = () => {
  return fetchWrapper.get(`${baseUrl}/v1/uploads`)
}

// new cluster
export const newCluster = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
  let expires = dayjs().add(1, 'months').utc().format('MM/DD/YYYY HH:mm:ss')
  return fetchWrapper.post(`${baseUrl}/v1/clusters`, {
    latitude,
    longitude,
    expires
  }, { Accept: 'application/json' })
    .then((data: {data: {id: string}}) => {
    return data.data.id
  })
}

// upload image
export const newImage = ({ url }: { url: string }) => {
  let bodyFormData = new FormData();
  bodyFormData.append('file', '', url)

  return fetchWrapper.post(`${baseUrl}/v1/uploads/media`, bodyFormData, {
    "Accept": 'application/json',
    "Content-Type": "multipart/form-data"
  })
    .then((data: { name: string, original_name: string }) => {
    return data.name
  })
}

// upload post
export const newPost = ({ cluster_id, comment, content }: { cluster_id: string, comment: string, content: string }) => {
  const created_by_id = userService.userValue.user_id
  let expires_at = dayjs().add(1, 'months').utc().format('MM/DD/YYYY HH:mm:ss')
  return fetchWrapper.post(`${baseUrl}/v1/uploads/media`, {
    created_by_id,
    expires_at,
    cluster_id,
    "type": "post",
    "status": "active",
    comment,
    content
  }, {
    "Accept": 'application/json'
  })
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