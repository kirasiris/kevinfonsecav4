import DynamicCard from "@/components/noadmin/dynamiccard";
import Panel from "@/components/noadmin/dashboard/panel";
import BarChart from "@/components/noadmin/dashboard/barchart";
import LineChart from "@/components/noadmin/dashboard/linechart";
import DoughnutChart from "@/components/noadmin/dashboard/doughnutchart";
import RecentBlogs from "@/components/noadmin/dashboard/recentblogs";
import RecentComments from "@/components/noadmin/dashboard/recentcomments";
import RecentActivity from "@/components/noadmin/dashboard/recentactivity";
import UpcomingEvents from "@/components/noadmin/dashboard/upcomingevents";
import MostCommented from "@/components/noadmin/dashboard/mostcommented";
import RankedList from "@/components/noadmin/dashboard/rankedlist";
import FileTypes from "@/components/noadmin/dashboard/filetypes";
import Header from "@/layout/header";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import {
	COLORS,
	buildDashboard,
	formatBytes,
	getItems,
	getTotal,
	isPublished,
} from "@/helpers/dashboard/dashboardstats";
import CreateQuickDraftBlogForm from "@/forms/noadmin/dashboard/quickdraftform";

const ALL = `limit=500`;
const COUNT_ONLY = `limit=1`;

// fetchurl resolves with the error JSON on API failures, but a route that
// doesn't exist yet (e.g. /global/qrcodes → Express HTML 404) can throw while
// parsing, so one missing endpoint must not take down the whole dashboard.
async function getGlobal(resource, params = "") {
	try {
		return await fetchurl(`/global/${resource}${params}`, "GET", "default");
	} catch {
		return { success: false };
	}
}

const listQuery = {
	page: 1,
	limit: 10,
};

const loaded = (res, text) => (res?.success ? text : `Could not load`);

