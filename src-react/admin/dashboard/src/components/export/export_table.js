import React, { useState } from "react";
import ExportRow from "./export_row";

export default function ExportTable({ exports }) {
	return (
		<div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
			<table className="min-w-full divide-y divide-gray-300">
				<thead className="bg-gray-50">
				<tr>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">UUID</th>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Exported At</th>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Link</th>
					<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
				</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
				{exports.map((exportItem) => (
					<ExportRow key={exportItem.uuid} exportItem={exportItem} />
				))}
				</tbody>
			</table>
		</div>
	);
}
