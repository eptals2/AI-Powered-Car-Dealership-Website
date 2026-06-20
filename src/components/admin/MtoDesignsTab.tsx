import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { MtoDesign } from "@/types/admin";
import { MtoDesignFormDialog } from "@/components/admin/MtoDesignFormDialog";

export function MtoDesignsTab({ designs, onRefresh }: { designs: MtoDesign[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<MtoDesign | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDelete(d: MtoDesign) {
    if (!confirm(`Delete design "${d.name}"?`)) return;
    const { error } = await supabase.from("made_to_order_designs").delete().eq("id", d.id);
    if (error) toast.error(error.message);
    else { toast.success("Design deleted"); onRefresh(); }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">Manage made-to-order minivan and minitruck designs.</p>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Add Minivan / Minitruck
            </Button>
          </DialogTrigger>
          <MtoDesignFormDialog design={editing} onSaved={() => { setDialogOpen(false); setEditing(null); onRefresh(); }} />
        </Dialog>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designs.map((d) => (
              <TableRow key={d.id}>
                <TableCell><img src={d.image_url} alt={d.name} className="h-12 w-16 object-contain bg-muted rounded" /></TableCell>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{d.category}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(d); setDialogOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(d)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {designs.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No designs yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}