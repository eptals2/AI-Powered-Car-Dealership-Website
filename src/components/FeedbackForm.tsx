import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TYPES = [
    { value: "feedback", label: "Feedback", icon: "👍" },
    { value: "complaint", label: "Complaint", icon: "⚠️" },
    { value: "inquiry", label: "Inquiry", icon: "❓" },
] as const;

export function FeedbackForm() {
    const [rating, setRating] = useState(3);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const [form, setForm] = useState({
        name: "", email: "", subject: "", message: "",
    });

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    async function handleSubmit() {
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.from("feedbacks").insert({
            ...form, rating,
        });
        setLoading(false);
        if (error) { toast.error("Something went wrong. Please try again."); return; }
        setDone(true);
    }

    if (done) return (
        <div className="text-center py-10 space-y-3">
            <p className="text-2xl">✅</p>
            <p className="font-medium">Thank you for reaching out!</p>
            <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
            <Button variant="outline" onClick={() => { setDone(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                Submit another
            </Button>
        </div>
    );

    return (
        <div className="">
            <div>
                <p className="font-medium text-xl">Kindly leave us a review</p>
                {/* <p className="text-xl text-muted-foreground">All submissions are reviewed within 24 hours</p> */}
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                    <div><Label>Full name *</Label><Input value={form.name} onChange={set("name")} placeholder="Juan dela Cruz" /></div>
                    <div><Label>Email *</Label><Input type="email" value={form.email} onChange={set("email")} placeholder="juan@email.com" /></div>
                </div>

                {/* <div>
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
                {TYPES.map(t => (
                    <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`py-2 rounded-lg border text-sm transition-colors ${
                        type === t.value
                        ? "border-blue-400 bg-blue-50 text-blue-800"
                        : "border-border bg-muted text-muted-foreground hover:bg-background"
                    }`}
                    >
                    <span className="block text-lg">{t.icon}</span>
                    {t.label}
                    </button>
                ))}
                </div>
            </div> */}
            </div>

            <div>
                <Label>Overall experience</Label>
                <div className="flex gap-1 mt-0">
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHover(s)}
                            onMouseLeave={() => setHover(0)}
                            className={`text-2xl transition-colors ${s <= (hover || rating) ? "text-amber-500" : "text-muted"}`}
                        >★</button>
                    ))}
                </div>
            </div>

            <div><Label>Subject</Label><Input value={form.subject} onChange={set("subject")} placeholder="Brief description" /></div>
            <div><Label>Message *</Label><Textarea value={form.message} onChange={set("message")} rows={4} placeholder="Tell us more..." /></div>

            <Button className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </div>
    );
}