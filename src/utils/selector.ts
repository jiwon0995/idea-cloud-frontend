import { IMeetingNoteListData } from "@/types/meeting_notes.type";

export const selectMeetingNoteList = (data: IMeetingNoteListData) => {
  const { meetingNotes, totalPages, totalElements } = data;

  const newList = meetingNotes.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    created: item.created,
    userId: item.userId,
    userName: item.userName,
    keywords: item.keywords,
  }));

  return {
    list: newList,
    totalPages: totalPages ?? 0,
    totalElements: totalElements ?? 0,
  };
};
