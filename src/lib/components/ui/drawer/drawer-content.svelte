<script>
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "$lib/utils.js";
	import DrawerOverlay from "./drawer-overlay.svelte";
	import DrawerPortal from "./drawer-portal.svelte";

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showHandle = true,
		...restProps
	} = $props();
</script>

<DrawerPortal {...portalProps}>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		bind:ref
		data-slot="drawer-content"
		class={cn(
			"bg-card text-card-foreground border-border fixed inset-x-0 bottom-0 z-50 flex h-auto max-h-[92vh] flex-col rounded-t-3xl border-t sm:border-x shadow-2xl focus:outline-none overflow-hidden",
			className
		)}
		{...restProps}
	>
		{#if showHandle}
			<div
				class="bg-muted-foreground/20 mx-auto mt-3 mb-1 h-1.5 w-12 shrink-0 rounded-full"
			></div>
		{/if}
		{@render children?.()}
	</DrawerPrimitive.Content>
</DrawerPortal>