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
	data-slot="card"
	class={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
	{...restProps}
>
	{@render children?.()}
</div>