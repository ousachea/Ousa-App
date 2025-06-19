<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Site Navigator</h1>
            <p class="text-sm text-gray-600 mt-1">{{ validRoutes.length }} pages available</p>
          </div>
          <div class="text-right">
            <div class="text-lg font-medium text-blue-600">{{ routes.length }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wide">Total Routes</div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search pages..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          >
        </div>
      </div>

      <!-- Main Navigation Cards -->
      <div class="grid gap-6 mb-8">
        <!-- Pages Section -->
        <section v-if="filteredStaticRoutes.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-medium text-gray-900 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Pages
              <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {{ filteredStaticRoutes.length }}
              </span>
            </h2>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <NuxtLink
                v-for="route in filteredStaticRoutes"
                :key="route.path"
                :to="route.path"
                class="group flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                    {{ getPageTitle(route.path) }}
                  </div>
                  <div class="text-sm text-gray-500 truncate">{{ route.path }}</div>
                </div>
                <div class="flex-shrink-0 ml-2 text-gray-400 group-hover:text-blue-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Dynamic Routes Section -->
        <section v-if="filteredDynamicRoutes.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-medium text-gray-900 flex items-center">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              Dynamic Pages
              <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                {{ filteredDynamicRoutes.length }}
              </span>
            </h2>
            <p class="text-sm text-gray-600 mt-1">These pages require specific parameters to access</p>
          </div>
          <div class="p-4">
            <div class="space-y-2">
              <div
                v-for="route in filteredDynamicRoutes"
                :key="route.path"
                class="flex items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 truncate">
                    {{ getPageTitle(route.path) }}
                  </div>
                  <div class="text-sm text-gray-600 font-mono truncate">{{ route.path }}</div>
                </div>
                <div class="flex-shrink-0 ml-2 text-yellow-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- API Routes Section -->
        <section v-if="filteredApiRoutes.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-medium text-gray-900 flex items-center">
              <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              API Endpoints
              <span class="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                {{ filteredApiRoutes.length }}
              </span>
            </h2>
            <p class="text-sm text-gray-600 mt-1">Backend API endpoints for data operations</p>
          </div>
          <div class="p-4">
            <div class="space-y-2">
              <div
                v-for="route in filteredApiRoutes"
                :key="route.path"
                class="flex items-center p-3 rounded-lg bg-purple-50 border border-purple-200"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 truncate">
                    API: {{ getApiTitle(route.path) }}
                  </div>
                  <div class="text-sm text-purple-700 font-mono truncate">{{ route.path }}</div>
                </div>
                <div class="flex-shrink-0 ml-2 text-purple-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRoutes.length === 0" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
        <p class="text-gray-600">Try searching for something else or check your pages directory</p>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ staticRoutes.length }}</div>
          <div class="text-sm text-gray-600">Static Pages</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ dynamicRoutes.length }}</div>
          <div class="text-sm text-gray-600">Dynamic Routes</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ apiRoutes.length }}</div>
          <div class="text-sm text-gray-600">API Endpoints</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div class="text-2xl font-bold text-gray-700">{{ routes.length }}</div>
          <div class="text-sm text-gray-600">Total Routes</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Get all available routes from Nuxt router
const router = useRouter()
const searchQuery = ref('')

// Get all routes from the router
const routes = computed(() => {
  return router.getRoutes().filter(route => {
    // Filter out catch-all routes and other system routes
    return !route.path.includes('/:') || route.path.includes('[')
  })
})

// Categorize routes
const staticRoutes = computed(() => {
  return routes.value.filter(route => {
    return !route.path.includes('[') && 
           !route.path.includes(':') && 
           !route.path.startsWith('/api/')
  })
})

const dynamicRoutes = computed(() => {
  return routes.value.filter(route => {
    return (route.path.includes('[') || route.path.includes(':')) && 
           !route.path.startsWith('/api/')
  })
})

const apiRoutes = computed(() => {
  return routes.value.filter(route => {
    return route.path.startsWith('/api/')
  })
})

const validRoutes = computed(() => {
  return routes.value.filter(route => {
    return !route.path.includes('[') && 
           !route.path.includes(':') && 
           !route.path.startsWith('/api/')
  })
})

// Search functionality
const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes.value
  
  const query = searchQuery.value.toLowerCase()
  return routes.value.filter(route => {
    return route.path.toLowerCase().includes(query) ||
           (route.name && route.name.toLowerCase().includes(query))
  })
})

const filteredStaticRoutes = computed(() => {
  if (!searchQuery.value) return staticRoutes.value
  
  const query = searchQuery.value.toLowerCase()
  return staticRoutes.value.filter(route => {
    return route.path.toLowerCase().includes(query) ||
           (route.name && route.name.toLowerCase().includes(query))
  })
})

const filteredDynamicRoutes = computed(() => {
  if (!searchQuery.value) return dynamicRoutes.value
  
  const query = searchQuery.value.toLowerCase()
  return dynamicRoutes.value.filter(route => {
    return route.path.toLowerCase().includes(query) ||
           (route.name && route.name.toLowerCase().includes(query))
  })
})

const filteredApiRoutes = computed(() => {
  if (!searchQuery.value) return apiRoutes.value
  
  const query = searchQuery.value.toLowerCase()
  return apiRoutes.value.filter(route => {
    return route.path.toLowerCase().includes(query) ||
           (route.name && route.name.toLowerCase().includes(query))
  })
})

// Helper functions for better titles
const getPageTitle = (path) => {
  if (path === '/') return 'Home'
  return path.split('/').pop().replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || path
}

const getApiTitle = (path) => {
  return path.replace('/api/', '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Set page meta
useSeoMeta({
  title: 'Site Navigator - All Pages',
  description: 'Navigate and discover all available pages in your Nuxt 3 project'
})
</script>

<style scoped>
/* Enhanced accessibility and UX styles */
.focus-ring:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Better button and link focus states */
a:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Improved hover states */
.hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Card hover effects */
.card-hover:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-200 {
    border-color: #000;
  }
  
  .text-gray-600 {
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>