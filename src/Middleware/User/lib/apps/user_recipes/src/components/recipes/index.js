import React, { useState, useEffect } from "react";
import routes from '../../models/routes';

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

const _recipes = [
	{
		id: 1,
		title: 'Saftige Schaschlikspieße – das Originalrezept von Klaus von „Klaus grillt“',
		created: '05.09.2022 18:45:05',
		featured_image: {"url": 'https://www.grillfuerst.de/media/images/org/Klaus-grillt-Rezepte.jpg'},
		state: 'feedback',
	},{
		id: 2,
		title: 'Köftetaler – Köfte im Brötchen von Klaus von „Klaus grillt“',
		created: '05.09.2022 18:45:05',
		featured_image: {"url": 'https://www.grillfuerst.de/media/images/org/Klaus-grillt-Rezepte.jpg'},
		state: 'feedback',
	},{
		id: 3,
		name: 'Haxe vom Drehspieß',
		created: '05.09.2022 18:45:05',
		featured_image: {"url": 'https://www.grillfuerst.de/media/images/org/Klaus-grillt-Rezepte.jpg'},
		state: 'feedback',
	},{
		id: 4,
		title: 'Grünkohl Eintopf aus dem Dutch Oven – Ostfriesenpalme einfach und lecker',
		created: '05.09.2022 18:45:05',
		featured_image: {"url": 'https://www.grillfuerst.de/media/images/org/Klaus-grillt-Rezepte.jpg'},
		state: 'feedback',
	},
]

export default function Recipes(props) {
	
	const [recipes, setRecipes] = useState(_recipes);

	const fetchUserRecipes = () => {
		fetch(routes.getRecipesByUser + props.user.id)
			.then(response => response.json())
			.then(data => setRecipes(data.items));
	}
	
	useEffect(() => {
		fetchUserRecipes();
	}, [])
	
	//@todo migrate list items to external component !!
	//@todo add placeholders for fetches

	return (
		<div className="px-4 sm:px-6 lg:px-0">
			<div className="mt-8 flex flex-col">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										Rezept
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Status
									</th>
								</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
								{recipes.map((recipe) => (
									<tr key={recipe.id}>
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