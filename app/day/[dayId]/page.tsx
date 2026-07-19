import { DayScreen } from "../../components/day-screen";

export default async function CampaignDayPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  return <DayScreen dayId={decodeURIComponent(dayId)} />;
}
