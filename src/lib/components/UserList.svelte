<script lang="ts">
	import type { User } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let users: Writable<User[]>;
	export let deleteUser: (userId: string) => void;

	const flipDurationMs = 15;
	function handleDndConsider(e: CustomEvent<DndEvent<User>>) {
		$users = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<User>>) {
		$users = e.detail.items;
	}
</script>

<div class="flex justify-center">
	<table class="w-1/2 divide-y divide-gray-600 text-left text-gray-200 mt-16 text-lg">
		<thead class="bg-gray-800">
			<tr>
				<th class="px-12 py-4"></th>
				<th class="px-12 py-4 text-xs font-medium uppercase tracking-wider">Description</th>
				<th class="px-12 py-4 text-xs font-medium uppercase tracking-wider">ID</th>
				<th class="px-12 py-4 text-xs font-medium uppercase tracking-wider">Password</th>
				<th class="px-12 py-4 text-xs font-medium uppercase tracking-wider">
					<button
						class=" px-9 py-2 text-sm font-bold text-white bg-transparent border border-blue-500 rounded-lg hover:bg-blue-500"
						on:click={() => ($users = [])}>Clear</button
					>
				</th>
			</tr>
		</thead>
		<tbody
			use:dndzone={{ items: $users, flipDurationMs: flipDurationMs }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
			class="bg-gray-900 divide-y divide-gray-700"
		>
			{#each $users as user (user.id)}
				<tr animate:flip={{ duration: flipDurationMs }} class="hover:bg-gray-950">
					<td class="px-2 cursor-move text-2xl">≡</td>
					<td class="px-12 py-4">
						<input
							type="text"
							class="px-2 py-1 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							bind:value={user.description}
						/>
					</td>
					<td class="px-12 py-4">
						<input
							type="text"
							class="px-2 py-1 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							bind:value={user.id}
						/>
					</td>
					<td class="px-12 py-4">
						<input
							type="password"
							class="px-2 py-1 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							bind:value={user.password}
						/>
					</td>
					<td class="px-12 py-4">
						<button
							class="px-8 py-2 text-sm text-gray-50 bg-transparent border border-red-500 rounded-lg hover:bg-red-500"
							on:click={() => deleteUser(user.id)}
						>
							Delete
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