const AdminHome = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const [
		blogs,
		themes,
		comments,
		categories,
		files,
		songs,
		videos,
		pages,
		snippets,
		quotes,
		events,
		companies,
		presentations,
		secrets,
		settings,
		qrcodes,
		weapons,
		activities,
		logs,
		failLogs,
		errorLogs,
	] = await Promise.all([
		getGlobal("blogs", `?postType=blog&${ALL}`),
		getGlobal("themes", `?postType=theme&${ALL}`),
		getGlobal("comments", `?${ALL}`),
		getGlobal("categories", `?${ALL}`),
		getGlobal("files", `?${ALL}`),
		getGlobal("songs", `?${ALL}`),
		getGlobal("videos", `?${ALL}`),
		getGlobal("pages", `?${ALL}`),
		getGlobal("snippets", `?${ALL}`),
		getGlobal("quotes", `?${ALL}`),
		getGlobal("events", `?${ALL}`),
		getGlobal("companies", `?${ALL}`),
		getGlobal("presentations", `?${ALL}`),
		getGlobal("secrets", `?${ALL}`),
		getGlobal("settings", `?${ALL}`),
		getGlobal("qrcodes", `?${ALL}`),
		getGlobal("weaponacquisitionsdisposals", `?${ALL}`),
		getGlobal("activities", `?${ALL}`),
		// Logs grow by tens of thousands; only pull the latest page for the
		// breakdown and read the per-status totals from countAll.
		getGlobal("logs", `?${ALL}`),
		getGlobal("logs", `?status=fail&${COUNT_ONLY}`),
		getGlobal("logs", `?status=error&${COUNT_ONLY}`),
	]);

	const stats = buildDashboard({
		blogs: getItems(blogs),
		themes: getItems(themes),
		comments: getItems(comments),
		categories: getItems(categories),
		files: getItems(files),
		songs: getItems(songs),
		videos: getItems(videos),
		pages: getItems(pages),
		snippets: getItems(snippets),
		quotes: getItems(quotes),
		events: getItems(events),
		secrets: getItems(secrets),
		activities: getItems(activities),
		logs: getItems(logs),
		weapons: getItems(weapons),
	});

	const publishedText = (res) =>
		loaded(res, `${getItems(res).filter(isPublished).length} published`);

	const blogsPublished = getItems(blogs).filter(isPublished).length;
	const activityTotal = stats.activity.series
		.flatMap((s) => s.data)
		.reduce((a, b) => a + b, 0);

	const logStatus = {
		labels: ["Fail (4xx)", "Error (5xx)"],
		values: [getTotal(failLogs), getTotal(errorLogs)],
		colors: [COLORS.silver, COLORS.dark],
	};
	const logStatusTotal = logStatus.values[0] + logStatus.values[1];

	const settingsItems = getItems(settings);
	const presentationItems = getItems(presentations);
	const weaponItems = getItems(weapons);

	return (
		<>
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCard
					colClass="col-lg-3"
					title="Blogs"
					text={getTotal(blogs) || `0`}
					subtext={loaded(
						blogs,
						`${blogsPublished} published · ${getTotal(blogs) - blogsPublished} drafts`,
					)}
					myLink="/noadmin/blogs"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-3"
					title="Themes"
					text={getTotal(themes) || `0`}
					subtext={publishedText(themes)}
					myLink="/noadmin/themes"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-3"
					title="Comments"
					text={getTotal(comments) || `0`}
					subtext={loaded(
						comments,
						`${stats.commentsLast30Days} in the last 30 days`,
					)}
					myLink="/noadmin/comments"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-3"
					title="Categories"
					text={getTotal(categories) || `0`}
					subtext={loaded(
						categories,
						`${stats.categoriesByType.labels.length} category types`,
					)}
					myLink="/noadmin/categories"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-12"
					title="Files"
					text={getTotal(files) || `0`}
					subtext={loaded(files, `${formatBytes(stats.totalFileBytes)} stored`)}
					myLink="/noadmin/files"
					myQuery={listQuery}
				/>
			</div>
			<div className="row">
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Songs"
					text={getTotal(songs) || `0`}
					subtext={publishedText(songs)}
					myLink="/noadmin/songs"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Videos"
					text={getTotal(videos) || `0`}
					subtext={loaded(
						videos,
						`${stats.totalVideoViews?.toLocaleString()} views`,
					)}
					myLink="/noadmin/videos"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Pages"
					text={getTotal(pages) || `0`}
					subtext={loaded(pages, `${stats.publishedPages} published`)}
					myLink="/noadmin/pages"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Snippets"
					text={getTotal(snippets) || `0`}
					subtext={publishedText(snippets)}
					myLink="/noadmin/snippets"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Quotes"
					text={getTotal(quotes) || `0`}
					subtext={publishedText(quotes)}
					myLink="/noadmin/quotes"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-4 col-xl-2"
					textClass="display-5"
					title="Events"
					text={getTotal(events) || `0`}
					subtext={loaded(events, `${stats.upcomingEventCount} upcoming`)}
					myLink="/noadmin/events"
					myQuery={listQuery}
				/>
			</div>
			<div className="row">
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Companies"
					text={getTotal(companies) || `0`}
					subtext={publishedText(companies)}
					myLink="/noadmin/companies"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Presentations"
					text={getTotal(presentations) || `0`}
					subtext={loaded(
						presentations,
						`${presentationItems.filter((p) => p.isPaid).length} paid · ${presentationItems.filter((p) => p.isPasswordProtected).length} protected`,
					)}
					myLink="/noadmin/presentations"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Secrets"
					text={getTotal(secrets) || `0`}
					subtext={loaded(secrets, `${stats.nsfwSecrets} flagged NSFW`)}
					myLink="/noadmin/secrets"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Settings"
					text={getTotal(settings) || `0`}
					subtext={loaded(
						settings,
						`${settingsItems.filter((s) => s.maintenance).length} in maintenance`,
					)}
					myLink="/noadmin/settings"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="QR codes"
					text={getTotal(qrcodes) || `0`}
					subtext={publishedText(qrcodes)}
					myLink="/noadmin/qrcodes"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Acquisitions & dispositions"
					text={getTotal(weapons) || `0`}
					subtext={loaded(
						weapons,
						`${weaponItems.length - stats.weaponsOnHand} disposed · ${stats.weaponsOnHand} on hand`,
					)}
					myLink="/noadmin/weaponacquisitionsdisposals"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Activities"
					text={getTotal(activities) || `0`}
					subtext={loaded(
						activities,
						`${stats.activitiesLast7Days} in the last 7 days`,
					)}
					myLink="/noadmin/activities"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-3"
					textClass="display-6"
					title="Logs"
					text={(getTotal(logs) || 0).toLocaleString()}
					subtext={loaded(
						errorLogs,
						`${getTotal(errorLogs).toLocaleString()} server errors`,
					)}
					myLink="/noadmin/logs"
					myQuery={listQuery}
				/>
			</div>
			<div className="row">
				<div className="col-lg-8 mb-3">
					<div className="card h-100">
						<div className="card-header">
							At a Glance
							<small className="d-block text-body-secondary">
								New items created per month, last 12 months
							</small>
						</div>
						<div className="card-body">
							{activityTotal === 0 ? (
								<p className="text-body-secondary small text-center py-5 mb-0">
									No activity in the last 12 months.
								</p>
							) : (
								<BarChart
									labels={stats.activity.labels}
									series={stats.activity.series}
									stacked
									height={320}
									ariaLabel="Stacked bar chart of blogs, comments, songs and videos, and files created per month over the last 12 months"
								/>
							)}
						</div>
					</div>
				</div>
				<Panel
					title="Blog status"
					subtitle="Published vs. drafts"
					colClasses="col-lg-4"
					isEmpty={stats.blogStatus.values.length === 0}
				>
					<DoughnutChart
						labels={stats.blogStatus.labels}
						values={stats.blogStatus.values}
						colors={stats.blogStatus.colors}
						height={320}
						ariaLabel={`Blog status: ${stats.blogStatus.labels
							.map((l, i) => `${l} ${stats.blogStatus.values[i]}`)
							.join(", ")}`}
					/>
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Content growth"
					subtitle="Running total since the first upload"
					isEmpty={stats.growth.labels.length === 0}
				>
					<LineChart
						labels={stats.growth.labels}
						series={stats.growth.series}
						height={300}
						ariaLabel="Line chart of cumulative blogs, files, and songs and videos over time"
					/>
				</Panel>
				<Panel
					title="Blogs per category"
					subtitle="Top categories by number of blogs"
					isEmpty={stats.blogsByCategory.labels.length === 0}
				>
					<BarChart
						labels={stats.blogsByCategory.labels}
						series={stats.blogsByCategory.series}
						horizontal
						height={300}
						ariaLabel={`Blogs per category: ${stats.blogsByCategory.labels
							.map((l, i) => `${l} ${stats.blogsByCategory.series[0].data[i]}`)
							.join(", ")}`}
					/>
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Content status"
					subtitle="Published, drafts and trash across every content type"
					colClasses="col-lg-8"
					isEmpty={stats.contentStatus.labels.length === 0}
				>
					<BarChart
						labels={stats.contentStatus.labels}
						series={stats.contentStatus.series}
						stacked
						horizontal
						height={320}
						ariaLabel={`Content status: ${stats.contentStatus.labels
							.map(
								(l, i) =>
									`${l} ${stats.contentStatus.series
										.map((s) => `${s.data[i]} ${s.label.toLowerCase()}`)
										.join(", ")}`,
							)
							.join("; ")}`}
					/>
				</Panel>
				<Panel
					title="Activity by resource"
					subtitle="What the latest actions touched"
					colClasses="col-lg-4"
					isEmpty={stats.activityByModel.values.length === 0}
				>
					<DoughnutChart
						labels={stats.activityByModel.labels}
						values={stats.activityByModel.values}
						colors={stats.activityByModel.colors}
						height={320}
						ariaLabel={`Activity by resource: ${stats.activityByModel.labels
							.map((l, i) => `${l} ${stats.activityByModel.values[i]}`)
							.join(", ")}`}
					/>
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Top videos"
					subtitle="Most viewed videos"
					isEmpty={stats.topVideos.labels.length === 0}
				>
					<BarChart
						labels={stats.topVideos.labels}
						series={stats.topVideos.series}
						horizontal
						height={300}
						ariaLabel={`Top videos by views: ${stats.topVideos.labels
							.map((l, i) => `${l} ${stats.topVideos.series[0].data[i]}`)
							.join(", ")}`}
					/>
				</Panel>
				<Panel
					title="Acquisitions & dispositions"
					subtitle={stats.weaponTypes || "Received vs. disposed per month"}
					isEmpty={stats.weaponFlow.labels.length === 0}
				>
					<BarChart
						labels={stats.weaponFlow.labels}
						series={stats.weaponFlow.series}
						height={300}
						ariaLabel="Bar chart of firearms received and disposed per month"
					/>
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Files by type"
					subtitle="Uploads grouped by format"
					colClasses="col-md-6 col-xl-4"
					isEmpty={stats.filesByType.values.length === 0}
				>
					<DoughnutChart
						labels={stats.filesByType.labels}
						values={stats.filesByType.values}
						colors={stats.filesByType.colors}
						height={220}
						ariaLabel={`Files by type: ${stats.filesByType.labels
							.map((l, i) => `${l} ${stats.filesByType.values[i]}`)
							.join(", ")}`}
					/>
					<FileTypes rows={stats.filesByType.breakdown} />
				</Panel>
				<Panel
					title="Categories by type"
					subtitle="What each category is used for"
					colClasses="col-md-6 col-xl-4"
					isEmpty={stats.categoriesByType.labels.length === 0}
				>
					<BarChart
						labels={stats.categoriesByType.labels}
						series={stats.categoriesByType.series}
						height={340}
						ariaLabel={`Categories by type: ${stats.categoriesByType.labels
							.map((l, i) => `${l} ${stats.categoriesByType.series[0].data[i]}`)
							.join(", ")}`}
					/>
				</Panel>
				<Panel
					title="Most commented"
					subtitle="Posts with the most discussion"
					colClasses="col-xl-4"
					isEmpty={stats.mostCommented.length === 0}
				>
					<MostCommented items={stats.mostCommented} />
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Log health"
					subtitle="All-time failures vs. server errors"
					colClasses="col-md-6 col-xl-4"
					isEmpty={logStatusTotal === 0}
				>
					<DoughnutChart
						labels={logStatus.labels}
						values={logStatus.values}
						colors={logStatus.colors}
						height={260}
						ariaLabel={`Log health: ${logStatus.labels
							.map((l, i) => `${l} ${logStatus.values[i]}`)
							.join(", ")}`}
					/>
				</Panel>
				<Panel
					title="Top log messages"
					subtitle="Most frequent in the latest 500 entries"
					colClasses="col-md-6 col-xl-4"
					isEmpty={stats.topLogMessages.length === 0}
				>
					<RankedList
						items={stats.topLogMessages}
						singular="entry"
						plural="entries"
						barClass="bg-secondary"
					/>
				</Panel>
				<Panel
					title="Upcoming events"
					subtitle="Next five, excluding trash"
					colClasses="col-xl-4"
					isEmpty={stats.upcomingEvents.length === 0}
				>
					<UpcomingEvents events={stats.upcomingEvents} />
				</Panel>
			</div>
			<div className="row">
				<Panel title="Quick draft" subtitle="" colClasses="col-lg-2">
					<CreateQuickDraftBlogForm
						token={token}
						auth={auth}
						objects={categories}
					/>
				</Panel>
				<Panel
					title="Recent blogs"
					subtitle="Latest six, including drafts"
					colClasses="col-lg-5"
					cardClasses=""
					isEmpty={stats.recentBlogs.length === 0}
				>
					<RecentBlogs blogs={stats.recentBlogs} />
				</Panel>
				<Panel
					title="Recent comments"
					subtitle="Latest six"
					colClasses="col-lg-5"
					isEmpty={stats.recentComments.length === 0}
				>
					<RecentComments comments={stats.recentComments} />
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Recent activity"
					subtitle="Latest eight actions across the site"
					colClasses="col-12"
					isEmpty={stats.recentActivity.length === 0}
				>
					<RecentActivity items={stats.recentActivity} />
				</Panel>
			</div>
		</>
	);
};

export default AdminHome;
