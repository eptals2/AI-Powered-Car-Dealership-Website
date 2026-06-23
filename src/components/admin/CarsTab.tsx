import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PHP } from "@/lib/format";
import { toast } from "sonner";
import { Plus, Pencil, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Car } from "@/types/admin";
import { CarFormDialog } from "./CarFormDialog";

export function CarsTab({ cars, onRefresh }: { cars: Car[]; onRefresh: () => void }) {
  const [carSearch, setCarSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "surplus" | "commercial">("all");
  const [editing, setEditing] = useState<Car | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = cars
    .filter((c) => c.name.toLowerCase().includes(carSearch.trim().toLowerCase()))
    .filter((c) => categoryFilter === "all" || c.category === categoryFilter);

  async function toggleStatus(c: Car) {
    const next = c.status === "available" ? "out_of_stock" : "available";
    const { error } = await supabase.from("cars").update({ status: next }).eq("id", c.id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); onRefresh(); }
  }

  async function handleDelete(c: Car) {
    if (!confirm(`Delete car: "${c.name}"?`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", c.id);
    if (error) toast.error(error.message);
    else { toast.success("Car deleted"); onRefresh(); }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cars..."
              value={carSearch}
              onChange={(e) => setCarSearch(e.target.value)}
              className="pl-9 w-[220px]"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="surplus">Surplus</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Add Car
            </Button>
          </DialogTrigger>
          <CarFormDialog car={editing} onSaved={() => { setDialogOpen(false); setEditing(null); onRefresh(); }} />
        </Dialog>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-small">{String(c.id).slice(-5)}</TableCell>
                <TableCell className="font-small">
                  {c.brand} {c.name} {c.category === "commercial" ? c.year_model : ""} {c.accessories?.length ? (
                    <>
                      <span className="font-small text-foreground">with</span>{" "}
                      {c.accessories.join(" • ")}
                    </>
                  ) : c.category === "surplus" && (
                    <span className="">Basic Setup</span> 
                  )}
                  <span> {c.transmission} </span>
                  <span> {c.wheel_drive} </span>
                  <span> {c.color} </span>
                </TableCell>
                <TableCell>
                  {c.category
                    ? <Badge variant="secondary" className="capitalize">{c.category}</Badge>
                    : <span className="text-muted-foreground text-xs">—</span>}
                </TableCell>
                <TableCell>{PHP(Number(c.price))}</TableCell>
                <TableCell>
                  {c.status === "available"
                    ? <Badge>Available</Badge>
                    : <Badge variant="destructive">Not Available</Badge>}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleStatus(c)}>
                    {c.status === "available" ? "Suspend" : "Restore"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No cars match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}