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
				        className="flex items-center gap-2 px-2 py-1 border rounded text-sm border-gray-200 bg-red-600">
					<LockOpenIcon className="w-4 h-4" fill="#FFF" />
				</button>
			}
			<button disabled={(_disabled  || state === 'reviewed') && !forcedEditing} onClick={onSave} type="button" className="flex items-center gap-2 px-2 py-1 border rounded text-sm border-gray-200 bg-blue-600 text-white">
				{ saving ? <> <Spinner width="4" height="4" /> Speichern </> :
					<> Speichern </>
				}
			</button>
			<button disabled={(_disabled || state === 'reviewed') && !forcedEditing} onClick={onSubmit} type="button" className="flex items-center gap-2 px-2 py-1 border rounded text-sm border-gray-200 bg-orange-600 text-white">
				{ submitting ? <> <Spinner width="4" height="4" /> Feedback senden </> :
					<> Feedback senden </>
				}
			</button>
			<button disabled={_disabled && !forcedEditing} onClick={()=>setConfirmReleaseOpen(true)} type="button" className="flex items-center gap-2 px-2 py-1 border rounded text-sm border-gray-200 bg-red-600 text-white">
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
					<button title="Rezept löschen" disabled={_disabled && !forcedEditing} onClick={onDelete} type="button" className="flex items-center gap-2 px-2 py-1 border rounded text-sm border-gray-200 bg-red-600 text-white">
						{ deleting ? <Spinner width="4" height="4" /> : 'Rezept löschen' }
					</button>
				</div>
			
			}
		</div>
	);
}

