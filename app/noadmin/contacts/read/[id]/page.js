"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";

const ReadContact = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [contact, setContact] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const contactId = id;

	useEffect(() => {
		const fetchContact = async () => {
			try {
				const res = await fetchurl(`/contacts/${contactId}`, "GET", "no-cache");
				// NEED TO RETURN RES BY ITSELF IN ORDER TO USE ARTICLE HEADER COMPONENT IN BOTH SERVER AND CLIENT COMPONENTS
				setContact(res);
				setLoading(false);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchContact();
	}, [contactId]);

	return loading || contact === null || contact === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader object={contact} />
					<section className="mb-5">
						<div className="card">
							<div className="card-header"></div>
							<div className="card-body">
								<ul class="list-group list-group-flush m-0">
									{contact.data.emails.map((email) => (
										<li key={email._id} class="list-group-item">
											{email.handle} - {email.type}
										</li>
									))}
								</ul>
								<ul class="list-group list-group-flush m-0">
									{contact.data.phones.map((phone) => (
										<li key={phone._id} class="list-group-item">
											{phone.number} - {phone.type}
										</li>
									))}
								</ul>
								Birthdate
								<ParseHtml text={contact.data.dates.birthdate} />
								<ul class="list-group list-group-flush m-0">
									{contact.data.dates.significantDates.map((date) => (
										<li key={date._id} class="list-group-item">
											{date.date} - {date.type}
										</li>
									))}
								</ul>
								<ul class="list-group list-group-flush m-0">
									{contact.data.related.map((contact) => (
										<li key={contact._id} class="list-group-item">
											{contact.name} - {contact.type}
										</li>
									))}
								</ul>
								<ParseHtml text={contact?.text} />
							</div>
						</div>
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadContact;
