import { supabase } from "@/lib/supabaseClient";

export const PROTOTYPE_CREATOR_ID = "creator-1";

export async function getActiveCreatorId() {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;

  if (userId) {
    localStorage.setItem("is_teacher", "true");
    localStorage.setItem("teacher_id", userId);
    return userId;
  }

  if (localStorage.getItem("is_teacher") === "true") {
    return localStorage.getItem("teacher_id") || PROTOTYPE_CREATOR_ID;
  }

  return null;
}
