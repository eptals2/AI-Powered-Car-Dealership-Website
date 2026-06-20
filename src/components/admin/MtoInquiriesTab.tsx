import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MtoInquiry } from "@/types/admin";

export function MtoInquiriesTab({ inquiries }: { inquiries: MtoInquiry[] }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Design</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="text-xs">{new Date(q.created_at).toLocaleDateString()}</TableCell>
              <TableCell><Badge variant="secondary" className="capitalize">{q.category}</Badge></TableCell>
              <TableCell>{q.design_name ?? "—"}</TableCell>
              <TableCell className="font-medium">{q.full_name}</TableCell>
              <TableCell className="text-xs">{q.contact_number}<br /><span className="text-muted-foreground">{q.email}</span></TableCell>
              <TableCell className="text-xs max-w-[260px] whitespace-pre-wrap">{q.notes ?? "—"}</TableCell>
            </TableRow>
          ))}
          {inquiries.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No made-to-order inquiries yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}