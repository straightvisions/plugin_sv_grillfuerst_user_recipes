import React, {useEffect, useState} from 'react';
import { LockOpenIcon } from '@heroicons/react/24/solid';
import Spinner from '../spinner';
import Modal from '../modal';
import user from '../../modules/user';

export default function ReviewToolbar(props) {
	const {
		onSave = () => {},
		onSubmit = () => {},
		onPublish = () => {},
		onRefresh = () => {},
		onDelete = () => {},
		saving = false,
		submitting = false,
		publishing = false,
		refreshing = false,
		deleting = false,
		disabled = false,
		customer = {},
		setAttributes,
		forcedEditing,
		setForcedEditing,
	} = props;
	
	const {
		uuid = '',
		user_id = '',
		voucher = '',
		link = '',
	} = props.data
	
	const [confirmReleaseOpen, setConfirmReleaseOpen] = useState(false);

	const state = props.data.state;
	const _disabled = disabled || saving || submitting || publishing || refreshing || deleting || state === 'published' || state === 'draft';

	return (
		<div className="flex flex-row items-center items-stretch mb-2 gap-2">
			{confirmReleaseOpen &&
				<Modal
					message={'Rezept wirklich freigeben? Dies kann <strong>nicht</strong> rückgängig gemacht werden!'}
					isOpen={confirmReleaseOpen}
					onClose={() => setConfirmReleaseOpen(false)}
					name="modalReleaseConfirm"
					onConfirm={() => {
						setConfirmReleaseOpen(false);
						onPublish();
					}}/>
			}
			{disabled && !forcedEditing &&
				<button title="Editierung erzwingen" onClick={()=>setForcedEditing(true)} type="button"
				        className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600">
					<LockOpenIcon className="w-4 h-4" fill="#FFF" />
				</button>
			}
			<button disabled={(_disabled  || state === 'reviewed') && !forcedEditing} onClick={onSave} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-blue-600 text-white">
				{ saving ? <> <Spinner width="4" height="4" /> Speichern </> :
					<> Speichern </>
				}
			</button>
			<button disabled={(_disabled || state === 'reviewed') && !forcedEditing} onClick={onSubmit} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-orange-600 text-white">
				{ submitting ? <> <Spinner width="4" height="4" /> Feedback senden </> :
					<> Feedback senden </>
				}
			</button>
			<button disabled={_disabled && !forcedEditing} onClick={()=>setConfirmReleaseOpen(true)} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600 text-white">
				{ publishing ? <> <Spinner width="4" height="4" /> Veröffentlichen </> :
					<> Veröffentlichen </>
				}
			</button>
			<div className="flex items-center gap-2 px-2 py-1 rounded text-sm bg-white text-grey-500">
				<span>UUID: {uuid}</span>
				<span>|</span>
				{ state === 'review_pending' && <span className="text-green-500"><strong>Wartet auf Feedback</strong></span> }
				{ state === 'reviewed' && <span><strong className="text-yellow-500">Feedback gesendet</strong></span> }
				{ state === 'published' && <span className="text-red-400"><strong>Veröffentlicht</strong></span> }
				{ state === 'draft' && <span className="text-red-400"><strong>ENTWURF</strong></span> }
				<span>|</span>
				<span>Autor:
					{customer ? <>{customer.salutation} {customer.firstname} {customer.lastname} <i className="text-small">{user_id}</i></> : 'Unbekannt'}
				</span>
				{voucher &&
					<><span>|</span><span>Gutschein: {voucher}</span></>
				}
				{ link &&
					<><span>|</span><a href={link} target="_blank">Zum Rezept</a></>
				}
			</div>
			{ user.hasRole('admin') &&
				<div className="mr-0 ml-auto flex gap-2 justify-end">
					<button title="Daten vom Serer neu laden." disabled={_disabled && !forcedEditing} onClick={onDelete} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600 text-white">
						{ deleting ? <Spinner width="4" height="4" /> : 'Löschen' }
					</button>
				</div>
			
			}
			{/*
			<div className="mr-0 ml-auto flex gap-2 justify-end">
				<button title="Daten vom Serer neu laden." disabled={_disabled && !forcedEditing} onClick={onRefresh} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600 text-white">
					{ refreshing ? <Spinner width="4" height="4" /> : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 26 26">
						<path d="M13.8125 0C7.878906 0 4.082031 4.292969 4 10L0.5 10C0.300781 10 0.09375 10.113281 0.09375 10.3125C-0.0078125 10.511719 -0.0078125 10.710938 0.09375 10.8125L6.09375 18.5C6.195313 18.601563 6.300781 18.6875 6.5 18.6875C6.699219 18.6875 6.804688 18.601563 6.90625 18.5L12.90625 10.8125C13.007813 10.710938 13.007813 10.511719 12.90625 10.3125C12.804688 10.113281 12.601563 10 12.5 10L9 10C9.066406 2.464844 12.921875 0.789063 13.8125 0.09375C14.011719 -0.0078125 14.011719 0 13.8125 0ZM19.5 7.34375C19.351563 7.34375 19.195313 7.398438 19.09375 7.5L13.09375 15.1875C12.992188 15.386719 13 15.585938 13 15.6875C13.101563 15.886719 13.304688 16 13.40625 16L17 16C16.933594 23.535156 13.078125 25.210938 12.1875 25.90625C11.988281 26.007813 11.988281 26 12.1875 26C18.121094 26 21.917969 21.707031 22 16L25.40625 16C25.605469 16 25.8125 15.886719 25.8125 15.6875C26.011719 15.488281 26.007813 15.289063 25.90625 15.1875L19.90625 7.5C19.804688 7.398438 19.648438 7.34375 19.5 7.34375Z" fill="white"/>
					</svg> }
				</button>
			</div>
			*/}
			
		</div>
	);
}

