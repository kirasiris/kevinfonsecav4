import DynamicCards from "@/components/global/dynamiccards";
import Header from "@/layout/header";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getBlogs(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "default");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "default");
	return res;
}

const AdminNFAHome = async ({ params, searchParams }) => {
	const blogsData = getBlogs(`?postType=blog`);
	const themesData = getThemes(`?postType=theme`);

	const [blogs, themes] = await Promise.all([blogsData, themesData]);

	return (
		<>
			<Header
				title={`Welcome back!, Root`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCards
					title="Blogs"
					text={blogs?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/blogs"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Themes"
					text={themes?.data?.length || `0`}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/themes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
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
