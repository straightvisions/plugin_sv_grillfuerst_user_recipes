import React, {useEffect, useState} from "react";
import parse from 'html-react-parser';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/20/solid'

export default function ActivityMap(props) {
	const {
		items
	} = props;
	
	const [loading, setLoadingState] = useState(true);
	const [users, setUsers] = useState([]);

	// load data from db
	useEffect(() => {
		const userIds = items.map(i => i.userId);
		setLoadingState(false);
		/*
		fetch(routes.getUsers,{
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(userIds),
		})
			.then(response => response.json())
			.then(data => {
				setUsers(data);
				setLoadingState(false);
			});*/
	}, []);
	
	const UserTemplate = {
		id: 0,
		avatar: '',
		name: 'unknown',
	}
	
	const getUser = (userId) => {
		let result = users.filter(user => user.id === userId);
		let User = Object.assign({}, UserTemplate);
		
		if (result.length > 0) {
			User.id = result[0].id;
			User.avatar = result[0].avatar_urls;
			User.name = result[0].name;
		}
		
		return User;
	}
	
	const convertDate = (date) => {
		const [month, day, year] = date.split('/');
		return `${day}.${month}.${year}`;
	}
	
	// layout reference https://tailwindui.com/components/application-ui/lists/feeds
	if (items.length > 0) {
		return (
			<div className="flow-root">
				<ul role="list" className="-mb-8">
					{items.slice(0).reverse().map((activityItem, activityItemIdx) => (
						<li key={activityItemIdx}>
							<div className="relative pb-8">
								{activityItemIdx !== items.length - 1 ? (
									<span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
									      aria-hidden="true"/>
								) : null}
								<div className="relative flex items-start space-x-3">
									{activityItem.type === 'comment' ? (
										<>
											<div className="relative">
												<img
													className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
													src={getUser(activityItem.userId).avatar}
													alt=""
												/>
												
												<span
													className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
								                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400"
								                                                    aria-hidden="true"/>
								                      </span>
											</div>
											<div className="min-w-0 flex-1">
												<div>
													<div className="text-sm">
														<p className="font-medium text-gray-900">
															{getUser(activityItem.userId).name}
														</p>
													</div>
													<p className="mt-0.5 text-sm text-gray-500">{convertDate(activityItem.date)}</p>
												</div>
												<div className="mt-2 text-sm text-gray-700">
													{parse(activityItem.text)}
												</div>
											</div>
										</>
									) : null}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	} else {
		return (
			<>
				<p>Keine Einträge bisher</p>
			</>
		);
	}
	
}