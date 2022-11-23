import React, { useState, useEffect } from "react";
import routes from '../../models/routes';
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner";

const states = {
	draft: {
		label: 'Entwurf',
		color: 'bg-gray-100'
	},
	submitted: {
		label: 'Eingereicht',
		color: 'bg-yellow-100'
	},
	feedback: {
		label: 'Feedback',
		color: 'bg-blue-100'
	},
	published: {
		label: 'Veröffentlicht',
		color: 'bg-green-100'
	}
}

export default function Recipes(props) {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const navigate = useNavigate();
	
	useEffect(() => {
		fetch(routes.getRecipes)
			.then(response => response.json())
			.then(data => {
				setRecipes(data.items);
				setLoadingState(false);
			});
	}, [])

	//@todo migrate list items to external component !!
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="px-4 sm:px-6 lg:px-0">
			<div className="mt-8 flex flex-col">
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="w-1/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										#
									</th>
									<th
										scope="col"
										className="w-10/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										Rezept
									</th>
									<th
										scope="col"
										className="w-1/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Status
									</th>
								</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
								{recipes.map((recipe) => (
									<tr key={recipe.uuid} onClick={() => navigate('/edit/' + recipe.uuid)}>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											<span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900">
											  {recipe.uuid}
											</span>
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
											<div className="flex items-center">
												<div className="h-10 flex-shrink-0">
													{recipe.featured_image.url &&
														<img
															className="h-10 object-cover"
															src={recipe.featured_image.url} alt=""
														/>
													}
												</div>
												<div className="ml-4">
													<div className="font-medium text-gray-900">{recipe.title}</div>
													<div className="text-gray-500">{recipe.created}</div>
												</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											<span className={"inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 "+states[recipe.state].color}>
											  {states[recipe.state].label}
											</span>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}