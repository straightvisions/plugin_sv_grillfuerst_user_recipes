import React, {useEffect, useState} from "react";
import routes from '../../models/routes';
import storage from '../../modules/storage';
import {useNavigate} from "react-router-dom";
import Spinner from "../spinner";
import Pagination from "../pagination";
import {DocumentDuplicateIcon, PlusIcon, TrashIcon} from "@heroicons/react/20/solid";
import user from '../../modules/user';
const User = user.get();

const states = {
	draft: {
		label: 'Entwurf',
		color: 'bg-gray-100'
	},
	review_pending: {
		label: 'Eingereicht',
		color: 'bg-yellow-100'
	},
	reviewed: {
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
	const [pagination, setPagination] = useState({rows:0,pages:0,page:1});
	const [loading, setLoadingState] = useState(true);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const navigate = useNavigate();
	
	useEffect(() => {
		let route = routes.getRecipes;
		setLoadingState(true);
		// filter
		route += '?';
		route +='limit='+parseInt(limit);
		route +='&page=' + parseInt(page);
		
		fetch(route,{
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			}
		})
			.then(response => response.json())
			.then(data => {
				// sort new to old
				const _sorted = data.items.sort((a, b) => {
						return a.created < b.created ? 1 : -1;
					}
				);

				setRecipes(_sorted);
				setPagination({rows:data.totalRows, pages:data.totalPages, page:data.page});
				setLoadingState(false);
			});
	}, [page])
	
	//@todo migrate list items to external component !!
	
	if (loading) {
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner/>
			</div>
		);
	}
	
	const getDate = (date) => {
		//@todo replace datejs
		return date;
		//return <DayJS format="DD.MM.YYYY HH:mm">{date}</DayJS>;
	}
	
	const handleCopyCode = (e, c) => {
		e.stopPropagation();
		
		if(typeof c === 'string' && c !== ''){
			navigator.clipboard.writeText(c);
			//@todo add infobox here
		}
	}
	
	const handleNewRecipe = () => {
		fetch(routes.createRecipe + User.id, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},
			body: JSON.stringify({})
		})
			.then(response => response.json())
			.then(data => {
				navigate('/edit/' + data.uuid)
			});
	}
	
	return (
		<div className="px-4 sm:px-6 lg:px-0">
			<div className="mt-8 flex flex-col">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
										className="w-1/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Status
									</th>
									<th
										scope="col"
										className="w-10/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										Rezept
									</th>
									<th
										scope="col"
										className="w-10/12 py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										Gutschein
									</th>
								</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
								{recipes.length > 0 ? recipes.map((recipe) => (
									<tr key={recipe.uuid} onClick={() => navigate('/edit/' + recipe.uuid)}
									    className="cursor-pointer hover:bg-gray-100">
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											<span
												className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900">
											  {recipe.uuid}
											</span>
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											<span
												className={"inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 " + states[recipe.state].color}>
											  {states[recipe.state].label}
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
													<div className="text-gray-500">{getDate(recipe.created)}</div>
												</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
											{recipe.voucher !== '' &&
												<button
													onClick={e=>handleCopyCode(e, recipe.voucher)}
													title="Code kopieren"
													type="button"
													className="flex px-3 py-2 bg-orange-600 text-white
													border border-transparent justify-center align-center
													hover:bg-white hover:text-orange-600 hover:border-orange-600
													font-semibold rounded">
													<DocumentDuplicateIcon className="stroke-white w-[16px]"/>
													<span className="ml-1">{recipe.voucher}</span>
												</button>
											}
										</td>
									</tr>
								)) :
									<tr>
										<td key="0" className="col-span-4 whitespace-nowrap px-4 py-4 text-sm text-gray-500">
											<button
												className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
												role="button"
												onClick={handleNewRecipe}
											>
												<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
												<span>Neues Rezept hinzufügen</span>
											</button>
										</td>
									</tr>
								}
								</tbody>
							</table>
							<div className="p-4 border-t border-gray-200">
								<Pagination
									pages={pagination.pages}
									rows={pagination.rows}
									page={pagination.page}
									showingCount={recipes.length}
									onChange={setPage}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}