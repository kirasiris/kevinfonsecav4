import { Suspense } from "react";
import Header from "@/layout/header";
import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/contact/sidebar";
import ErrorPage from "@/layout/errorpage";
import ContactForm from "@/forms/contact/contactform";
import Loading from "@/app/contact/loading";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const ContactIndex = async ({ params, searchParams }) => {
	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Contact`}
				description={settings.data.text}
				favicon={settings?.data?.favicon?.location?.secure_location}
				postImage={settings.data.showcase_image?.location?.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/contact`}
				author={settings.data.author}
				createdAt={settings.data.createdAt}
				updatedAt={settings.data.updatedAt}
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header
						title="Contact Page"
						description="Do not hesitate to contact me!"
					/>
					<section className="py-5">
						<div className="container">
							<div className="row">
								<Globalcontent>
									<ContactForm />
								</Globalcontent>
								<Sidebar object={settings} />
							</div>
						</div>
					</section>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ContactIndex;
