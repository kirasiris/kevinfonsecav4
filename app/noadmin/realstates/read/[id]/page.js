"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";
import Image from "next/image";

const ReadRealState = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [realstate, setRealState] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const realstateId = id;

	useEffect(() => {
		const fetchRealState = async () => {
			try {
				const res = await fetchurl(
					`/realstates/${realstateId}`,
					"GET",
					"no-cache"
				);
				// NEED TO RETURN RES BY ITSELF IN ORDER TO USE ARTICLE HEADER COMPONENT IN BOTH SERVER AND CLIENT COMPONENTS
				setRealState(res);
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
		fetchRealState();
	}, [realstateId]);

	return loading || realstate === null || realstate === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<ArticleHeader
						object={realstate}
						url={`/realstate/${realstate?.data?._id}/${realstate?.data?.slug}`}
					/>
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								realstate?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${realstate?.data?.files?.avatar?.location?.filename}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure>
					<section className="mb-5">
						<ParseHtml text={realstate?.data?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadRealState;
