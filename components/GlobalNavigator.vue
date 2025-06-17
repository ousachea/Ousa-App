<!-- GlobalNavigator.vue -->
<template>
    <div class="fixed bottom-8 right-8 z-50">
      <!-- Minimal Toggle Button -->
      <button
        @click="toggleNavigator"
        class="nav-toggle group relative w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 flex items-center justify-center"
        :class="{ 'rotate-180': isOpen }"
      >
        <!-- Icon with morph animation -->
        <svg 
          v-if="!isOpen" 
          class="w-5 h-5 transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg 
          v-else 
          class="w-5 h-5 transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      <!-- Minimal Navigation Panel -->
      <Transition name="slide-fade">
        <div v-if="isOpen" class="nav-panel absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <!-- Clean header -->
          <div class="px-5 py-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900">Navigator</h3>
              <span class="text-sm text-gray-500">{{ totalRoutes }}</span>
            </div>
          </div>
  
          <!-- Clean Search and Sort -->
          <div class="p-4 border-b border-gray-100 space-y-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 focus:bg-white transition-all duration-200 text-sm"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Sort Options -->
            <div class="flex items-center space-x-2">
              <span class="text-xs font-medium text-gray-600">Sort:</span>
              <select 
                v-model="sortOption" 
                class="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              >
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="path">Path A-Z</option>
                <option value="path-desc">Path Z-A</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
  
          <!-- Routes List -->
          <div class="max-h-72 overflow-y-auto minimal-scrollbar">
            <!-- Current Page -->
            <div v-if="currentRoute" class="mx-4 mt-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <div class="flex-1">
                  <div class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-0.5">Current</div>
                  <div class="text-sm font-medium text-gray-900">{{ getPageTitle(currentRoute) }}</div>
                </div>
              </div>
            </div>
  
            <!-- Static Pages -->
            <div v-if="filteredStaticRoutes.length > 0" class="px-4 pb-3">
              <div class="flex items-center mb-2">
                <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pages</h4>
                <div class="ml-auto text-xs text-gray-500">{{ filteredStaticRoutes.length }}</div>
              </div>
              <div class="space-y-1">
                <button
                  v-for="route in filteredStaticRoutes"
                  :key="route.path"
                  @click="handleNavigateWithValidation(route.path)"
                  class="nav-item group flex items-center p-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 w-full text-left"
                  :class="{ 'bg-gray-100': route.path === currentRoute }"
                  :title="`Navigate to ${route.path}`"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">
                      {{ getPageTitle(route.path) }}
                    </div>
                    <div class="text-xs text-gray-500 truncate font-mono">{{ formatPath(route.path) }}</div>
                    <div v-if="!isValidRoute(route.path)" class="text-xs text-red-500">⚠️ Route may not exist</div>
                  </div>
                  <div class="ml-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
  
            <!-- Dynamic Routes -->
            <div v-if="filteredDynamicRoutes.length > 0" class="px-4 pb-3">
              <div class="flex items-center mb-2">
                <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dynamic</h4>
                <div class="ml-auto text-xs text-gray-500">{{ filteredDynamicRoutes.length }}</div>
              </div>
              <div class="space-y-1">
                <div
                  v-for="route in filteredDynamicRoutes"
                  :key="route.path"
                  class="flex items-center p-2.5 rounded-lg bg-gray-50"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-700 truncate">
                      {{ getPageTitle(route.path) }}
                    </div>
                    <div class="text-xs text-gray-500 truncate font-mono">{{ formatPath(route.path) }}</div>
                  </div>
                  <div class="ml-2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- API Routes -->
            <div v-if="filteredApiRoutes.length > 0" class="px-4 pb-4">
              <div class="flex items-center mb-2">
                <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">API</h4>
                <div class="ml-auto text-xs text-gray-500">{{ filteredApiRoutes.length }}</div>
              </div>
              <div class="space-y-1">
                <div
                  v-for="route in filteredApiRoutes"
                  :key="route.path"
                  class="flex items-center p-2.5 rounded-lg bg-gray-50"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-700 truncate">
                      {{ getApiTitle(route.path) }}
                    </div>
                    <div class="text-xs text-gray-500 truncate font-mono">{{ formatPath(route.path) }}</div>
                  </div>
                  <div class="ml-2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- No Results -->
            <div v-if="filteredRoutes.length === 0" class="px-4 py-8 text-center">
              <div class="text-2xl mb-2">🔍</div>
              <div class="text-sm text-gray-500 mb-1">No routes found</div>
              <div class="text-xs text-gray-400">Try a different search</div>
            </div>
          </div>
  
          <!-- Clean Footer -->
          <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <kbd class="px-1.5 py-1 bg-white border border-gray-200 rounded text-xs">ESC</kbd>
                <span>to close</span>
              </div>
              <button 
                @click="handleNavigateWithValidation('/')"
                class="text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                View All →
              </button>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Minimal Backdrop -->
      <Transition name="backdrop-fade">
        <div v-if="isOpen" @click="closeNavigator" class="fixed inset-0 bg-black/10 -z-10"></div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  const router = useRouter()
  const route = useRoute()
  const isOpen = ref(false)
  const searchQuery = ref('')
  const sortOption = ref('name')
  
  // Get current route
  const currentRoute = computed(() => route.path)
  
  // Get all routes
  const routes = computed(() => {
    return router.getRoutes().filter(route => {
      return !route.path.includes('/:') || route.path.includes('[')
    })
  })
  
  // Helper function to format path nicely
  const formatPath = (path) => {
    if (path === '/') return '/'
    
    // Split path and format each segment
    const segments = path.split('/').filter(Boolean)
    const formatted = segments.map(segment => {
      // Handle dynamic segments
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const param = segment.slice(1, -1)
        return `{${param}}`
      }
      if (segment.startsWith(':')) {
        return `{${segment.slice(1)}}`
      }
      // Format regular segments
      return segment.replace(/[-_]/g, ' ')
    }).join(' / ')
    
    return `/${formatted}`
  }
  
  // Sort function
  const sortRoutes = (routes) => {
    const sorted = [...routes]
    
    switch (sortOption.value) {
      case 'name':
        return sorted.sort((a, b) => getPageTitle(a.path).localeCompare(getPageTitle(b.path)))
      case 'name-desc':
        return sorted.sort((a, b) => getPageTitle(b.path).localeCompare(getPageTitle(a.path)))
      case 'path':
        return sorted.sort((a, b) => a.path.localeCompare(b.path))
      case 'path-desc':
        return sorted.sort((a, b) => b.path.localeCompare(a.path))
      case 'recent':
        return sorted.reverse() // Assuming newer routes are added last
      default:
        return sorted
    }
  }
  
  // Categorize routes with sorting
  const staticRoutes = computed(() => {
    const filtered = routes.value.filter(route => {
      return !route.path.includes('[') && 
             !route.path.includes(':') && 
             !route.path.startsWith('/api/')
    })
    return sortRoutes(filtered)
  })
  
  const dynamicRoutes = computed(() => {
    const filtered = routes.value.filter(route => {
      return (route.path.includes('[') || route.path.includes(':')) && 
             !route.path.startsWith('/api/')
    })
    return sortRoutes(filtered)
  })
  
  const apiRoutes = computed(() => {
    const filtered = routes.value.filter(route => {
      return route.path.startsWith('/api/')
    })
    return sortRoutes(filtered)
  })
  
  const totalRoutes = computed(() => routes.value.length)
  
  // Search functionality with sorting
  const filteredRoutes = computed(() => {
    let filtered = routes.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(route => {
        return route.path.toLowerCase().includes(query) ||
               (route.name && route.name.toLowerCase().includes(query)) ||
               getPageTitle(route.path).toLowerCase().includes(query)
      })
    }
    
    return sortRoutes(filtered)
  })
  
  const filteredStaticRoutes = computed(() => {
    let filtered = staticRoutes.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(route => {
        return route.path.toLowerCase().includes(query) ||
               (route.name && route.name.toLowerCase().includes(query)) ||
               getPageTitle(route.path).toLowerCase().includes(query)
      })
    }
    
    return sortRoutes(filtered)
  })
  
  const filteredDynamicRoutes = computed(() => {
    let filtered = dynamicRoutes.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(route => {
        return route.path.toLowerCase().includes(query) ||
               (route.name && route.name.toLowerCase().includes(query)) ||
               getPageTitle(route.path).toLowerCase().includes(query)
      })
    }
    
    return sortRoutes(filtered)
  })
  
  const filteredApiRoutes = computed(() => {
    let filtered = apiRoutes.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(route => {
        return route.path.toLowerCase().includes(query) ||
               (route.name && route.name.toLowerCase().includes(query)) ||
               getApiTitle(route.path).toLowerCase().includes(query)
      })
    }
    
    return sortRoutes(filtered)
  })
  
  // Helper functions
  const getPageTitle = (path) => {
    if (path === '/') return 'Home'
    return path.split('/').pop().replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || path
  }
  
  const getApiTitle = (path) => {
    return path.replace('/api/', '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  // Toggle navigation functions
  const toggleNavigator = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      searchQuery.value = ''
      // Reset sort to default when opening
      sortOption.value = 'name'
    }
  }
  
  const closeNavigator = () => {
    isOpen.value = false
    searchQuery.value = ''
  }
  
  // Keyboard shortcuts and click handling
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeNavigator()
    }
  }
  
  // Handle navigation clicks with multiple fallback methods
  const handleNavigate = async (path) => {
    try {
      // Method 1: Close navigator first
      closeNavigator()
      
      // Method 2: Try Nuxt's navigateTo (primary method)
      await navigateTo(path)
    } catch (error) {
      console.warn('navigateTo failed, trying router.push:', error)
      
      try {
        // Method 3: Fallback to Vue Router
        await router.push(path)
      } catch (routerError) {
        console.warn('router.push failed, using window.location:', routerError)
        
        // Method 4: Last resort - direct navigation
        window.location.href = path
      }
    }
  }
  
  // Debug function to check route validity
  const isValidRoute = (path) => {
    return routes.value.some(route => route.path === path)
  }
  
  // Enhanced navigation with validation
  const handleNavigateWithValidation = async (path) => {
    console.log('Attempting to navigate to:', path)
    console.log('Is valid route:', isValidRoute(path))
    console.log('Available routes:', routes.value.map(r => r.path))
    
    // Check if route exists
    if (!isValidRoute(path)) {
      console.error('Route not found:', path)
      alert(`Route "${path}" not found. Please check if the page exists.`)
      return
    }
    
    await handleNavigate(path)
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
  </script>
  
  <style scoped>
  /* Minimal toggle button */
  .nav-toggle {
    transition: all 0.3s ease;
  }
  
  .nav-toggle:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .nav-toggle:active {
    transform: translateY(0);
  }
  
  .rotate-180 {
    transform: rotate(180deg) translateY(-1px);
  }
  
  /* Clean panel animations */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }
  
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  
  /* Backdrop animations */
  .backdrop-fade-enter-active {
    transition: opacity 0.3s ease;
  }
  
  .backdrop-fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .backdrop-fade-enter-from,
  .backdrop-fade-leave-to {
    opacity: 0;
  }
  
  /* Navigation item hover */
  .nav-item:hover {
    transform: translateX(2px);
  }
  
  /* Minimal scrollbar */
  .minimal-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .nav-panel {
      width: calc(100vw - 2rem);
      right: -0.5rem;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .nav-toggle,
    .nav-item,
    .slide-fade-enter-active,
    .slide-fade-leave-active,
    .backdrop-fade-enter-active,
    .backdrop-fade-leave-active {
      transition: none !important;
    }
  }
  </style>