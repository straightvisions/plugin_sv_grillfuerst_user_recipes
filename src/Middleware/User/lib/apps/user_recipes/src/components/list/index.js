import React from 'react';

const ListHeader = ({ columns }) => {
	const columnsCount = columns.length;
	
	if(columnsCount === 0) return null;
	
	return (
		<div className="flex bg-gray-50 p-4 gap-4">
			{columns.map((item, index) => {
				const width = item.width ? item.width : 'w-1/'.columnsCount;
				const label = item.label ? item.label : '';
				return (
					<span key={'listHeader-' + index} className={`${width} font-semibold hidden md:block`}>{label}</span>
				);
			})}
		</div>
	);
};

const ListBody = ({ columns, items }) => {
	const columnsCount = columns.length;
	if(columnsCount === 0 || items.length === 0) return null;

	return (
		<div className="flex flex-col divide-y divide-gray-200">
			{items.map((item, index) => {
			
				return (
					<ListItem key={`listItem${index}`} item={item} columns={columns}/>
				);
			})}
		</div>
	);
};

const ListItem = ({item, columns}) => {
	const columnsCount = columns.length;
	if(columnsCount === 0) return null;
	const onClick = item.onClick ? item.onClick : null;
	let classnames = 'flex flex-wrap md-no-wrap flex-auto p-4 gap-4 overflow-hidden';
	classnames += onClick ? ' cursor-pointer hover:bg-gray-50' : '';
	
	return (
		<div onClick={onClick} className={classnames}>
			{item.columns.map((content, index) => {
				const width = columns[index] && columns[index].width ? columns[index].width : 'w-1/'.columnsCount;
				const columnLabel = columns[index] && columns[index].label ? columns[index].label : null;
				return (
					<span key={index} className={`overflow-hidden ${width}`}>{columnLabel && <span className="block italic font-bold md:hidden bg-gray-50 p-2 text-sm">{columnLabel}</span>}{content}</span>
				);
			})}
		</div>
	);
};

const ListFooter = ({ footer }) => {
	if(!footer) return null;
	return (
		<div className="p-4 border-t border-gray-200">{footer}</div>
	);
};

export default function List(props){
	
	const {
		columns = [], // {label: 'Label', width: 'w-1/4'}
		footer = {},
		items = [],
	} = props;

	
	return (
		<div className="flex flex-col rounded shadow">
			<ListHeader columns={columns}/>
			<ListBody columns={columns} items={items}/>
			<ListFooter footer={footer}/>
		</div>
		
		
	);
};
