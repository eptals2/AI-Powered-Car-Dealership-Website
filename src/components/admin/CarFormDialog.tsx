import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Car } from "@/types/admin";

export function CarFormDialog({ car, onSaved }: { car: Car | null; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<"surplus" | "commercial" | null>(car?.category ?? null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    (car?.images && car.images.length > 0)
      ? car.images
      : car?.image_url ? [car.image_url] : []
  );

  const totalCount = existingImages.length + imageFiles.length;

  function onFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const allowed = Math.max(0, 5 - existingImages.length - imageFiles.length);
    if (picked.length > allowed) toast.error(`You can only add ${allowed} more image(s). Max 5 per car.`);
    setImageFiles((prev) => [...prev, ...picked.slice(0, allowed)]);
    e.target.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name")).trim();
    const price = Number(fd.get("price"));
    const description = String(fd.get("description") || "");
    if (!name || !price) { toast.error("Name and price required"); return; }
    if (existingImages.length + imageFiles.length > 5) { toast.error("Max 5 images per car"); return; }
    setSaving(true);

    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("car-images").upload(path, file);
      if (upErr) { toast.error(upErr.message); setSaving(false); return; }
      uploadedUrls.push(supabase.storage.from("car-images").getPublicUrl(path).data.publicUrl);
    }

    const images = [...existingImages, ...uploadedUrls];
    const image_url = images[0] ?? null;

    const payload = { name, price, description, image_url, images, category };
    const { error } = car
      ? await supabase.from("cars").update(payload).eq("id", car.id)
      : await supabase.from("cars").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(car ? "Car updated" : "Car added");
    onSaved();
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle className="font-display text-2xl">{car ? "Edit Car" : "Add New Car"}</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={car?.name ?? ""} maxLength={150} />
        </div>
        <div>
          <Label htmlFor="price">Price (PHP)</Label>
          <Input id="price" name="price" type="number" required defaultValue={car?.price ?? ""} />
        </div>
        <div>
          <Label>Category</Label>
          <div className="flex gap-2 mt-1">
            {(["surplus", "commercial"] as const).map((c) => (
              <Button
                key={c}
                type="button"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory((prev) => (prev === c ? null : c))}
                className="capitalize flex-1"
              >
                {c}
              </Button>
            ))}
          </div>
          {!category && <p className="text-xs text-muted-foreground mt-1">No category set.</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={car?.description ?? ""} maxLength={500} />
        </div>
        <div>
          <Label htmlFor="image">Images ({totalCount}/5)</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            multiple
            disabled={totalCount >= 5}
            onChange={onFilesPicked}
          />
          <p className="text-xs text-muted-foreground mt-1">Upload up to 5 photos. The first one is used as the cover.</p>
          {(existingImages.length > 0 || imageFiles.length > 0) && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {existingImages.map((url, i) => (
                <div key={`e-${i}`} className="relative">
                  <img src={url} alt="" className="h-20 w-full rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs leading-none"
                  >×</button>
                </div>
              ))}
              {imageFiles.map((file, i) => (
                <div key={`n-${i}`} className="relative">
                  <img src={URL.createObjectURL(file)} alt="" className="h-20 w-full rounded object-cover ring-2 ring-primary" />
                  <button
                    type="button"
                    onClick={() => setImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs leading-none"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : car ? "Update Car" : "Add Car"}</Button>
      </form>
    </DialogContent>
  );
}