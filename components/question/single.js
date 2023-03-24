import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import Image from "next/image";

const Single = ({ question = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${question._id}`}>
				<div className={`col-lg-6 float-start`}>
					<Image
						src={
							question.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/300x200`
						}
						className="img-fluid w-100 rounded-0"
						alt={`${question.title}'s featured image`}
						width={`300`}
						height={`200`}
					/>
				</div>
				<div className={`col-lg-6 float-end`}>
					<h2>{question.title}</h2>
					{Object.entries(question.answers).forEach(([key, value]) => (
						<div key={key} className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name={value}
								id={key}
							/>
							<label className="form-check-label" for={key}>
								{value}
							</label>
						</div>
					))}
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
