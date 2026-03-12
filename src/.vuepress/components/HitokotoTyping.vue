<script lang="ts">
export default {
  name: "HitokotoTyping",
};
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type HitokotoResp = {
  hitokoto: string;
  from?: string | null;
  from_who?: string | null;
};

const API = "https://v1.hitokoto.cn/";

// typing behavior
const TYPE_INTERVAL_MS = 65;
const AFTER_DONE_WAIT_MS = 5000;
const REQUEST_TIMEOUT_MS = 8000;

// fallback (when API fails)
const FALLBACK_QUOTE = "你可以在这里放置或是整个项目的描述。";
const FALLBACK_FROM = "";

const fullText = ref("");
const fullFrom = ref("");
const displayText = ref("");
const isLoading = ref(true);
const hadError = ref(false);

const signatureText = computed(() => {
  const from = (fullFrom.value || "").trim();
  return from ? `——「${from}」` : "";
});

let typingTimer: number | null = null;
let loopTimer: number | null = null;
let alive = true;

function clearTimers(): void {
  if (typeof window === "undefined") return;
  if (typingTimer !== null) {
    window.clearInterval(typingTimer);
    typingTimer = null;
  }
  if (loopTimer !== null) {
    window.clearTimeout(loopTimer);
    loopTimer = null;
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  if (typeof window === "undefined") throw new Error("SSR");
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(t);
  }
}

async function loadOne(): Promise<void> {
  isLoading.value = true;
  hadError.value = false;

  try {
    const resp = await fetchWithTimeout(API, REQUEST_TIMEOUT_MS);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as HitokotoResp;

    const quote = (data.hitokoto || "").trim();
    const from = (data.from || data.from_who || "").toString().trim();

    if (!quote) throw new Error("Empty hitokoto");

    fullText.value = quote;
    fullFrom.value = from;
  } catch {
    hadError.value = true;
    fullText.value = FALLBACK_QUOTE;
    fullFrom.value = FALLBACK_FROM;
  } finally {
    isLoading.value = false;
  }
}

function startTypingLoop(): void {
  clearTimers();
  displayText.value = "";

  const text = fullText.value;
  let i = 0;

  typingTimer = window.setInterval(() => {
    if (!alive) return;

    i += 1;
    displayText.value = text.slice(0, i);

    if (i >= text.length) {
      if (typingTimer !== null) window.clearInterval(typingTimer);
      typingTimer = null;
      loopTimer = window.setTimeout(async () => {
        if (!alive) return;
        await nextRound();
      }, AFTER_DONE_WAIT_MS);
    }
  }, TYPE_INTERVAL_MS);
}

async function nextRound(): Promise<void> {
  await loadOne();
  if (!alive) return;
  startTypingLoop();
}

onMounted(async () => {
  if (typeof window === "undefined") return;
  alive = true;
  await nextRound();
});

onBeforeUnmount(() => {
  alive = false;
  clearTimers();
});
</script>

<template>
  <div class="hitokoto-wrap" :class="{ 'is-loading': isLoading, 'has-error': hadError }">
    <p class="hitokoto-quote">
      <span class="hitokoto-text-wrap"><span class="hitokoto-text">{{ displayText }}</span></span
      ><span class="hitokoto-caret" aria-hidden="true" />
    </p>
    <p v-if="signatureText" class="hitokoto-signature">{{ signatureText }}</p>
  </div>
</template>

<style scoped>
.hitokoto-wrap {
  margin: 0.75rem auto 0;
  padding: 0;
  white-space: nowrap; /* Prevent text from wrapping */
  width: fit-content; /* Make width adapt to content */
  max-width: 100%; /* Prevent exceeding screen width */
}

.hitokoto-quote {
  margin: 0;
  color: rgba(255, 255, 255, 0.96);
  font-size: clamp(1.2rem, 1.6vw + 0.8rem, 1.85rem);
  font-weight: 650;
  line-height: 2;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.42);
  white-space: nowrap; /* Ensure text stays on one line */
  display: inline-block; /* Make the element size to its content */
}

.hitokoto-text-wrap {
  position: relative;
  display: inline-block;
  padding: 0.15rem 1.1rem;
  white-space: nowrap; /* Prevent wrapping inside the text wrap */
}

.hitokoto-text-wrap::before,
.hitokoto-text-wrap::after {
  position: absolute;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 800;
  font-size: 0.55em;
}

.hitokoto-text-wrap::before {
  content: "『";
  left: 0;
  top: 0;
  transform: translate(-155%, -35%);
}

.hitokoto-text-wrap::after {
  content: "』";
  right: 0;
  bottom: 0;
  transform: translate(155%, 35%);
}

.hitokoto-signature {
  margin: 0.55rem 0 0;
  color: rgba(255, 255, 255, 0.96);
  font-size: clamp(1.02rem, 0.7vw + 0.85rem, 1.22rem);
  text-align: right;
  font-style: italic;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.42);
}

.hitokoto-caret {
  display: inline-block;
  width: 0.4ch;
  height: 0.76em;
  margin-left: -1ch;
  transform: translateY(0.12em);
  border-right: 3px solid rgba(255, 255, 255, 0.92);
  animation: caretBlink 0.9s steps(1) infinite;
}

.is-loading .hitokoto-quote {
  opacity: 0.9;
}

@keyframes caretBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
</style>