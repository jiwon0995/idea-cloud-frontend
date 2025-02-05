import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/home";
import SignInPage from "@/pages/sign-In";
import SignUpPage from "@/pages/sign-up";
import WritePage from "@/pages/meeting-note/write";
import MeetingNoteListPage from "@/pages/meeting-note/list";
import MeetingNoteDetailPage from "@/pages/meeting-note/detail/MeetingNoteDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={"/signin"} element={<SignInPage />} />
      <Route path={"/signup"} element={<SignUpPage />} />
      <Route path={"/home"} element={<HomePage />} />
      <Route path={"/meeting-note/write"} element={<WritePage />} />
      <Route path={"/meeting-note/list"} element={<MeetingNoteListPage />} />
      <Route path={`/meeting-note/:id`} element={<MeetingNoteDetailPage />} />
    </Routes>
  );
}
