import { supabase } from "@/lib/supabaseClient";
import { PROTOTYPE_CREATOR_ID } from "@/lib/constants";

export { PROTOTYPE_CREATOR_ID };

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
