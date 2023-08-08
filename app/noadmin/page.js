"use client";
import QuickBlogDraft from "@/components/admin/quickblogdraft";
import QuickQuoteDraft from "@/components/admin/quickquotedraft";
import AuthContext from "@/helpers/globalContext";
import DynamicCards from "@/layout/dynamiccards";
import { useContext } from "react";

const AdminHome = ({}) => {
	const { auth } = useContext(AuthContext);

	return (
		<>
			<div className="row">
				<DynamicCards title="Blogs" />
				<DynamicCards title="Themes" />
				<DynamicCards title="Users" />
				<DynamicCards title="Comments" />
				<DynamicCards title="Newsletter Subscribers" />
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
