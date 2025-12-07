<script lang="ts">
  interface Props {
    text: string;
    href?: string;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    onclick?: () => void;
  }

  let {
    text,
    href = "",
    variant = "primary",
    size = "md",
    onclick,
  }: Props = $props();

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary:
      "bg-yellow-400 text-red-900 hover:bg-yellow-500 focus:ring-yellow-500",
    outline:
      "border-2 border-red-500 text-red-400 bg-transparent hover:bg-red-600 hover:text-white focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

{#if href}
  <a {href} class={buttonClasses}>
    {text}
  </a>
{:else}
  <button {onclick} class={buttonClasses}>
    {text}
  </button>
{/if}
