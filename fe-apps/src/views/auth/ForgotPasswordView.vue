<script setup lang="ts">
import { Loader2 } from '@lucide/vue';
import { useForgotPassword } from '@/composables/auth/useForgotPassword';

const {
  email,
  errors,
  isPending,
  serverError,
  onSubmit,
} = useForgotPassword();
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Forgot password?</h2>
      <p class="text-gray-500 text-sm mt-1">Enter your email and we'll send you a verification code.</p>
    </div>

    <div v-if="serverError" class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
      <span class="mt-0.5 shrink-0">⚠</span>
      <span>{{ serverError }}</span>
    </div>

    <form class="space-y-5" @submit="onSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          :class="errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'"
        />
        <p v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</p>
      </div>

      <button
        type="submit"
        :disabled="isPending"
        class="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Loader2 v-if="isPending" class="w-4 h-4 animate-spin" />
        {{ isPending ? 'Sending...' : 'Send Verification Code' }}
      </button>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-100 text-center">
      <p class="text-sm text-gray-500">
        Remember your password?
        <RouterLink to="/auth/login" class="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>
