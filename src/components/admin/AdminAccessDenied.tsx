import { Button } from "@/components/ui/button";

export function AdminAccessDenied({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">Your account does not have admin privileges.</p>
        <Button className="mt-6" onClick={onSignOut}>Sign Out</Button>
      </div>
    </div>
  );
}