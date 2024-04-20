import apiService from "utils/ApiService";

export const getSelectedChat = async (url: string) => {
    const { data } = await apiService.get(url);
    return data;
}

export const sendMsg = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.post(url, payload);
    return data;
}

export const getAllChats = async (url: string) => {
    const { data } = await apiService.get(url);
    return data
}

export const groupRemove = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.put(url, payload);
    return data;
}

export const groupLeave = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.put(url, payload);
    return data;
}

export const groupAdd = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.put(url, payload);
    return data;
}

export const chatRename = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.put(url, payload);
    return data;
}

export const searchChat = async (url: string) => {
    const { data } = await apiService.get(url);
    return data;
}

export const searchedChat = async (url: string, payload: Record<string, any>) => {
    console.log('calling searched chat');
    const { data } = await apiService.post(url, payload);
    return data;
}

export const createGroup = async (url: string, payload: Record<string, any>) => {
    const { data } = await apiService.post(url, payload);
    return data;
}
