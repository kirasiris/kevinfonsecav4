import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDateWithoutTime } from "befree-utilities";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import Map from "@/components/global/map";
import UseDropzone from "@/components/nfabusiness/realstates/filedropzone";
import Gallery from "@/components/nfabusiness/realstates/gallery";

async function getRealState(params) {
	const res = await fetchurl(`/global/realstates${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ReadRealState = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();
	const realstate = await getRealState(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-10">
				<Gallery objects={realstate?.data?.files?.extras} />
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						{realstate?.data?.title || "Untitled"}
					</div>
					<div className="card-body">
						<ParseHtml text={realstate?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">Property details</div>
					<div className="card-body">
						<div className="row">
							<div className="col text-center">
								<i aria-hidden className="fa-solid fa-bed fa-2x" />
								<p className="mb-0">{realstate?.data?.bedrooms}</p>
								<p className="mb-0">Bedrooms</p>
							</div>
							<div className="col text-center">
								<i aria-hidden className="fa-solid fa-bath fa-2x" />
								<p className="mb-0">{realstate?.data?.bathrooms}</p>
								<p className="mb-0">Bathrooms</p>
							</div>
							<div className="col text-center">
								<i aria-hidden className="fa-solid fa-bath fa-2x" />
								<p className="mb-0">{realstate?.data?.squarefeet}</p>
								<p className="mb-0">Sq Ft</p>
							</div>
							<div className="col text-center">
								<i aria-hidden className="fa-solid fa-bath fa-2x" />
								<p className="text-capitalize mb-0">{realstate?.data?.type}</p>
								<p className="mb-0">Type</p>
							</div>
						</div>
					</div>
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">Amenities</div>
					<div className="card-body">
						<ul
							className="d-flex flex-wrap"
							style={{
								maxHeight: "calc(1.5rem * 5 + 1rem)", // roughly height for 5 items
								flexDirection: "column",
								alignContent:
									realstate?.data?.amenities?.length > 10
										? "space-between"
										: "space-evenly",
							}}
						>
							{realstate?.data?.amenities.map((ameniti, index) => (
								<li
									key={index}
									className="text-capitalize"
									style={{ width: "13rem" }}
								>
									{ameniti.split("-").join(" ")}
								</li>
							))}
						</ul>
					</div>
				</div>
				<UseDropzone
					auth={auth}
					token={token}
					id="file"
					name="file"
					multipleFiles={true}
					object={realstate?.data}
				/>
				<Map object={realstate?.data} />
			</div>
			<div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							realstate?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/1200x900`
						}
						alt={`${realstate?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={415}
						height={363}
						priority
					/>
				</figure>
				<div className="card rounded-0 mb-3">
					<div className="card-header">Property Information</div>
					<div className="card-body p-0">
						<ul className="list-group list-unstyled">
							<li className="d-flex justify-content-between list-group-item border-0 border-bottom rounded-0">
								<span>P. ID</span>
								<span>{realstate?.data?._id}</span>
							</li>
							<li className="d-flex justify-content-between list-group-item border-0 border-bottom rounded-0">
								<span>Type</span>
								<span className="text-capitalize">{realstate?.data?.type}</span>
							</li>
							<li className="d-flex justify-content-between list-group-item border-0 border-bottom rounded-0">
								<span>Status</span>
								<span className="text-capitalize">
									{realstate?.data?.status}
								</span>
							</li>
							<li className="d-flex justify-content-between list-group-item border-0 border-bottom rounded-0">
								<span>Listed</span>
								<span>{formatDateWithoutTime(realstate?.data?.createdAt)}</span>
							</li>
							<li className="d-flex justify-content-between list-group-item border-0 rounded-0">
								<span>R. S. Agent</span>
								<span>{realstate?.data?.user?.name}</span>
							</li>
							<li className="d-flex justify-content-between list-group-item border-0 rounded-0">
								<span>Managed by</span>
								<span>{realstate?.data?.resourceId?.title}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReadRealState;
