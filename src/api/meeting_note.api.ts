import { CommonResponse } from "@/types/common/api_response";
import api from "@/api/instance";

const PREFIX_PATH = "/api";

export const meetingNoteWriteApi = async (
  title: string,
  body: string,
  keywords: { keyword: string; count: number }[]
): Promise<CommonResponse<string>> => {
  return await api.post(`${PREFIX_PATH}/meeting-notes`, { title, body, keywords }).then((res) => res.data);
};

export const meetingNoteListApi = async (page: number, size: number) => {
  return await api.get(`${PREFIX_PATH}/meeting-notes?page=${page}&size=${size}`).then((res) => res.data);
};

export const meetingNoteDetailApi = async (id: number) => {
  return await api.get(`${PREFIX_PATH}/meeting-notes/${id}`).then((res) => res.data);
};
