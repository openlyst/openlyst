<script lang="ts">
  // Simple standalone page - no templates, no imports
</script>

<svelte:head>
  <title>Keep On</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</svelte:head>

<div class="container">
  <div class="content">
    <h1>🚀</h1>
    <p>Keep On</p>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .content {
    text-align: center;
    color: white;
  }

  h1 {
    font-size: 5rem;
    margin: 0;
    animation: bounce 2s ease-in-out infinite;
  }

  p {
    font-size: 2rem;
    margin-top: 1rem;
    opacity: 0.8;
    letter-spacing: 0.5em;
    text-transform: uppercase;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
</style>
