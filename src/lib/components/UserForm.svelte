<script lang="ts">
	import type { User } from '$lib/types';

	export let addUser: (user: User) => void;

	let description = '';
	let id = '';
	let password = '';
	let descriptionInput: HTMLInputElement;

	function handleSubmit() {
		addUser({ description, id, password });
		description = '';
		id = '';
		password = '';
		descriptionInput.focus();
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="flex space-x-3">
		<input
			class="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			bind:this={descriptionInput}
			bind:value={description}
			placeholder="Description"
			required
		/>
		<input
			class="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			bind:value={id}
			placeholder="ID"
			required
		/>
		<input
			class="px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			bind:value={password}
			type="password"
			placeholder="Password"
			required
		/>
		<button
			type="submit"
			class="mb-1 px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700
			{!description || !id || !password
				? 'bg-gray-700 border-none opacity-50 hover:bg-none cursor-not-allowed'
				: ''}"
			disabled={!description || !id || !password}
		>
			Add User
		</button>
	</div>
</form>
