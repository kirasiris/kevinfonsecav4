import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import Scheduler from "@/components/noadmin/events/scheduler";
import { serverClock } from "@/helpers/events/date-utils";

async function getEvents(params) {
	const res = await fetchurl(`/global/events${params}`, "GET", "no-store");
	return res;
}

async function getAvailability({ from, to }) {
	const params = new URLSearchParams({ from: from || "", to: to || "" });
	const res = await fetchurl(
		`/noadmin/events/availability?${params.toString()}`,
	);
	return res;
}

const initialWindow = (now) => {
	const anchor = new Date(now.getFullYear(), now.getMonth(), 1);
	anchor.setHours(0, 0, 0, 0);
	anchor.setDate(anchor.getDate() - anchor.getDay() - 7);

	const end = new Date(anchor);
	end.setDate(end.getDate() + 49);

	const iso = (d) =>
		`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
			d.getDate(),
		).padStart(2, "0")}`;

	return { from: iso(anchor), to: iso(end) };
};

const AdminEventsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 200;
	const sort = awtdSearchParams.sort || "-createdAt";

	const now = new Date();

	const [events, availability] = await Promise.all([
		getEvents(`?page=${page}&limit=${limit}&sort=${sort}&decrypt=true`),
		getAvailability(initialWindow(now)),
	]);

	const clock = serverClock(now);

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/events"
				publishedLink="/noadmin/events/published"
				draftLink="/noadmin/events/draft"
				scheduledLink="/noadmin/events/scheduled"
				trashedLink="/noadmin/events/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<Scheduler
				objects={events}
				loadError={events.success ? "" : events.message}
				clock={clock}
				initialAvailability={availability.success ? availability.data : null}
			/>
		</>
	);
};

export default AdminEventsIndex;
