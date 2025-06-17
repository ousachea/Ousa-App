<template>
    <GlobalNavigator />
    <div class="container" :style="{ backgroundImage: backgroundGradient }">
      <!-- Floating particles for visual interest -->
      <div class="particles">
        <div class="particle" v-for="n in 6" :key="n"></div>
      </div>
  
      <div class="card" :class="{ 'error-state': invalidInput }">
        <!-- Header with icon -->
        <div class="header">
          <div class="icon-badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79C7.06 13.62 9.38 15.94 12.21 16.38L14.41 14.18C14.69 14.1 14.96 14.04 15.2 13.94C15.61 13.82 16.04 13.9 16.38 14.18L19.97 17.77C20.35 18.15 20.35 18.77 19.97 19.15C19.59 19.53 18.97 19.53 18.59 19.15L15.2 15.76C14.96 15.52 14.61 15.44 14.3 15.56C13.94 15.7 13.56 15.78 13.17 15.8C9.58 15.97 6.7 13.42 6.53 9.83C6.47 8.94 6.62 8.09 6.94 7.32L4.83 5.21C4.45 4.83 4.45 4.21 4.83 3.83C5.21 3.45 5.83 3.45 6.21 3.83L8.32 5.94C9.09 5.62 9.94 5.47 10.83 5.53C13.42 5.7 15.47 7.75 15.64 10.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="header-text">
            <h2 class="title">Cambodia Carrier Checker</h2>
            <p class="subtitle">Enter the first two digits of any Cambodian number</p>
          </div>
        </div>
        
        <!-- Enhanced input section -->
        <div class="phone-section">
          <div class="phone-card">
            <div class="input-container">
              <div class="input-prefix">+855</div>
              <input
                v-model="phoneNumber"
                placeholder="00"
                @input="formatAndDetectCarrier"
                class="input"
                :class="{ shakeLoop: invalidInput, matched: matchedPrefix }"
                :style="{ borderColor: inputBorderColor, boxShadow: inputShadow }"
                maxlength="2"
                type="text"
                inputmode="numeric"
              />
              <button 
                v-if="phoneNumber" 
                @click="clearInput" 
                class="clear-button"
                aria-label="Clear input"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            
            <!-- Success indicator -->
            <transition name="success-pop">
              <div class="success-indicator" v-if="carrier !== 'Unknown Carrier'">
                <div class="success-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </transition>
          </div>
        </div>
  
        <!-- Carrier result with enhanced styling -->
        <transition name="fade-slide">
          <div class="carrier-result" v-if="carrier !== 'Unknown Carrier'">
            <div class="result-content">
              <div class="carrier-icon" :style="{ backgroundColor: carriers[carrier]?.color }">
                <span class="carrier-initial">{{ carrier.charAt(0) }}</span>
              </div>
              <div class="result-text">
                <p class="result-label">Your carrier is</p>
                <p class="carrier-name" :style="{ color: carriers[carrier]?.color }">{{ carrier }}</p>
              </div>
            </div>
          </div>
        </transition>
  
        <!-- Enhanced carrier list -->
        <div class="carriers-section">
          <div class="section-header">
            <h3 class="section-title">Available Carriers</h3>
            <div class="section-divider"></div>
          </div>
          
          <div class="carrier-grid">
            <div
              v-for="(carrierData, name) in carriers"
              :key="name"
              class="carrier-card"
              :class="{ 
                faded: carrier && carrier !== name,
                active: carrier === name 
              }"
              :style="{ 
                borderColor: carrier === name ? carrierData.color : 'transparent',
                '--carrier-color': carrierData.color 
              }"
            >
              <div class="carrier-header">
                <div class="carrier-logo" :style="{ backgroundColor: carrierData.color }">
                  <span>{{ name.charAt(0) }}</span>
                </div>
                <h4 class="carrier-title">{{ name }}</h4>
                <div class="carrier-status" v-if="carrier === name">
                  <span class="status-dot"></span>
                  <span class="status-text">Active</span>
                </div>
              </div>
              
              <div class="prefixes-container">
                <div class="prefixes-grid">
                  <span
                    v-for="prefix in carrierData.prefixes"
                    :key="prefix"
                    class="prefix-chip"
                    :class="{
                      highlighted: matchedPrefix === prefix,
                      pulse: matchedPrefix === prefix,
                    }"
                    :style="{ 
                      backgroundColor: matchedPrefix === prefix ? carrierData.color : undefined,
                      borderColor: carrierData.color + '40'
                    }"
                  >
                    0{{ prefix }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const phoneNumber = ref('');
  const matchedPrefix = ref(null);
  const invalidInput = ref(false);
  const carrier = ref('Unknown Carrier');
  
  // Create a set of all valid prefixes for quick lookup
  const validPrefixes = new Set();
  const carriers = {
    Cellcard: {
      color: '#FF9800',
      prefixes: [
        '11', '12', '17', '61', '76', 
        '77', '78', '79', '85', '89', 
        '92', '95', '99',
      ],
    },
    Smart: {
      color: '#00A859',
      prefixes: [
        '10', '15', '16', '69', '70', 
        '81', '86', '87', '93', '96', '98',
      ],
    },
    Metfone: { 
      color: '#E60012', 
      prefixes: ['88', '97'] 
    },
  };
  
  // Fill the validPrefixes set
  Object.values(carriers).forEach(carrierData => {
    carrierData.prefixes.forEach(prefix => validPrefixes.add(prefix));
  });
  
  const inputBorderColor = computed(() => {
    if (invalidInput.value) return '#ef4444';
    return carrier.value !== 'Unknown Carrier'
      ? carriers[carrier.value]?.color || '#e5e7eb'
      : '#e5e7eb';
  });
  
  const inputShadow = computed(() => {
    if (invalidInput.value) return '0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(239, 68, 68, 0.15)';
    return carrier.value !== 'Unknown Carrier'
      ? `0 0 0 3px ${carriers[carrier.value]?.color}20, 0 4px 12px ${carriers[carrier.value]?.color}30` 
      : '0 4px 12px rgba(0, 0, 0, 0.05)';
  });
  
  const backgroundGradient = computed(() => {
    if (invalidInput.value) {
      return 'radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.08) 0%, transparent 50%), linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)';
    }
    if (carrier.value !== 'Unknown Carrier') {
      const color = carriers[carrier.value]?.color;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `radial-gradient(circle at 20% 80%, rgba(${r}, ${g}, ${b}, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(${r}, ${g}, ${b}, 0.1) 0%, transparent 50%), linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)`;
    }
    return 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.06) 0%, transparent 50%), linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)';
  });
  
  watch(phoneNumber, (newValue) => {
    if (newValue && !/^[0-9]{1,2}$/.test(newValue)) {
      phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '');
      showError();
    }
    
    // Don't allow "0" as the first digit
    if (newValue && newValue.charAt(0) === '0') {
      phoneNumber.value = phoneNumber.value.substring(1);
      showError();
    }
  });
  
  const showError = () => {
    invalidInput.value = false;
    setTimeout(() => {
      invalidInput.value = true;
    }, 10);
  };
  
  const clearInput = () => {
    phoneNumber.value = '';
    carrier.value = 'Unknown Carrier';
    matchedPrefix.value = null;
    invalidInput.value = false;
  };
  
  const formatAndDetectCarrier = () => {
    if (!phoneNumber.value) {
      carrier.value = 'Unknown Carrier';
      matchedPrefix.value = null;
      invalidInput.value = false;
      return;
    }
    
    const input = phoneNumber.value.padStart(2, '0').slice(0, 2);
    
    // Reset state
    matchedPrefix.value = null;
    carrier.value = 'Unknown Carrier';
    invalidInput.value = false;
  
    // If we have 2 digits and it's not a valid prefix, show error
    if (phoneNumber.value.length === 2 && !validPrefixes.has(input)) {
      showError();
      return;
    }
  
    // Check for a match
    for (const [key, carrierData] of Object.entries(carriers)) {
      if (carrierData.prefixes.includes(input)) {
        carrier.value = key;
        matchedPrefix.value = input;
        return;
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 24px;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }
  
  .particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
  .particle:nth-child(2) { top: 80%; left: 80%; animation-delay: 1s; }
  .particle:nth-child(3) { top: 40%; left: 70%; animation-delay: 2s; }
  .particle:nth-child(4) { top: 70%; left: 30%; animation-delay: 3s; }
  .particle:nth-child(5) { top: 10%; left: 60%; animation-delay: 4s; }
  .particle:nth-child(6) { top: 90%; left: 10%; animation-delay: 5s; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
  }
  
  .card {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 40px;
    border-radius: 32px;
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    width: 100%;
    max-width: 1200px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
  }
  
  .card.error-state {
    box-shadow: 
      0 20px 25px -5px rgba(239, 68, 68, 0.15),
      0 10px 10px -5px rgba(239, 68, 68, 0.1),
      0 0 0 1px rgba(239, 68, 68, 0.1);
  }
  
  .header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 20px;
    color: white;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
  
  .header-text {
    flex: 1;
  }
  
  .title {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
    letter-spacing: -0.025em;
  }
  
  .subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
  }
  
  .phone-section {
    margin-bottom: 32px;
  }
  
  .phone-card {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
  
  .input-container {
    position: relative;
    width: 100%;
    max-width: 320px;
  }
  
  .input-prefix {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    z-index: 2;
  }
  
  .input {
    width: 100%;
    padding: 20px 60px 20px 80px;
    font-size: 24px;
    font-weight: 600;
    border-radius: 20px;
    border: 2px solid #e5e7eb;
    text-align: left;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    color: #1f2937;
  }
  
  .input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15);
  }
  
  .input::placeholder {
    color: #9ca3af;
  }
  
  .clear-button {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: #f3f4f6;
    border: none;
    color: #6b7280;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;
  }
  
  .clear-button:hover {
    background: #e5e7eb;
    color: #374151;
    transform: translateY(-50%) scale(1.1);
  }
  
  .success-indicator {
    margin-left: 16px;
  }
  
  .success-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: #10b981;
    border-radius: 50%;
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  .success-pop-enter-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .success-pop-enter-from {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  
  .carrier-result {
    margin-bottom: 40px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }
  
  .result-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .carrier-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .result-text {
    flex: 1;
  }
  
  .result-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .carrier-name {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.025em;
  }
  
  .fade-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .carriers-section {
    margin-top: 40px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
    letter-spacing: -0.025em;
  }
  
  .section-divider {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
    margin: 0 auto;
  }
  
  .carrier-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .carrier-card {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  
  .carrier-card:hover:not(.faded) {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: var(--carrier-color);
  }
  
  .carrier-card.active {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.9);
  }
  
  .carrier-card.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--carrier-color);
  }
  
  .carrier-card.faded {
    opacity: 0.5;
    transform: scale(0.95);
  }
  
  .carrier-header {
    padding: 24px 24px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .carrier-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .carrier-title {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .carrier-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 20px;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }
  
  .status-text {
    font-size: 12px;
    font-weight: 600;
    color: #10b981;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .prefixes-container {
    padding: 0 24px 24px;
  }
  
  .prefixes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
    gap: 8px;
  }
  
  .prefix-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border: 2px solid;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.8);
    color: #374151;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }
  
  .prefix-chip.highlighted {
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .pulse {
    animation: pulse-chip 2s infinite;
  }
  
  @keyframes pulse-chip {
    0%, 100% { 
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    50% { 
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(255, 255, 255, 0.1);
    }
  }
  
  .shakeLoop {
    animation: shake 0.6s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .container {
      padding: 16px;
    }
    
    .card {
      padding: 24px;
      max-width: 100%;
    }
    
    .header {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }
    
    .title {
      font-size: 28px;
    }
    
    .carrier-grid {
      grid-template-columns: 1fr;
    }
    
    .result-content {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }
  }
  
  @media (min-width: 1400px) {
    .container {
      padding: 40px;
    }
    
    .card {
      max-width: 1400px;
    }
  }
  </style>