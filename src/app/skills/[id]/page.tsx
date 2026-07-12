import { ListingDetailClient } from "@/components/listing-detail-client";

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetailClient id={id} />;
}
