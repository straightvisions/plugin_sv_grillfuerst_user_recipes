import React, { useState } from "react";
import Spinner from "../spinner";
import JobDetailsTable from "./job_details_table";
import headers from "../../modules/headers";
import routes from "../../models/routes";

const exportStates = {
	running: {
		label: "Running",
		color: "bg-yellow-100",
	},
	done: {
		label: "Done",
		color: "bg-green-100",
	},
	error: {
		label: "Error",
		color: "bg-red-100",
	},
};

export default function ExportRow({ exportItem }) {
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [details, setDetails] = useState(null);
	
	const toggleRow = () => {
		if (expanded) {
			setExpanded(false);
		} else {
			setExpanded(true);
			if (!details) {
				fetchDetails();
			}
		}
	};
	
	const fetchDetails = () => {
		setLoading(true);
		const route = routes.getExportStatusDetails.replace("{id}", exportItem.uuid);
		fetch(route, { headers: headers.get() })
			.then((response) => response.json())
			.then((data) => {
				setDetails(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching row details:", error);
				setLoading(false);
			});
	};
	
	return (
		<>
			<tr className="hover:bg-gray-50 cursor-pointer" onClick={toggleRow}>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.uuid}</td>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.title}</td>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.export_date}</td>
				<td className="px-3 py-4 text-sm">
          <span
	          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 ${
		          exportStates[exportItem.export]?.color || "bg-gray-100"
	          }`}
          >
            {exportStates[exportItem.export]?.label || exportItem.export}
          </span>
				</td>
				<td className="px-3 py-4 text-sm text-gray-500">
					{exportItem.link ? (
						<a href={exportItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
							🔗
						</a>
					) : (
						"-"
					)}
				</td>
				<td className="px-3 py-4 text-sm text-gray-500">Button</td>
			</tr>
			{expanded && (
				<tr>
					<td colSpan="6" className="px-3 py-4 bg-gray-50">
						{loading ? <Spinner /> : <JobDetailsTable jobs={details?.jobs || []} />}
					</td>
				</tr>
			)}
		</>
	);
}
