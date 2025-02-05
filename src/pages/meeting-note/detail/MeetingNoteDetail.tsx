import { useParams } from "react-router-dom";
import MeetingNoteEditor from "@/components/meeting-note/MeetingNoteEditor";
import { useQuery } from "@tanstack/react-query";
import { meetingNoteDetailApi } from "@/api/meeting_note.api";
import { selectMeetingNoteDetail } from "@/utils/selector";

export default function MeetingNoteDetailPage() {
  const { id } = useParams();

  const {
    data: meetingNoteDetail,
    isLoading,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["meeting-note-detail", id],
    queryFn: () => {
      if (id) {
        return meetingNoteDetailApi(Number(id));
      }
    },
    enabled: Boolean(id),
    select: (res) => selectMeetingNoteDetail(res),
  });

  if (isLoading || isPending) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    meetingNoteDetail && (
      <MeetingNoteEditor
        defaultTitle={meetingNoteDetail.title}
        defaultBody={meetingNoteDetail.body}
        defaultKeywords={meetingNoteDetail.keywords}
      />
    )
  );
}
