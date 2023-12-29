declare type DndEvent<User> = import('svelte-dnd-action').DndEvent<User>;
declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:consider'?: (event: CustomEvent<DndEvent<T>> & { target: EventTarget & T }) => void;
		'on:finalize'?: (event: CustomEvent<DndEvent<T>> & { target: EventTarget & T }) => void;
	}
}
