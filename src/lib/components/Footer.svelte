<script lang="ts">
  import { t } from '$lib/stores/language';
</script>

<footer class="glass text-white mt-auto">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Logo and Description -->
      <div class="md:col-span-2">
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">★</span>
          </div>
          <span class="text-xl font-bold">OpenLyst</span>
        </div>
        <p class="text-gray-300 max-w-md">
          {$t.footer.description}
        </p>
        <div class="mt-4 flex space-x-4">
          <a href="https://gitlab.com/openlyst" class="text-gray-400 hover:text-purple-400 transition-colors">
            <span class="sr-only">Gitlab</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
          {$t.footer.applications}
        </h3>
        <ul class="space-y-2">
          <li><a href="/apps/doudou" class="text-gray-300 hover:text-purple-400 transition-colors">DouDou</a></li>
        </ul>
      </div>

      <!-- Community -->
      <div>
        <h3 class="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
          {$t.footer.community}
        </h3>
        <ul class="space-y-2">
          <li><a href="/contribute" class="text-gray-300 hover:text-purple-400 transition-colors">{$t.footer.contribute}</a></li>
          <li><a href="/about" class="text-gray-300 hover:text-purple-400 transition-colors">{$t.footer.aboutUs}</a></li>
          <li><a href="/docs/api" class="text-gray-300 hover:text-purple-400 transition-colors">{$t.footer.documentation}</a></li>
          <li><a href="https://communistparty.ie/en/" class="text-gray-300 hover:text-purple-400 transition-colors">{$t.footer.support}</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-white/10">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">
          {$t.footer.copyright}
        </p>
        <p class="text-gray-400 text-sm mt-2 md:mt-0">
          {$t.footer.powerToThePeople}
        </p>
      </div>
    </div>
  </div>
</footer>