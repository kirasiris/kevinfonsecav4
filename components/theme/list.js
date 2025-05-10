import Link from "next/link";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";

const List = ({
	featured = {},
	objects = [],
	searchParams = {},
	categories = [],
}) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12" style={{ marginBottom: "24px" }}>
					<Link
						href={{
							pathname: `/theme`,
							query: {
								page: 1,
								limit: 10,
								sort: `-createdAt`,
							},
						}}
						className="btn btn-secondary btn-sm me-1"
						style={{ marginBottom: "4px" }}
					>
						All
					</Link>
					{categories.data?.length > 0 &&
						categories.data
							.filter((c) => c.timesUsed >= 1)
							.map((category, index) => (
								<Link
									key={category._id}
									href={{
										pathname: `/theme/category/${category._id}/${category.slug}`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
									className="btn btn-primary btn-sm me-1"
									style={{ marginBottom: "4px" }}
								>
									{category.title}
								</Link>
							))}
				</div>
				<Globalcontent containerClasses={`col-lg-12`}>
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects?.data?.length > 0 &&
									objects.data?.map((theme) => (
										<Single key={theme._id} object={theme} />
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
			</div>
		</div>
	);
};

export default List;
