import { Feedbacks } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function FeedbacksTab({ feedback: feedbacks }: { feedback: Feedbacks[] })  {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((f: any) => (
            <TableRow key={f.id}>
              <TableCell className="text-xs">{new Date(f.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{f.name ?? "—"}</TableCell>
              <TableCell className="text-xs">{f.contact_number}<br /><span className="text-muted-foreground">{f.email}</span></TableCell>
              <TableCell><Badge variant="secondary" className="capitalize">{f.rating}</Badge></TableCell>
              <TableCell className="text-xs max-w-[260px] whitespace-pre-wrap">{f.subject ?? "—"}</TableCell>
              <TableCell className="text-xs max-w-[260px] whitespace-pre-wrap">{f.message ?? "—"}</TableCell>
            </TableRow>
          ))}
          {feedbacks.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No feedbacks yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}