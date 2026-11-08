import DynamicCard from "@/components/noadmin/dynamiccard";
import Panel from "@/components/noadmin/dashboard/panel";
import BarChart from "@/components/noadmin/dashboard/barchart";
import DoughnutChart from "@/components/noadmin/dashboard/doughnutchart";
import RecentTransfers from "@/components/nfabusiness/dashboard/recenttransfers";
import InventoryWatch from "@/components/nfabusiness/dashboard/inventorywatch";
import RecentRequests from "@/components/nfabusiness/dashboard/recentrequests";
import RecentComments from "@/components/noadmin/dashboard/recentcomments";
import Header from "@/layout/header";
import { fetchurl } from "@/helpers/setTokenOnServer";
import {
	getItems,
	getTotal,
	isPublished,
} from "@/helpers/dashboard/dashboardstats";
import {
	buildBusinessDashboard,
	formatUSD,
} from "@/helpers/dashboard/businessstats";

const ALL = `limit=500`;

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

const NFAAdminHome = async () => {
	const [transfers, companies, products, requests, reviews, weapons] =
		await Promise.all([
			getGlobal("weaponacquisitionsdisposals", `?${ALL}`),
			getGlobal("companies", `?${ALL}`),
			getGlobal("products", `?${ALL}`),
			getGlobal("serviceemails", `?${ALL}`),
			getGlobal("comments", `?postType=review&${ALL}`),
			getApi(`/protected/weapons?${ALL}`),
		]);

	const catalog = getItems(products);
	const byType = (type) => catalog.filter((p) => p.postType === type);
	const courses = byType("course");
	const goods = byType("product");
	const listings = byType("realestate");

	const stats = buildBusinessDashboard({
		transfers: getItems(transfers),
		catalog,
		requests: getItems(requests),
		reviews: getItems(reviews),
		weapons: getItems(weapons),
	});

	return (
		<div className="container-fluid px-0">
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Acquisition and Disposals"
					text={getTotal(transfers) || `0`}
					subtext={loaded(
						transfers,
						`${stats.disposed} disposed · ${stats.onHand} on hand · ${formatUSD(stats.feesCollected)} in fees`,
					)}
					myLink="/nfabusiness/acquisitionsdisposals"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Products"
					text={goods.length}
					subtext={loaded(
						products,
						`${goods.filter((p) => p.inStock).length} in stock · ${stats.lowStock} low on stock`,
					)}
					myLink="/nfabusiness/products"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Courses"
					text={courses.length}
					subtext={loaded(
						products,
						`${courses.filter(isPublished).length} published · ${courses.filter((c) => c.isFree).length} free`,
					)}
					myLink="/nfabusiness/courses"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Real Estate"
					text={listings.length}
					subtext={loaded(
						products,
						`${listings.filter((l) => l.active).length} active listings`,
					)}
					myLink="/nfabusiness/realestates"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Companies"
					text={getTotal(companies) || `0`}
					subtext={loaded(
						companies,
						`${getItems(companies).filter(isPublished).length} published`,
					)}
					myLink="/nfabusiness/companies"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Catalog value"
					text={formatUSD(stats.catalogValue)}
					subtext={loaded(products, `List price × units in stock`)}
					myLink="/nfabusiness/products"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Service Requests"
					text={getTotal(requests) || `0`}
					subtext={loaded(
						requests,
						`${stats.unreadRequests} unread · ${stats.requestsLast30Days} in the last 30 days`,
					)}
					myLink="/nfabusiness/serviceemails"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Service Reviews"
					text={getTotal(reviews) || `0`}
					subtext={loaded(
						reviews,
						stats.averageRating
							? `${stats.averageRating} average rating`
							: `No ratings yet`,
					)}
					myLink="/nfabusiness/reviews"
					myQuery={listQuery}
				/>
				<DynamicCard
					colClass="col-md-6 col-xl-4"
					textClass="display-4"
					title="Weapons"
					text={getTotal(weapons) || `0`}
					subtext={loaded(weapons, stats.weaponTypes || `In inventory`)}
					myLink="/nfabusiness/weapons"
					myQuery={listQuery}
				/>
			</div>
			<div className="row">
				<Panel
					title="Acquisitions & dispositions"
					subtitle="Received vs. disposed per month"
					colClasses="col-lg-8"
					isEmpty={stats.transferFlow.labels.length === 0}
				>
					<BarChart
						labels={stats.transferFlow.labels}
						series={stats.transferFlow.series}
						height={300}
						ariaLabel="Bar chart of firearms received and disposed per month"
					/>
				</Panel>
				<Panel
					title="By firearm type"
					subtitle="All recorded transfers"
					colClasses="col-lg-4"
					isEmpty={stats.transfersByType.values.length === 0}
				>
					<DoughnutChart
						labels={stats.transfersByType.labels}
						values={stats.transfersByType.values}
						colors={stats.transfersByType.colors}
						height={300}
						ariaLabel={`Transfers by firearm type: ${stats.transfersByType.labels
							.map((l, i) => `${l} ${stats.transfersByType.values[i]}`)
							.join(", ")}`}
					/>
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Recent transfers"
					subtitle="Latest six by receipt date"
					colClasses="col-lg-8"
					isEmpty={stats.recentTransfers.length === 0}
				>
					<RecentTransfers transfers={stats.recentTransfers} />
				</Panel>
				<Panel
					title="Inventory watch"
					subtitle="Tracked items, lowest stock first"
					colClasses="col-lg-4"
					isEmpty={stats.inventoryWatch.length === 0}
				>
					<InventoryWatch items={stats.inventoryWatch} />
				</Panel>
			</div>
			<div className="row">
				<Panel
					title="Service requests"
					subtitle="Latest six, unread first in bold"
					colClasses="col-lg-6"
					isEmpty={stats.recentRequests.length === 0}
				>
					<RecentRequests requests={stats.recentRequests} />
				</Panel>
				<Panel
					title="Service reviews"
					subtitle="Latest six"
					colClasses="col-lg-6"
					isEmpty={stats.recentReviews.length === 0}
				>
					<RecentComments comments={stats.recentReviews} />
				</Panel>
			</div>
		</div>
	);
};

export default NFAAdminHome;
