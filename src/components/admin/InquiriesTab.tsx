import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PHP } from "@/lib/format";
import type { InquiryWithCar } from "@/types/admin";

export function InquiriesTab({ inquiries }: { inquiries: InquiryWithCar[] }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>DP</TableHead>
            <TableHead>Monthly</TableHead>
            <TableHead>Years</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="text-xs">{new Date(q.created_at).toLocaleDateString()}</TableCell>
              <TableCell><Badge variant={q.inquiry_type === "reserve" ? "default" : "secondary"}>{q.inquiry_type}</Badge></TableCell>
              <TableCell className="font-medium">{q.full_name}</TableCell>
              <TableCell className="text-xs">{q.contact_number}<br /><span className="text-muted-foreground">{q.email}</span></TableCell>
              <TableCell>{q.cars?.name ?? "—"}</TableCell>
              <TableCell>{PHP(Number(q.downpayment))}</TableCell>
              <TableCell>{PHP(Number(q.monthly_payment))}</TableCell>
              <TableCell>{q.years_to_pay}</TableCell>
            </TableRow>
          ))}
          {inquiries.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No inquiries yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}