import FINANCING_DETAILS from "@/ai/knowledge/financing";
import MADE_TO_ORDER_DETAILS from "@/ai/knowledge/made-to-order";
import DELEARSHIP_INFORMATION from "@/ai/knowledge/made-to-order";

type KnowledgeDoc = {
  title: string;
  content: string;
};

const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  { title: "Dealership Info", content: DELEARSHIP_INFORMATION },
  { title: "Financing", content: FINANCING_DETAILS },
  { title: "Made to Order", content: MADE_TO_ORDER_DETAILS },
];

export function loadKnowledgeBase(): string {
  return KNOWLEDGE_DOCS
    .map((doc) => `## ${doc.title}\n${doc.content.trim()}`)
    .join("\n\n---\n\n");
}