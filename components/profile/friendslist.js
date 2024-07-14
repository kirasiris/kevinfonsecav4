import Link from "next/link";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const List = ({ object = {}, objects = [], searchParams = {} }) => {
	return (
		<Globalcontent>
			{/* User list */}
			<div className="row">
				<div className="col-lg-12" style={{ marginBottom: "24px" }}>
					<Link
						href={{
							pathname: `/profile/${object?.data?._id}/${object?.data?.username}/socials/friends`,
							query: {
								page: 1,
								limit: 10,
							},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-primary btn-sm me-1">Friends</a>
					</Link>
					<Link
						href={{
							pathname: `/profile/${object?.data?._id}/${object?.data?.username}/socials/followers`,
							query: {
								page: 1,
								limit: 10,
							},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-primary btn-sm me-1">Followers</a>
					</Link>
					<Link
						href={{
							pathname: `/profile/${object?.data?._id}/${object?.data?.username}/socials/following`,
							query: {
								page: 1,
								limit: 10,
							},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-primary btn-sm">Following</a>
					</Link>
				</div>
			</div>
			<div className="row">
				{objects?.data?.length > 0 ? (
					<>
						{objects.data?.map((user) => (
							<Single key={user._id} object={user} />
						))}
						<NumericPagination
							totalPages={
								objects?.pagination?.totalpages ||
								Math.ceil(objects?.data?.length / searchParams.limit)
							}
							searchParams={searchParams}
							siblings={1}
						/>
					</>
				) : (
					<NothingFoundAlert />
				)}
			</div>
		</Globalcontent>
	);
};

export default List;
