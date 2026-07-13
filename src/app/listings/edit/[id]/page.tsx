import { ListingEditor } from "@/components/listing-editor";

export const metadata = {
  title: "Edit Listing",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListingEditor listingId={id} />;
}
