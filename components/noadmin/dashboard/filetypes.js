"use client";
const FileTypes = ({ rows = [] }) => {
	return (
		<table className="table table-sm small mb-0 mt-3">
			<thead>
				<tr>
					<th scope="col">Type</th>
					<th scope="col" className="text-end">
						Files
					</th>
					<th scope="col" className="text-end">
						Size
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.type}>
						<td>{row.type}</td>
						<td className="text-end">{row.count}</td>
						<td className="text-end text-body-secondary">{row.size}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default FileTypes;
