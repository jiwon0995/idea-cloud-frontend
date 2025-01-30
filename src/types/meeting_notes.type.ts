export type MeetingNoteItem = {
  id: number;
  title: string;
  body: string;
  created: string;
  userId: number;
  userName: string;
  keywords: string[];
};

export interface IMeetingNoteListData {
  meetingNotes: MeetingNoteItem[];
  totalPages: number;
  totalElements: number;
}
