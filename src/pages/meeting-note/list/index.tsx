import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import MeetingNoteListCard from "@/components/meeting-note/MeetingNoteListCard";
import CommonPagination from "@/components/common/CommonPagination";

import { meetingNoteListApi } from "@/api/meeting_note.api";
import { selectMeetingNoteList } from "@/utils/selector";

const MEETING_NOTE_SIZE = 10;

export default function MeetingNoteListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");

  const {
    data: { list, totalPages, totalElements } = { list: [], totalPages: 0, totalElements: 0 },
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["meeting-note-list", { page, MEETING_NOTE_SIZE }],
    queryFn: () => meetingNoteListApi(page, MEETING_NOTE_SIZE),
    enabled: !!page,
    select: (res) => selectMeetingNoteList(res),
  });

  const handleMovePage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="m-10 min-h-screen h-full overflow-hidden flex flex-col justify-between">
      <div className="flex gap-4">
        {totalElements > 0 &&
          list.map((meetingNote) => (
            <div key={meetingNote.id}>
              <MeetingNoteListCard meetingNote={meetingNote} />
            </div>
          ))}
        {isLoading && isPending && <div>Loading....</div>}
      </div>
      <CommonPagination totalPage={totalPages} currentPage={page} handleMovePage={handleMovePage} />
    </div>
  );
}
