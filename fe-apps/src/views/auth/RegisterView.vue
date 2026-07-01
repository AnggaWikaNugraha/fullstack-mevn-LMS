<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from '@lucide/vue';
import { useRegister } from '@/composables/auth/useRegister';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton.vue';

const { name, email, password, confirmPassword, errors, isPending, serverError, showPassword, showConfirm, onSubmit } = useRegister();
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Create an account</h2>
      <p class="text-gray-500 text-sm mt-1">Start your learning journey today</p>
    </div>

    <div v-if="serverError" class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
      <span class="mt-0.5 shrink-0">⚠</span>
      <span>{{ serverError }}</span>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="John Doe"
          autocomplete="name"
          class="w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          :class="errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'"
        />
        <p v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</p>
      </div>

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

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            autocomplete="new-password"
            class="w-full px-4 py-3 pr-11 rounded-xl border bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
            :class="errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'"
          />
          <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" @click="showPassword = !showPassword">
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div class="relative">
          <input
            v-model="confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Re-enter your password"
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
        class="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
      >
        <Loader2 v-if="isPending" class="w-4 h-4 animate-spin" />
        {{ isPending ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <div class="flex items-center gap-3 my-5">
      <div class="flex-1 h-px bg-gray-200" />
      <span class="text-xs text-gray-400 font-medium">or</span>
      <div class="flex-1 h-px bg-gray-200" />
    </div>

    <GoogleSignInButton />

    <p class="text-center text-sm text-gray-500 mt-6">
      Already have an account?
      <RouterLink to="/auth/login" class="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</RouterLink>
    </p>
  </div>
</template>
