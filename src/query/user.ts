import apiService from "utils/ApiService";

export const login = async (payload: Record<string, any>) => {
    console.log('coming here');
    const { data } = await apiService.post('/api/user/login', payload);
    console.log('data is', data);
    return data;
}

export const signup = async (payload: Record<string, any>) => {
    console.log('coming here');
    const { data } = await apiService.post('/api/user', payload);
    return data;
}

export const searchUser = async (url: string) => {
    const { data } = await apiService.get(url);
    return data;
}

export const uploadImage = async (url: string, payload: Record<string, any>) => {
    console.log('url is', url);
    const { data } = await apiService.post(url, payload);
    return data;
}