import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";
import Map from "@/components/global/map";

async function getCompany(params) {
	const res = await fetchurl(`/companies${params}`, "GET", "no-cache");
	return res;
}

async function getJobs(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	return res;
}

const ReadCompany = async ({ params, searchParams }) => {
	const company = await getCompany(`/${params.id}`);
	const jobs = await getJobs(`?resourceId=${company?.data?._id}`);

	return (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						{company?.data?.title || "Untitled"}
					</div>
					<div className="card-body">
						<ParseHtml text={company?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Jobs</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/companies/job/${company?.data?._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">Add job</a>
								</Link>
							</div>
						</div>
					</div>
					{jobs?.data?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
						>
							{jobs?.data?.map((job, index) => (
								<li key={job._id} className={`list-group-item ${job._id}`}>
									<div className="float-start">
										<Link
											href={`/noadmin/jobs/update/${job._id}`}
											passHref
											legacyBehavior
										>
											<a>
												<span className="badge bg-secondary me-1">{index}</span>
												{job.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										<Link
											href={`/job/${job._id}/${job.slug}`}
											passHref
											legacyBehavior
										>
											<a target="_blank">View</a>
										</Link>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-danger rounded-0  m-0 border-0">
							Nothing&nbsp;found
						</div>
					)}
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">Address</div>
					<div className="card-body p-0">
						<Map object={company?.data} />
					</div>
				</div>
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							company?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${company?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCompany;
