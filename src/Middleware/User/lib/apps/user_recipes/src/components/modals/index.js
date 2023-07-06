import React, { useContext } from 'react';
import {GlobalContext} from "../../modules/context";

export function Modal() {
	const { globalModal, setGlobalModal } = useContext(GlobalContext);
	
	const handleConfirm = () => {
		if (globalModal.onConfirm) globalModal.onConfirm();
		setGlobalModal({show:false});
	};
	
	const handleCancel = () => {
		if (globalModal.onCancel) globalModal.onCancel();
		setGlobalModal({show:false});
	};
	
	
	if(globalModal.type === 'error'){
		return (
			<>
				{globalModal.show && (
					<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[99999] p-4">
						<div className="bg-white rounded-lg p-4">
							{globalModal.title && <h3 className="mb-4">{globalModal.title}</h3>}
							<p dangerouslySetInnerHTML={{__html: Array.isArray(globalModal.message) ? globalModal.message.join('') : globalModal.message }}></p>
							<div className="flex justify-end mt-4">
								<button onClick={handleConfirm} type="button"
								        className="px-4 py-2 bg-red-700 text-white rounded-lg">
									Schließen
								</button>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
	
	
	if(globalModal.type === 'success'){
		return (
			<>
				{globalModal.show && (
					<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[99999]">
						<div className="bg-white rounded-lg p-4">
							<p dangerouslySetInnerHTML={{__html: Array.isArray(globalModal.message) ? globalModal.message.join('') : globalModal.message }}></p>
							<div className="flex justify-end mt-4">
								<button onClick={handleConfirm} type="button"
								        className="px-4 py-2 bg-red-700 text-white rounded-lg">
									Ja
								</button>
								<button onClick={handleCancel} type="button"
								        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
									Abbrechen
								</button>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
	
}

export function ModalConfirm() {
	const { globalModalConfirm, setGlobalModalConfirm } = useContext(GlobalContext);
	
	const handleConfirm = () => {
		if (globalModalConfirm.onConfirm) globalModalConfirm.onConfirm();
		setGlobalModalConfirm({show:false});
	};
	
	const handleCancel = () => {
		if (globalModalConfirm.onCancel) globalModalConfirm.onCancel();
		setGlobalModalConfirm({show:false});
	};
	
	return (
		<>
			{globalModalConfirm.show && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[99999]">
					<div className="bg-white rounded-lg p-4">
						<p>{globalModalConfirm.message}</p>
						<div className="flex justify-end mt-4">
							<button onClick={handleConfirm} type="button"
							        className="px-4 py-2 bg-red-700 text-white rounded-lg">
								Ja
							</button>
							<button onClick={handleCancel} type="button"
							        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
								Abbrechen
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}