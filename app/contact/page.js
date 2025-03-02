import { revalidatePath } from "next/cache";
import FormButtons from "@/components/global/formbuttons";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/contact/sidebar";

const ContactIndex = async ({ params, searchParams }) => {
	const createContact = async (formData) => {
		"use server";
		const rawFormData = {
			name: formData.get("name"),
			email: formData.get("email"),
			subject: formData.get("subject"),
			text: formData.get("text"),
		};
		await fetchurl(`/emails`, "POST", "no-cache", rawFormData);
		revalidatePath("/contact");
	};

	const address = {
		location: {
			formattedAddress: "10153 Red Bluff Ln, Fort Worth, TX 76177",
			coordinates: [-97.33096, 32.92332],
		},
	};

	return (
		<>
			<Header
				title="Contact Page"
				description="Do not hesitate to contact me!"
			/>
			<div className="container">
				<div className="row">
					<Globalcontent>
						<form action={createContact}>
							<div className="row">
								<div className="col">
									<label htmlFor="name" className="form-label">
										Name
									</label>
									<input
										id="name"
										name="name"
										type="text"
										className="form-control mb-3"
										placeholder="John Doe"
									/>
								</div>
								<div className="col">
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										id="email"
										name="email"
										type="email"
										className="form-control mb-3"
										placeholder="john@doe.com"
									/>
								</div>
							</div>
							<label htmlFor="subject" className="form-label">
								Subject
							</label>
							<select id="subject" name="subject" className="form-control">
								<option value={`none`}>Choose an option</option>
								<option value={`suggestion`}>Suggestion</option>
								<option value={`bug`}>Bug</option>
								<option value={`review`}>Review</option>
								<option value={`greetings`}>Greetings</option>
							</select>
							<label htmlFor="text" className="form-label">
								Text
							</label>
							<textarea
								id="text"
								name="text"
								className="form-control"
								placeholder={`Here goes the message`}
								rows={`3`}
							/>
							<br />
							<FormButtons />
						</form>
					</Globalcontent>
					<Sidebar address={address} />
				</div>
			</div>
		</>
	);
};

export default ContactIndex;
