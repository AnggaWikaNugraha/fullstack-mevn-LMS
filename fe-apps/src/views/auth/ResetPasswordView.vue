<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from '@lucide/vue';
import { useResetPassword } from '@/composables/auth/useResetPassword';

const { newPassword, confirmPassword, errors, isPending, serverError, showPassword, showConfirm, isSuccess, onSubmit } = useResetPassword();
</script>

<template>
  <div>
    <!-- Success state -->
    <div v-if="isSuccess" class="text-center py-6">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Password reset!</h2>
      <p class="text-gray-500 text-sm">Redirecting you to login...</p>
    </div>

    <!-- Form state -->
    <div v-else>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Set new password</h2>
        <p class="text-gray-500 text-sm mt-1">Must be at least 8 characters long.</p>
      </div>

      <div v-if="serverError" class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
        <span class="mt-0.5 shrink-0">⚠</span>
        <span>{{ serverError }}</span>
      </div>

      <form class="space-y-5" @submit="onSubmit">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700">New Password</label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Min. 8 characters"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-11 rounded-xl border bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              :class="errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'"
            />
            <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-red-500 text-xs">{{ errors.newPassword }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Re-enter new password"
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-11 rounded-xl border bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              :class="errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'"
            />
            <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" @click="showConfirm = !showConfirm">
              <EyeOff v-if="showConfirm" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          :disabled="isPending"
          class="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isPending" class="w-4 h-4 animate-spin" />
          {{ isPending ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-gray-100 text-center">
        <RouterLink to="/auth/login" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
