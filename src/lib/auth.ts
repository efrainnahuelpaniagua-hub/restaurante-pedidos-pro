import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { user: null, profile: null, demo: true };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, demo: false };

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, profile, demo: false };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.demo) return session;
  if (!session.user || !session.profile) redirect("/admin/login");
  return session;
}
