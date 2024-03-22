import { Api } from './api'

export const postScore = async (score) => {
    const response = await Api().post(`emergency-slots/score`, { 
        score: score,
    })
    return response.data
}

export const getBlackListInfo = async () => {
    const response = await Api().get('me')
    return response.data.blackList
}

export const getResults = async () => {
    const response = await Api().get('emergency-slots/results')
    return response.data
}