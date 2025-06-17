<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon
                :name="isDark ? 'lucide:sun' : 'lucide:moon'"
                class="w-5 h-5"
              />
            </button>
            <div class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">{{
                  user.initials
                }}</span>
              </div>
              <span class="text-gray-700">{{ user.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon :name="stat.icon" class="w-8 h-8 text-blue-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <Icon :name="activity.icon" class="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b">
            <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="action in quickActions"
                :key="action.label"
                @click="handleAction(action.action)"
                class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Icon
                  :name="action.icon"
                  class="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2"
                />
                <span class="text-sm font-medium text-gray-900">{{
                  action.label
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="mt-8 bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Projects</h2>
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Icon
                v-if="loading"
                name="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <span v-else>Refresh</span>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in projects" :key="project.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ project.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ project.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusColor(project.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ project.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      :style="{ width: `${project.progress}%` }"
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-500 mt-1"
                    >{{ project.progress }}%</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(project.dueDate) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Nuxt 3 composables and reactivity
const isDark = ref(false);
const loading = ref(false);

// SEO Meta
useSeoMeta({
  title: 'Dashboard - My App',
  ogTitle: 'Dashboard - My App',
  description: 'Modern dashboard built with Nuxt 3',
  ogDescription: 'Modern dashboard built with Nuxt 3',
});

// Reactive data
const user = reactive({
  name: 'John Doe',
  initials: 'JD',
});

const stats = ref([
  { label: 'Total Projects', value: '12', icon: 'lucide:folder' },
  { label: 'Active Tasks', value: '24', icon: 'lucide:check-circle' },
  { label: 'Team Members', value: '8', icon: 'lucide:users' },
  { label: 'Completed', value: '156', icon: 'lucide:trophy' },
]);

const recentActivity = ref([
  {
    id: 1,
    title: 'New project created',
    time: '2 minutes ago',
    icon: 'lucide:plus',
  },
  {
    id: 2,
    title: 'Task completed',
    time: '15 minutes ago',
    icon: 'lucide:check',
  },
  {
    id: 3,
    title: 'Team member added',
    time: '1 hour ago',
    icon: 'lucide:user-plus',
  },
  { id: 4, title: 'File uploaded', time: '2 hours ago', icon: 'lucide:upload' },
]);

const quickActions = ref([
  { label: 'New Project', icon: 'lucide:plus', action: 'create-project' },
  { label: 'Add Member', icon: 'lucide:user-plus', action: 'add-member' },
  { label: 'Upload File', icon: 'lucide:upload', action: 'upload-file' },
  {
    label: 'Generate Report',
    icon: 'lucide:file-text',
    action: 'generate-report',
  },
]);

const projects = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'In Progress',
    progress: 75,
    dueDate: '2024-03-15',
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'iOS and Android application',
    status: 'Planning',
    progress: 25,
    dueDate: '2024-04-20',
  },
  {
    id: 3,
    name: 'Database Migration',
    description: 'Migrate to new database system',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-02-28',
  },
]);

// Methods
const toggleTheme = () => {
  isDark.value = !isDark.value;
  // In a real app, you'd implement actual theme switching
  console.log('Theme toggled:', isDark.value ? 'dark' : 'light');
};

const handleAction = (action) => {
  console.log('Action triggered:', action);
  // Implement your action logic here
  switch (action) {
    case 'create-project':
      // Navigate to create project page
      navigateTo('/projects/create');
      break;
    case 'add-member':
      // Open add member modal
      break;
    case 'upload-file':
      // Open file upload dialog
      break;
    case 'generate-report':
      // Generate and download report
      break;
  }
};

const refreshData = async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you'd fetch fresh data here
    console.log('Data refreshed');
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status) => {
  const colors = {
    Completed: 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Planning: 'bg-yellow-100 text-yellow-800',
    'On Hold': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Lifecycle hooks
onMounted(() => {
  console.log('Dashboard mounted');
});

// Watchers
watch(
  () => projects.value,
  (newProjects) => {
    console.log('Projects updated:', newProjects.length);
  },
  { deep: true }
);
</script>

<style scoped>
/* Custom styles if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
