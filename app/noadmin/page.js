"use client";
import QuickBlogDraft from "@/components/admin/quickblogdraft";
import QuickQuoteDraft from "@/components/admin/quickquotedraft";
import AuthContext from "@/helpers/globalContext";
import DynamicCards from "@/components/global/dynamiccards";
import Header from "@/layout/header";
import { useContext } from "react";

const AdminHome = ({}) => {
	const { auth } = useContext(AuthContext);

	return (
		<>
			<Header
				title="Welcome back Admin"
				description="This is the place where you have the full control of your website. Feel free to play with it as you like!"
			/>
			<div className="row">
				<DynamicCards title="Blogs" />
				<DynamicCards title="Themes" />
				<DynamicCards title="Posts" />
				<DynamicCards title="Playlists" />
				<DynamicCards title="Videos" />
				<DynamicCards title="Users" />
				<DynamicCards title="Comments" />
				<DynamicCards title="Quizzes" />
				<DynamicCards title="Emails" />
				<DynamicCards title="Reports" />
				<DynamicCards title="Secrets" />
				<DynamicCards title="Media" />
				<DynamicCards title="Categories" />
				<DynamicCards title="Changelogs" />
				<DynamicCards title="Newsletter Subscribers" />
				<DynamicCards title="Quotes" />
				<DynamicCards title="YouTube" />
				<DynamicCards title="Urls" />
				<DynamicCards title="Logs" />
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
