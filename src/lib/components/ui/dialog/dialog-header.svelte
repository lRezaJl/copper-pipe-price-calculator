<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="dialog-header"
	class={cn("flex flex-col gap-1.5 text-right", className)}
	{...restProps}
>
	{@render children?.()}
</div>