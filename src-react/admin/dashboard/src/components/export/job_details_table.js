import React from "react";

export default function JobDetailsTable({ jobs }) {
	return (
		<table className="min-w-full divide-y divide-gray-300 bg-white shadow-sm rounded-md">
			<thead className="bg-gray-200">
			<tr>
				<th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">ID</th>
				<th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Status</th>
				<th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Type</th>
				<th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Priority</th>
				<th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Data</th>
			</tr>
			</thead>
			<tbody className="divide-y divide-gray-200">
			{jobs.map((job) => (
				<tr key={job.id} className="hover:bg-gray-100">
					<td className="px-4 py-2 text-sm text-gray-700">{job.id}</td>
					<td className="px-4 py-2 text-sm text-gray-700">{job.status}</td>
					<td className="px-4 py-2 text-sm text-gray-700">{job.type}</td>
					<td className="px-4 py-2 text-sm text-gray-700">{job.priority}</td>
					<td className="px-4 py-2 text-sm text-gray-700">
						<ul className="list-disc pl-4">
							{Object.entries(job.data).map(([key, value]) => (
								<li key={key}>
									<strong>{key}</strong>: {typeof value === "object" ? JSON.stringify(value) : value}
								</li>
							))}
						</ul>
					</td>
				</tr>
			))}
			</tbody>
		</table>
	);
}
