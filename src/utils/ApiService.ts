import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

class ApiService {
    session: AxiosInstance;
    tokenGenerator: any;

    constructor() {
        this.session = axios.create({ baseURL });
        console.log("comming in construcotr", baseURL);
        this.session.interceptors.request.use(async (config: any) => {
            const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
            if (!userInfo) {
                return config;
            }

            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };
        });
    }

    async setTokenGenerator(tokenGenerator: any) {
        this.tokenGenerator = tokenGenerator;
        return this;
    }

    async getToken() {
        return this.tokenGenerator();
    }

    async get(url: string, params: Record<string, any> = {}) {
        return this.session.get(url, { params });
    }

    async post(
        url: string,
        payload: Record<string, any> = {},
        params: Record<string, any> = {},
    ) {
        return this.session.post(url, payload, { params });
    }

    async put(
        url: string,
        payload: Record<string, any> = {},
        params: Record<string, any> = {},
    ) {
        return this.session.put(url, payload, { params });
    }

    async delete(url: string) {
        return this.session.delete(url);
    }
}

const apiService = new ApiService();
export default apiService;
