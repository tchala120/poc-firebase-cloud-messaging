import Axios from 'axios'

import { getToken } from './helpers'

export const axios = Axios.create()

axios.interceptors.request.use(async (config) => {
	const user = await getToken()

	config.headers['Authorization'] = `Bearer ${user}`

	return config
})

export interface APIGetResponse<T> {
	status: number
	message: string
	data: T
}
