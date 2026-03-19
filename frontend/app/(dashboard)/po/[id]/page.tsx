import PODetailContent from "./_components/PODetailContent";

export default async function PODetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PODetailContent id={Number(id)} />;
}
