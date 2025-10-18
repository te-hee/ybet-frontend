<script lang="ts">
	import "$lib/assets/main.css"

	let { children } = $props();
</script>

<svelte:head>
</svelte:head>

{@render children?.()}
