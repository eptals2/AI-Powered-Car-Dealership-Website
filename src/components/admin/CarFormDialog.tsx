import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Car } from "@/types/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function CarFormDialog({ car, onSaved }: { car: Car | null; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    (car?.images && car.images.length > 0)
      ? car.images
      : car?.image_url ? [car.image_url] : []
  );
  const [accessories, setAccessories] = useState<string[]>(
    car?.accessories ?? []
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
    const brand = String(fd.get("brand")).trim();
    const name = String(fd.get("name")).trim();
    const price = Number(fd.get("price"));
    const year_model = String(fd.get("year_model")).trim();
    const type = String(fd.get("type")).trim();
    const color = String(fd.get("color")).trim();
    const category = String(fd.get("category")).trim();
    const transmission = String(fd.get("transmission")).trim();
    const wheel_drive = String(fd.get("wheel_drive")).trim();
    {/*accessories*/ }
    fd.append("accessories", JSON.stringify(accessories));
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

    const payload = {
      brand,
      name,
      price,
      description,
      image_url,
      images,
      category,
      year_model,
      type,
      color,
      transmission,
      wheel_drive,
      accessories
    };
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
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <Label>Brand</Label>
            <Select name="brand" required defaultValue={car?.brand ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suzuki">Suzuki</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                <SelectItem value="Hyundai">Hyundai</SelectItem>
                <SelectItem value="Nissan">Nissan</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={car?.name ?? ""} maxLength={150} />
          </div>
          <div>
            <Label htmlFor="price">Price (PHP)</Label>
            <Input id="price" name="price" type="number" required defaultValue={car?.price ?? ""} />
          </div>
          <div>
            <Label htmlFor="year_model">Year Model</Label>
            <Select
              name="year_model"
              required
              defaultValue={car?.year_model != null ? String(car.year_model) : undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year model" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select name="type" required defaultValue={car?.type ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Minivan">Minivan</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Select name="color" required defaultValue={car?.color ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Gray">Gray</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Maroon">Maroon</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Purple">Purple</SelectItem>
                <SelectItem value="Biege">Biege</SelectItem>
                <SelectItem value="Orange">Orange</SelectItem>
                <SelectItem value="Metallic-Gray">Mettalic Gray</SelectItem>
                <SelectItem value="Black-White">Black-White</SelectItem>
                <SelectItem value="Black-Biege">Black-Biege</SelectItem>
                <SelectItem value="Black-Biege">Black-Yellow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Transmission</Label>
            <Select name="transmission" required defaultValue={car?.transmission ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Wheel Drive</Label>
            <Select name="wheel_drive" required defaultValue={car?.wheel_drive ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select wheel drive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4x2">4x2</SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
                <SelectItem value="FWD">4x2 - Front Wheel Drive</SelectItem>
                <SelectItem value="RWD">4x2 - Rear Wheel Drive</SelectItem>
                <SelectItem value="AWD">All Wheel Drive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              name="category"
              required
              defaultValue={car?.category ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surplus">Surplus</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 xl:col-span-3">
            <Label>Accessories</Label>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { id: "canopy/roofrack", label: "Canopy (pickup) | Roof Rack (minivan)" },
                { id: "mags", label: "Mags" },
                { id: "front bumper", label: "Front Bumper" },
                { id: "rear stepboard", label: "Rear Stepboard" },
                { id: "ladder", label: "Ladder" },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={accessories.includes(item.id)}
                    onCheckedChange={(checked) => {
                      setAccessories((prev) =>
                        checked
                          ? [...prev, item.id]
                          : prev.filter((a) => a !== item.id)
                      );
                    }}
                  />
                  <Label htmlFor={item.id} className="font-normal">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
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