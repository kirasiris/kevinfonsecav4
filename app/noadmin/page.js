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

const listQuery = {
	page: 1,
	limit: 10,
};

async function getApi(path) {
	try {
		return await fetchurl(path, "GET", "default");
	} catch {
		return { success: false };
	}
}

const getGlobal = (resource, params = "") =>
	getApi(`/global/${resource}${params}`);

const isEmptyList = (res) =>
	res?.status === "fail" && /does not exist/i.test(res?.message || "");

const loaded = (res, text) =>
	res?.success || isEmptyList(res) ? text : `Could not load`;

const AdminHome = async ({ params, searchParams }) => {
	const [
		token,
		auth,
		blogs,
		themes,
		comments,
		categories,
		activeusers,
		inactiveusers,
		files,
		quotes,
		events,
		activities,
		logs,
		failLogs,
		errorLogs,
	] = await Promise.all([
		getAuthTokenOnServer(),
		getUserOnServer(),
		getGlobal("blogs", `?${ALL}&postType=blog`),
		getGlobal("themes", `?${ALL}&postType=theme`),
		getGlobal("comments", `?${ALL}&postType=comment`),
		getGlobal("categories", `?${ALL}`),
		getGlobal("users", `?${ALL}&isEmailConfirmed=true`),
		getGlobal("users", `?${ALL}&isEmailConfirmed=false`),
		getGlobal("files", `?${ALL}`),
		getGlobal("quotes", `?${ALL}`),
		getGlobal("events", `?${ALL}&postType=appointment&status=scheduled`),
		getGlobal("activities", `?${ALL}`),
		getGlobal("logs", `?${ALL}`),
		getGlobal("logs", `?status=fail&${COUNT_ONLY}`),
		getGlobal("logs", `?status=error&${COUNT_ONLY}`),
	]);

	const stats = buildDashboard({
		blogs: getItems(blogs),
		themes: getItems(themes),
		comments: getItems(comments),
		categories: getItems(categories),
		activeusers: getItems(activeusers),
		inactiveusers: getItems(inactiveusers),
		files: getItems(files),
		quotes: getItems(quotes),
		events: getItems(events),
		activities: getItems(activities),
		logs: getItems(logs),
	});

	const publishedText = (res) =>
		loaded(res, `${getItems(res).filter(isPublished).length} published`);

	const activityTotal = stats.activity.series
		.flatMap((s) => s.data)
		.reduce((a, b) => a + b, 0);

	const logStatus = {
		labels: ["Fail (4xx)", "Error (5xx)"],
		values: [getTotal(failLogs), getTotal(errorLogs)],
		colors: [COLORS.silver, COLORS.dark],
	};
	const logStatusTotal = logStatus.values[0] + logStatus.values[1];

	return (
		<div className="container-fluid px-0">
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
						`${stats.blogsPublished} published · ${stats.blogsDrafts} drafts`,
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
			</div>
			<div className="row">
				<DynamicCard
					colClass="col-lg-4"
					title="Active Users"
					text={getTotal(activeusers) || `0`}
					// subtext={loaded(users, `${formatBytes(stats.totalFileBytes)} stored`)}
					myLink="/noadmin/users"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-4"
					title="Inactive Users"
					text={getTotal(inactiveusers) || `0`}
					// subtext={loaded(users, `${formatBytes(stats.totalFileBytes)} stored`)}
					myLink="/noadmin/users"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-lg-4"
					title="Appointments"
					text={getTotal(events) || `0`}
					subtext={loaded(events, `${stats.upcomingEventCount} upcoming`)}
					myLink="/noadmin/events"
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
					colClass="col-6 col-md-6"
					textClass="display-6"
					title="Activities"
					text={getTotal(activities) || `0`}
					subtext={loaded(
						activities,
						`${stats.activitiesLast7Days} in the last 7 days`,
					)}
					myLink="#!"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-6 col-md-6"
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
		</div>
	);
};

export default AdminHome;
