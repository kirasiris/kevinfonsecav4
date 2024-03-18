"use client";
import QuickBlogDraft from "@/components/admin/quickblogdraft";
import QuickQuoteDraft from "@/components/admin/quickquotedraft";
import AuthContext from "@/helpers/globalContext";
import DynamicCards from "@/components/global/dynamiccards";
import Header from "@/layout/header";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const AdminHome = ({ params, searchParams }) => {
	const { auth, totalResults } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	return (
		<>
			<Header
				title={`Welcome back, ${
					auth.loading ? "loading..." : auth.user.username
				}`}
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCards
					title="Blogs"
					text={totalResults.blogs}
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
					text={totalResults.themes}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/themes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Posts"
					text={totalResults.posts}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/posts"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Playlists"
					text={totalResults.playlists}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/playlists"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Courses"
					text={totalResults.courses}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/courses"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Videos"
					text={totalResults.videos}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/videos"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Users"
					text={totalResults.users}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/users"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Comments"
					text={totalResults.comments}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/comments"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Quizzes"
					text={totalResults.quizzes}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/quizzes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Emails"
					text={totalResults.emails}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/emails"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Reports"
					text={totalResults.reports}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/reports"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Secrets"
					text={totalResults.secrets}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/secrets"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Files"
					text={totalResults.files}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/files"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Categories"
					text={totalResults.categories}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/categories"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Changelogs"
					text={totalResults.changelogs}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/changelogs"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Newsletter Subscribers"
					text={totalResults.newsletters}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/newsletters"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Quotes"
					text={totalResults.quotes}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/quotes"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="YouTube"
					text={totalResults.ytdownloads}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/ytdownloads"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Short Urls"
					text={totalResults.shorturls}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/shorturls"
					myQuery={{
						page: 1,
						limit: 10,
					}}
				/>
				<DynamicCards
					title="Logs"
					text={totalResults.logs}
					// bgcolor="dark"
					// txtcolor="red"
					myLink="/noadmin/logs"
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
				<div className="col">
					<QuickBlogDraft />
					<QuickQuoteDraft />
				</div>
			</div>
		</>
	);
};

export default AdminHome;
