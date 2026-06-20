import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { MtoDesign } from "@/types/admin";

export function MtoDesignFormDialog({ design, onSaved }: { design: MtoDesign | null; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<"minivan" | "minitruck">(design?.category ?? "minivan");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(design?.image_url ?? null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name")).trim();
    const description = String(fd.get("description") || "");
    if (!name) { toast.error("Name required"); return; }
    if (!existingImage && !imageFile) { toast.error("Image required"); return; }
    setSaving(true);

    let image_url = existingImage ?? "";
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `mto/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("car-images").upload(path, imageFile);
      if (upErr) { toast.error(upErr.message); setSaving(false); return; }
      image_url = supabase.storage.from("car-images").getPublicUrl(path).data.publicUrl;
    }

    const payload = { name, category, description: description || null, image_url };
    const { error } = design
      ? await supabase.from("made_to_order_designs").update(payload).eq("id", design.id)
      : await supabase.from("made_to_order_designs").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(design ? "Design updated" : "Design added");
    onSaved();
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle className="font-display text-2xl">{design ? "Edit Design" : "Add Minivan / Minitruck"}</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Category</Label>
          <div className="flex gap-2 mt-1">
            {(["minivan", "minitruck"] as const).map((c) => (
              <Button key={c} type="button" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)} className="capitalize flex-1">
                {c}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={design?.name ?? ""} maxLength={150} />
        </div>
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" name="description" defaultValue={design?.description ?? ""} maxLength={500} />
        </div>
        <div>
          <Label htmlFor="mto-image">Image</Label>
          <Input id="mto-image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          {(imageFile || existingImage) && (
            <div className="mt-3 relative w-fit">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : existingImage!}
                alt=""
                className="h-32 w-44 object-contain bg-muted rounded"
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setExistingImage(null); }}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs leading-none"
              >×</button>
            </div>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : design ? "Update Design" : "Add Design"}</Button>
      </form>
    </DialogContent>
  );
}