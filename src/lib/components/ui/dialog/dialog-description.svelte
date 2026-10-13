<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	} = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	data-slot="dialog-description"
	class={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed *:[a]:hover:text-foreground *:[a]:underline *:[a]:underline-offset-3", className)}
	{...restProps}
/>