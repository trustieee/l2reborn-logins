<script lang="ts">
	import '../app.css';

	import { writable } from 'svelte/store';
	import UserForm from '$lib/components/UserForm.svelte';
	import UserList from '$lib/components/UserList.svelte';
	import type { User } from '$lib/types';

	let users = writable<User[]>([]);
	let showModal = false;
	let dragging = false;

	function closeModal() {
		showModal = false;
	}

	function addUser(user: User) {
		if ($users.find((u) => u.id === user.id)) {
			return;
		}
		users.update((users) => [...users, user]);
	}

	function deleteUser(userId: string) {
		users.update((users) => users.filter((u) => u.id !== userId));
	}

	function downloadIni() {
		let iniContent = `[L2REBORN_EASYLOGIN]
showOnStart=1
lastLoginIndex=1
hideLogin=0
`;

		$users.forEach((user, index) => {
			iniContent += `${index + 1}_description=${user.description}\n`;
			iniContent += `${index + 1}_id=${user.id}\n`;
			iniContent += `${index + 1}_password=${user.password}\n`;
		});

		for (let i = $users.length + 1; i <= $users.length + 10; i++) {
			iniContent += `${i}_description=\n`;
			iniContent += `${i}_id=\n`;
			iniContent += `${i}_password=\n`;
		}

		const blob = new Blob([iniContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'l2reborn_easylogin.ini';
		link.click();
		URL.revokeObjectURL(url);

		showModal = true;
	}

	let fileSelected = async (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			await uploadFile({ target: { files: [file] } });
		}
	};

	let uploadFile = async (event: { target: any }) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = function (event) {
			const contents = (event.target as FileReader).result;
			const lines = (contents as string).split('\n');
			let usersArray = [];

			// Create a temporary object to hold the user data
			let user: { description: string; id: string; password: string } = {
				description: '',
				id: '',
				password: ''
			};
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];

				line = line.replace('\r', '');

				// If the line starts with a number, it's a user property
				if (line.match(/^\d/)) {
					const [key, value] = line.split('=');

					// The property name is everything after the first underscore
					const propName = key.substring(key.indexOf('_') + 1);

					// Add the property to the current user object
					user[propName as keyof typeof user] = value;
					console.log('value ', value);

					// If the property is 'password', this is the last property for this user
					if (propName === 'password') {
						if (user.id && user.description && user.password) {
							usersArray.push(user);
						}

						user = { description: '', id: '', password: '' };
					}
				}
			}

			users.set(usersArray);
		};

		reader.readAsText(file);
	};

	let dragOver = (event: DragEvent) => {
		event.preventDefault();
		dragging = true;
	};

	let dropFile = async (event: DragEvent) => {
		event.preventDefault();
		dragging = false;
		if (event.dataTransfer) {
			const file = event.dataTransfer.files[0];
			uploadFile({ target: { files: [file] } });
		}
	};

	let dragLeave = (event: DragEvent) => {
		event.preventDefault();
		dragging = false;
	};
</script>

{#if showModal}
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>
			<div
				class="inline-block align-bottom bg-gray-900 text-gray-200 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
			>
				<div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<h3 class="text-3xl leading-6 font-medium text-gray-200" id="modal-title">
						File Downloaded
					</h3>
					<div class="mt-12">
						<p class="text-gray-400">
							Put the downloaded file in your reborn origins system directory:
						</p>
						<p class="text-gray-400 mt-2 ml-14">->>> \Reborn\games\origins\system</p>
					</div>
				</div>
				<div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="button"
						class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						on:click={closeModal}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="flex flex-col items-center mt-24">
	<h1 class="text-4xl font-bold mb-4">L2 Reborn - Login Manager</h1>

	<button
		class="mb-4 px-4 py-2 font-bold text-white border border-blue-500 rounded hover:bg-blue-500
		{!$users || $users.length <= 0
			? 'bg-gray-700 border-none opacity-50 hover:bg-none cursor-not-allowed '
			: ''}"
		disabled={!$users || $users.length <= 0}
		on:click={downloadIni}
	>
		Download
	</button>

	<UserForm {addUser} />

	{#if $users.length === 0}
		<div class="text-center mt-4">
			<p class="text-2xl opacity-25">start adding accounts above</p>
			<p class="text-2xl opacity-25">or</p>
			<p class="text-2xl opacity-25">drop your ini file here</p>
			<input
				class="border-4 border-dashed border-gray-400 py-32 px-32 text-center mb-4
				w-full mt-2 drop-zone {dragging ? 'dragging' : ''}"
				type="file"
				tabindex="0"
				on:dragover={dragOver}
				on:drop={dropFile}
				on:dragleave={dragLeave}
				on:change={fileSelected}
			/>
		</div>
	{:else}
		<div class="w-full">
			<UserList {users} {deleteUser} />
		</div>
	{/if}
</div>

<style>
	.drop-zone.dragging {
		border: 4px dashed cornflowerblue;
	}
</style>
