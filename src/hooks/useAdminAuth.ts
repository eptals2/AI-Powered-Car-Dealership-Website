import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      setAuthChecked(true);
    })();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return { authChecked, isAdmin, logout };
}