import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "../hooks/useAdminData";
import { AdminAccessDenied } from "../components/admin/AdminAccessDenied";
import { CarsTab } from "../components/admin/CarsTab";
import { InquiriesTab } from "../components/admin/InquiriesTab";
import { MtoDesignsTab } from "@/components/admin/MtoDesignsTab";
import { MtoInquiriesTab } from "@/components/admin/MtoInquiriesTab";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { authChecked, isAdmin, logout } = useAdminAuth();
  const { cars, inquiries, mtoDesigns, mtoInquiries, refresh } = useAdminData();

  useEffect(() => {
    if (authChecked && isAdmin) refresh();
  }, [authChecked, isAdmin, refresh]);

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!isAdmin) {
    return <AdminAccessDenied onSignOut={logout} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin</div>
            <h1 className="font-display text-4xl">Tabs</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />Sign Out
          </Button>
        </div>

        <Tabs defaultValue="cars">
          <TabsList>
            <TabsTrigger value="cars">Cars ({cars.length})</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="mto-designs">MTO Designs ({mtoDesigns.length})</TabsTrigger>
            <TabsTrigger value="mto-inquiries">MTO Inquiries ({mtoInquiries.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="cars" className="mt-6">
            <CarsTab cars={cars} onRefresh={refresh} />
          </TabsContent>

          <TabsContent value="inquiries" className="mt-6">
            <InquiriesTab inquiries={inquiries} />
          </TabsContent>

          <TabsContent value="mto-designs" className="mt-6">
            <MtoDesignsTab designs={mtoDesigns} onRefresh={refresh} />
          </TabsContent>

          <TabsContent value="mto-inquiries" className="mt-6">
            <MtoInquiriesTab inquiries={mtoInquiries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}