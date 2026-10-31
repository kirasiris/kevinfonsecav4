import DynamicCard from "@/components/noadmin/dynamiccard";
import Panel from "@/components/noadmin/dashboard/panel";
import BarChart from "@/components/noadmin/dashboard/barchart";
import LineChart from "@/components/noadmin/dashboard/linechart";
import DoughnutChart from "@/components/noadmin/dashboard/doughnutchart";
import RecentBlogs from "@/components/noadmin/dashboard/recentblogs";
import RecentComments from "@/components/noadmin/dashboard/recentcomments";
import MostCommented from "@/components/noadmin/dashboard/mostcommented";
import FileTypes from "@/components/noadmin/dashboard/filetypes";
import Header from "@/layout/header";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import {
	buildDashboard,
	formatBytes,
	getItems,
	getTotal,
	isPublished,
} from "@/helpers/dashboard/dashboardstats";
import CreateQuickDraftBlogForm from "@/forms/noadmin/dashboard/quickdraftform";

const ALL = `limit=500`;

async function getBlogs(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "default");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "default");
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "default");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "default");
	return res;
}

async function getFiles(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "default");
	return res;
}

async function getSongs(params) {
	const res = await fetchurl(`/global/songs${params}`, "GET", "default");
	return res;
}

async function getVideos(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "default");
	return res;
}

async function getPlaylists(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "default");
	return res;
}

async function getQuotes(params) {
	const res = await fetchurl(`/global/quotes${params}`, "GET", "default");
	return res;
}

async function getProducts(params) {
	const res = await fetchurl(`/global/products${params}`, "GET", "default");
	return res;
}

const listQuery = {
	page: 1,
	limit: 10,
};

const AdminHome = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const blogsData = getBlogs(`?postType=blog&${ALL}`);
	const themesData = getThemes(`?postType=theme&${ALL}`);
	const commentsData = getComments(`?${ALL}`);
	const categoriesData = getCategories(`?${ALL}`);
	const filesData = getFiles(`?${ALL}`);
	const songsData = getSongs(`?${ALL}`);
	const videosData = getVideos(`?${ALL}`);
	const playlistsData = getPlaylists(`?${ALL}`);
	const quotesData = getQuotes(`?${ALL}`);
	const productsData = getProducts(`?${ALL}`);

	const [
		blogs,
		themes,
		comments,
		categories,
		files,
		songs,
		videos,
		playlists,
		quotes,
		products,
	] = await Promise.all([
		blogsData,
		themesData,
		commentsData,
		categoriesData,
		filesData,
		songsData,
		videosData,
		playlistsData,
		quotesData,
		productsData,
	]);

	const stats = buildDashboard({
		blogs: getItems(blogs),
		themes: getItems(themes),
		comments: getItems(comments),
		categories: getItems(categories),
		files: getItems(files),
		songs: getItems(songs),
		videos: getItems(videos),
	});

	const publishedText = (res) =>
		res?.success
			? `${getItems(res).filter(isPublished).length} published`
			: `Could not load`;

	const blogsPublished = getItems(blogs).filter(isPublished).length;
	const activityTotal = stats.activity.series
		.flatMap((s) => s.data)
		.reduce((a, b) => a + b, 0);

	return (
		<>
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCard
					title="Blogs"
					text={getTotal(blogs) || `0`}
					subtext={
						blogs?.success
							? `${blogsPublished} published · ${getTotal(blogs) - blogsPublished} drafts`
							: `Could not load`
					}
					myLink="/noadmin/blogs"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Themes"
					text={getTotal(themes) || `0`}
					subtext={publishedText(themes)}
					myLink="/noadmin/themes"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Comments"
					text={getTotal(comments) || `0`}
					subtext={
						comments?.success
							? `${stats.commentsLast30Days} in the last 30 days`
							: `Could not load`
					}
					myLink="/noadmin/comments"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Categories"
					text={getTotal(categories) || `0`}
					subtext={
						categories?.success
							? `${stats.categoriesByType.labels.length} category types`
							: `Could not load`
					}
					myLink="/noadmin/categories"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Files"
					text={getTotal(files) || `0`}
					subtext={
						files?.success
							? `${formatBytes(stats.totalFileBytes)} stored`
							: `Could not load`
					}
					myLink="/noadmin/files"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Quotes"
					text={getTotal(quotes) || `0`}
					subtext={publishedText(quotes)}
					myLink="/noadmin/quotes"
					myQuery={listQuery}
				/>
				<DynamicCard
					title="Products"
					text={getTotal(products) || `0`}
					subtext={
						products?.success
							? `${getItems(products).filter((p) => p.inStock).length} in stock`
							: `Could not load`
					}
					myLink="/noadmin/products"
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
				<Panel title="Quick draft" subtitle="" colClasses="col-lg-2">
					<CreateQuickDraftBlogForm token={token} auth={auth} />
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
		</>
	);
};

export default AdminHome;
