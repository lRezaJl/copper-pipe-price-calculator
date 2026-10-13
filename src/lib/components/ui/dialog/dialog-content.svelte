<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { IconX } from '@tabler/icons-svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import * as Dialog from "./index.js";
	import DialogPortal from "./dialog-portal.svelte";
	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showCloseButton = true,
		...restProps
	} = $props();
</script>

<DialogPortal {...portalProps}>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		bind:ref
		data-slot="dialog-content"
		class={cn(
			"bg-card text-card-foreground border border-border shadow-2xl rounded-3xl p-6 grid gap-6 fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none duration-200 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 sm:max-w-md",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		{#if showCloseButton}
			<DialogPrimitive.Close data-slot="dialog-close">
				{#snippet child({ props })}
					<Button
						variant="ghost"
						class="absolute top-5 inset-e-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto rounded-full size-8 text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
						size="icon-sm"
						{...props}
					>
						<IconX class="size-4" />
						<span class="sr-only">بستن</span>
					</Button>
				{/snippet}
			</DialogPrimitive.Close>
		{/if}
	</DialogPrimitive.Content>
</DialogPortal>