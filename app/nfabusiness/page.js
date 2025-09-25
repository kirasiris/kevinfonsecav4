import DynamicCards from "@/components/global/dynamiccards";
import Header from "@/layout/header";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAcquisitionsDisposals(params) {
	const res = await fetchurl(
		`/global/acquisitionsdisposals${params}&postType=review`,
		"GET",
		"default"
	);
	return res;
}

async function getReviews(params) {
	const res = await fetchurl(
		`/global/comments${params}&postType=review`,
		"GET",
		"default"
	);
	return res;
}

async function getServiceEmails(params) {
	const res = await fetchurl(
		`/global/serviceemails${params}&status=pending`,
		"GET",
		"default"
	);
	return res;
}

async function getWeapons(params) {
	const res = await fetchurl(`/noadmin/weapons${params}`, "GET", "default");
	return res;
}

// async function getWeaponAccessories(params) {
// 	const res = await fetchurl(
// 		`/noadmin/weaponaccessories${params}`,
// 		"GET",
// 		"default"
// 	);
// 	return res;
// }

const AdminNFAHome = async ({ params, searchParams }) => {
	const acquiredData = getAcquisitionsDisposals(`?status=acquired`);
	const disposedData = getAcquisitionsDisposals(`?status=disposed`);
	const reviewsData = getReviews(`?limit=100`);
	const serviceemailsData = getServiceEmails(`?limit=100`);
	const weaponsData = getWeapons(`?limit=100`);
	// const weaponaccessoriesData = getWeaponAccessories(`?limit=100`);

	const [
		acquired,
		disposed,
		servicereviews,
		serviceemails,
		weapons,
		// weaponaccessories,
	] = await Promise.all([
		acquiredData,
		disposedData,
		reviewsData,
		serviceemailsData,
		weaponsData,
		// weaponaccessoriesData,
	]);

	return (
		<>
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCards
					title="Weapons Acquired"
					text={acquired?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/acquisitionsdisposals/acquired"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Weapons Disposed"
					text={disposed?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/acquisitionsdisposals/disposed"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Service Reviews"
					text={servicereviews?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/reviews"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Service Requests"
					text={serviceemails?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/serviceemails"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Weapons"
					text={weapons?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/weapons"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				{/* <DynamicCards
					title="Weapon Accessories"
					text={weaponaccessories?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/nfabusiness/weaponaccessories"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/> */}
			</div>
			<div className="row">
				<div className="col">
					<div className="card">
						<div className="card-header">At a Glance</div>
						<div className="card-body"></div>
						<div className="card-footer">
							<p>
								Askimet has protected your site from 3 spam comments already.
							</p>
							<br />
							There&apos;s nothing in your spam queue at the moment.
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminNFAHome;
