import Link from "next/link";
import Single from "./singlepicture";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const PicturesList = ({ object = {}, objects = [], searchParams = {} }) => {
	return (
		<Globalcontent>
			<div className="card">
				<div className="card-header">
					<div className="clear-both">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<div className="btn-group">
									<Link
										href={{
											pathname: `/profile/${object.data._id}/${object.data.username}/photos`,
											query: {
												page: 1,
												limit: 50,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">All</a>
									</Link>
									<Link
										href={{
											pathname: `/profile/${object.data._id}/${object.data.username}/photos/avatars`,
											query: {
												page: 1,
												limit: 50,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Avatars</a>
									</Link>
									<Link
										href={{
											pathname: `/profile/${object.data._id}/${object.data.username}/photos/covers`,
											query: {
												page: 1,
												limit: 50,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Covers</a>
									</Link>
								</div>
							</div>
						</div>
						<div className="float-end">
							<div className="d-flex align-items-center">END</div>
						</div>
					</div>
				</div>
				<div
					className={`card-body ${objects?.data?.length >= 1 && "row g-2"} p-0`}
				>
					{objects?.data?.length > 0 ? (
						<>
							{objects.data?.map((picture) => (
								<Single key={picture._id} object={picture} />
							))}
							<NumericPagination
								totalPages={
									objects?.pagination?.totalpages ||
									Math.ceil(objects?.data?.length / searchParams.limit)
								}
								page={searchParams.page}
								limit={searchParams.limit}
								keyword={searchParams.keyword}
								sortby="-createdAt"
								siblings={1}
							/>
						</>
					) : (
						<NothingFoundAlert
							loading={false}
							classNames="alert-dark w-100 rounded-0 m-0 border-0"
						/>
					)}
				</div>
			</div>
		</Globalcontent>
	);
};

export default PicturesList;