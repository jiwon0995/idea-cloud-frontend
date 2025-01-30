import axios from "axios";

// Axios 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!!config.headers.Authorization) {
      return config;
    }

    let token;
    const getToken = localStorage.getItem("token");
    if (getToken) {
      token = getToken;
    } else {
      token = null;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response, // 성공 응답 그대로 반환
  (error) => {
    // 토큰 만료 또는 인증 오류 처리
    if (error.response?.status === 401) {
      console.error("로그인 필요");
      // 로그아웃 처리 또는 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default api;
