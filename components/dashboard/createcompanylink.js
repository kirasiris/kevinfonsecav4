"use client";
import Link from "next/link";

const CreateCompanyLink = ({}) => {
	return (
		<div className="alert alert-link rounded-0 m-0 border-0">
			<p className="m-0">
				<Link
					href={{
						pathname: `/noadmin/companies/create`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a>
						<b className="text-bg-primary text-decoration-underline">
							Create company first
						</b>
					</a>
				</Link>
			</p>
		</div>
	);
};

export default CreateCompanyLink;
