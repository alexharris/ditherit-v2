<template>
  <div class="flex-1 overflow-y-auto">
    <SidebarDitherMode />
    <USeparator />
    <SidebarPalette />
    <USeparator />
    <SidebarPixelScale />
    <div class="m-4 space-y-3">
      <SidebarLatestPost />
      <NewsletterSignup />
      <a href="https://v2.ditherit.com" target="_blank" rel="noopener" class="block">
        <UCard
          variant="soft"
          :ui="{ root: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer', body: 'p-3 sm:p-3' }"
        >
          <p class="mb-1 text-sm font-medium text-highlighted">
            🏁 Looking for the old version?
          </p>
          <p class="text-sm text-gray-800 dark:text-gray-100">
            Version 2 is still available at v2.ditherit.com.
          </p>
        </UCard>
      </a>
    </div>
  </div>
</template>
