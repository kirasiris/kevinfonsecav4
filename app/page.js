import Header from "@/layout/header";
import Footer from "@/layout/footer";

async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getThemes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/themes${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const Home = async () => {
	const getBlogsData = getBlogs(
		`?page=1&limit=10&sort=-createdAt&postType=blog&status=published`
	);

	const getThemesData = getThemes(
		`?page=1&limit=10&sort=-createdAt&postType=theme&status=published`
	);

	const [blogs, themes] = await Promise.all([getBlogsData, getThemesData]);

	const showcaseImage = "";

	return (
		<>
			<Header
				title="Kevin Uriel"
				description="Programmer, Geek, Gamer and now Soldier"
				headerClasses="d-flex flex-column vh-100 vw-100"
				headerContainerClasses="m-auto"
				headerStyle={{
					backgroundAttachment: "fixed",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "50% 50%",
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						showcaseImage ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					}) no-repeat center center`,
				}}
			/>
			{/* SHOWCASE */}
			<section className="showcase">xD</section>
			{/* BLOGS */}
			{/* THEMES */}
			{/* WHAT PEOPLE SAY ABOUT ME */}
			<section className="p-5 testimonials">
				<div className="container-fluid py-5">
					<h1 className="display-5 text-center fw-bold">Get to Know Me</h1>
					<div className="row">
						<div className="col-lg-4">
							<p className="fs-4">
								Customers are Awesome. Check what our clients are saying about
								us.
							</p>
						</div>
						<div className="col-lg-8">
							<div className="card">
								<div className="card-body">
									<figure>
										<blockquote className="blockquote">
											<p>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
												Nunc et metus id ligula malesuada placerat sit amet quis
												enim. Aliquam erat volutpat. In pellentesque scelerisque
												auctor.
											</p>
										</blockquote>
										<figcaption className="blockquote-footer">
											AUTHOR NAME&nbsp;-&nbsp;
											<cite title="SOURCE WEBSITE">SOURCE WEBSITE</cite>
										</figcaption>
									</figure>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* CALL TO ACTION - NEWSLETTER REGISTRATION BY EMAIL */}
			<section className="p-5 text-center testimonials bg-black text-decoration-underline">
				<div className="container-fluid py-5">
					<h1 className="display-5 fw-bold">Newsletter</h1>
					HERE GOES THE INPUT
				</div>
			</section>
			{/* CONTACT ME */}
			<Footer />
		</>
	);
};

export default Home;
