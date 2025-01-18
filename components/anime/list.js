import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/blog/sidebar";
import Globalcontent from "@/layout/content";
import Image from "next/image";

const List = ({
	featured = {},
	objects = [],
	searchParams = {},
	categories = [],
	quotes = [],
}) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent>
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} fullWidth={true} />
						))}
					{/* Blog list */}
					<div className="card rounded-bottom-0">
						<div className="card-header">Animes</div>
						<div className="card-body">
							<div className="d-flex flex-wrap px-0 py-0 row">
								<div className="col-lg-4 nuevos_animes text-center">
									<a>
										{/* <Image src="http://localhost:3000/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdgq2klit7%2Fimage%2Fupload%2Fv1717612555%2F660600aa29a40c04c35d6188-kirasiris-kuaf1998%2540gmail.com%2Fposts%2F7jpg-660600aa29a40c04c35d6188-kuaf1998-gmail-com-1717612555198.jpg&w=1080&q=75" /> */}
									</a>
									<figcaption>
										<span>title</span>
									</figcaption>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((blog) => (
									<Single key={blog._id} object={blog} />
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
				<Sidebar quotes={quotes} categories={categories} />
			</div>
		</div>
	);
};

export default List;
