"use client";
import { useFormStatus } from "react-dom";

const FormButtons = ({ classList = "float-start" }) => {
	const { pending } = useFormStatus();

	return (
		<>
			<button
				type="submit"
				className={`btn btn-secondary btn-sm ${classList}`}
				aria-disabled={pending}
				disabled={pending}
			>
				{pending ? "Processing..." : "Submit"}
			</button>
			<button type="reset" className="btn btn-secondary btn-sm float-end">
				Reset
			</button>
		</>
	);
};

export default FormButtons;
