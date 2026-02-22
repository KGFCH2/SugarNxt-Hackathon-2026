/**
 * chatbot.js — ThermaBot Logic
 */

(function () {
    'use strict';

    const API_BASE = 'http://localhost:8000';

    const MOCK_ANSWERS = {
        "hello": "Hello! I'm ThermaBot. How can I help you optimize your sugar mill's energy recovery today?",
        "hi": "Hello! I'm ThermaBot. How can I help you optimize your sugar mill's energy recovery today?",
        "hey": "Hello! I'm ThermaBot. How can I help you optimize your sugar mill's energy recovery today?",
        "what is thermavision?": "ThermaVision is an industrial energy optimization platform designed for the sugar industry. It simulates and calculates the feasibility of recovering waste heat from flue gases to pre-heat raw juice, reducing boiler energy demand.",
        "thermavision": "ThermaVision is an industrial energy optimization platform designed for the sugar industry. It simulates and calculates the feasibility of recovering waste heat from flue gases to pre-heat raw juice, reducing boiler energy demand.",
        "how does it work?": "It uses the thermodynamic principle Q = m * Cp * dT. By diverting high-temperature flue gas (150°C - 450°C) through a heat exchanger, we transfer energy to the juice stream, saving bagasse fuel and reducing CO₂.",
        "what are the benefits?": "The key benefits are: 1. Significant fuel (Bagasse) savings. 2. Reduced CO₂ footprint. 3. Improved plant efficiency. 4. Rapid ROI (usually 1.5 - 3 years).",
        "who developed this?": "This project was developed by Team Four-0-Four (Babin, Debasmita, Joita, and Manisha) for the SugarNxt Hackathon 2026.",
        "is it safe for the boiler?": "Yes, ThermaVision includes warnings for the 'Acid Dew Point'. We recommend keeping outlet temps above 120°C to prevent sulphuric acid corrosion in the stack.",
        "technical stack": "The backend is built with FastAPI (Python) for thermodynamics and AI. The frontend uses Vanilla JS, Three.js for 3D, and Chart.js for data visualization.",
        "tech stack": "The backend is built with FastAPI (Python) for thermodynamics and AI. The frontend uses Vanilla JS, Three.js for 3D, and Chart.js for data visualization."
    };

    const SUGGESTIONS = [
        "What is ThermaVision?",
        "How does it work?",
        "What are the benefits?",
        "Technical Stack?"
    ];

    const trigger = document.createElement('div');
    trigger.className = 'chatbot-trigger';
    trigger.innerHTML = '<i data-lucide="message-square"></i>';
    document.body.appendChild(trigger);

    const container = document.createElement('div');
    container.className = 'chatbot-container';
    container.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-header-info">
                <i data-lucide="bot"></i>
                <div>
                    <h4>ThermaBot</h4>
                    <p>AI Energy Consultant</p>
                </div>
            </div>
            <div class="chatbot-close" style="cursor:pointer;"><i data-lucide="x"></i></div>
        </div>
        <div class="chatbot-messages" id="chat-messages">
            <div class="chat-message bot">
                Hello! I'm ThermaBot. How can I help you optimize your sugar mill's energy recovery today?
            </div>
        </div>
        <div style="padding: 0 20px;">
            <div class="suggestions" id="chat-suggestions"></div>
        </div>
        <div class="chatbot-input-area">
            <input type="text" class="chatbot-input" id="chat-input" placeholder="Ask me anything...">
            <button class="chatbot-send" id="chat-send">
                <i data-lucide="send"></i>
            </button>
        </div>
    `;
    document.body.appendChild(container);

    const messagesContainer = document.getElementById('chat-messages');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const suggestionsContainer = document.getElementById('chat-suggestions');
    const closeBtn = container.querySelector('.chatbot-close');

    // Initialize Lucide for new elements
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Toggle Chatbot
    trigger.addEventListener('click', () => {
        container.classList.toggle('active');
        if (container.classList.contains('active')) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // Populate Suggestions
    function renderSuggestions() {
        suggestionsContainer.innerHTML = '';
        SUGGESTIONS.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = text;
            chip.onclick = () => {
                inputField.value = text;
                handleSend();
            };
            suggestionsContainer.appendChild(chip);
        });
    }
    renderSuggestions();

    // Typewriter effect (Copilot animation)
    function typeMessage(element, text, speed = 20) {
        if (!text) {
            element.textContent = "...";
            return;
        }
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                element.classList.remove('typing');
            }
        }
        type();
    }

    async function handleSend() {
        const message = inputField.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        inputField.value = '';

        // Check mock responses first
        const lowerMsg = message.toLowerCase();
        let foundMock = false;

        for (const [key, val] of Object.entries(MOCK_ANSWERS)) {
            if (lowerMsg.includes(key)) {
                showBotResponse(val);
                foundMock = true;
                break;
            }
        }

        if (!foundMock) {
            // Call Groq AI via Backend
            showBotLoading();
            try {
                const res = await fetch(`${API_BASE}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });

                if (!res.ok) throw new Error('AI Service Offline');

                const data = await res.json();
                removeBotLoading();
                showBotResponse(data.response);
            } catch (err) {
                removeBotLoading();
                showBotResponse("I'm having trouble connecting to my AI brain. Please check if the backend is running or try a different question!");
            }
        }
    }

    function addMessage(text, role) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return msgDiv;
    }

    function showBotResponse(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot';
        messagesContainer.appendChild(msgDiv);
        typeMessage(msgDiv, text);
    }

    function showBotLoading() {
        const loading = document.createElement('div');
        loading.className = 'chat-message bot loading-msg';
        loading.id = 'bot-loading';
        loading.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(loading);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeBotLoading() {
        const loading = document.getElementById('bot-loading');
        if (loading) loading.remove();
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

})();
