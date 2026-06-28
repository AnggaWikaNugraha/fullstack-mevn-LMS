<script setup lang="ts">
import { Loader2 } from '@lucide/vue';
import { useOtpVerification } from '@/composables/auth/useOtpVerification';

const { email, otp, isPending, isResending, serverError, cooldown, canResend, onSubmit, onResend } = useOtpVerification();
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Check your email</h2>
      <p class="text-gray-500 text-sm mt-1">
        We sent a 6-digit code to
        <span class="font-semibold text-indigo-600">{{ email }}</span>
      </p>
    </div>

    <div v-if="serverError" class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
      <span class="mt-0.5 shrink-0">⚠</span>
      <span>{{ serverError }}</span>
    </div>

    <div class="space-y-5">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-gray-700">Verification Code</label>
        <input
          v-model="otp"
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="000000"
          class="w-full px-4 py-4 rounded-xl border border-gray-300 bg-gray-50 text-center text-3xl tracking-[0.6em] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          @input="otp = otp.replace(/\D/g, '')"
        />
        <p class="text-xs text-gray-400 text-center">Code expires in 15 minutes</p>
      </div>

      <button
        :disabled="otp.length !== 6 || isPending"
        class="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        @click="onSubmit"
      >
        <Loader2 v-if="isPending" class="w-4 h-4 animate-spin" />
        {{ isPending ? 'Verifying...' : 'Verify Code' }}
      </button>

      <div class="text-center pt-1">
        <p class="text-sm text-gray-500 mb-1">Didn't receive the code?</p>
        <button
          :disabled="!canResend || isResending"
          class="text-sm font-semibold transition-colors"
          :class="canResend ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'"
          @click="onResend"
        >
          <Loader2 v-if="isResending" class="w-3 h-3 animate-spin inline mr-1" />
          <span v-if="canResend">Resend code</span>
          <span v-else>Resend in {{ cooldown }}s</span>
        </button>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-100 text-center">
      <RouterLink to="/auth/login" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to login
      </RouterLink>
    </div>
  </div>
</template>
