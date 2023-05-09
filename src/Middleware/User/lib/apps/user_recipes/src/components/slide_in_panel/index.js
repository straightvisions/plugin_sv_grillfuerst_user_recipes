import React, { useState, useEffect, useContext } from 'react';
import {GlobalContext} from "../../modules/context";

const SlideInPanel = (props) => {
	const { globalMessage, setGlobalMessage } = useContext(GlobalContext);
	const { message, type } = props;
	const [panelClass, setPanelClass] = useState('');
	
	useEffect(() => {
		if (message) {
			switch (type) {
				case 'danger':
					setPanelClass('bg-red-500 text-white');
					break;
				case 'success':
					setPanelClass('bg-green-500 text-white');
					break;
				case 'warning':
					setPanelClass('bg-yellow-500 text-white');
					break;
				default:
					setPanelClass('bg-gray-500 text-white');
			}
		}
	}, [message, type]);
	
	const handleClose = () => {
		setGlobalMessage({visible:false});
	};
	
	return (
		<>
			{globalMessage.visible && (
				<div onClick={handleClose}
					className={`fixed z-50 right-4 bottom-0 w-64 max-w-[200px] px-2 py-2 mb-4 rounded shadow-md transform transition-all duration-300 ${panelClass}`}
				>
					<div dangerouslySetInnerHTML={{ __html: message }}></div>
				</div>
			)}
		</>
	);
};

export default SlideInPanel;
