function processText() {
    var prompt = document.getElementById('prompt-input').value;
    console.log('Prompt:', prompt);
    if (prompt === '') {
        return; // If prompt is empty, do nothing
    }

    // Stop any ongoing speech synthesis
    stopSpeaking();

    // Add user's message to the chat container
    addMessage(prompt, 'user');

    // Send the prompt to the server for processing
    processPrompt(prompt);
    // clear the input
    document.getElementById('prompt-input').value = '';
}

function stopSpeaking() {
    var synth = window.speechSynthesis;
    if (synth.speaking) {
        synth.cancel();
    }
}

function processPrompt(prompt) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/process_prompt', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var textResponse = response.text;
            // textResponse = textResponse.replace(/\n/g, '<br>'); // Replace newlines with <br> tags
            textResponse = textResponse.replace(/[\\*]/g, ''); // Remove backslashes and asterisks
            addMessage(textResponse, 'received');

            // Speak the response
            speakText(textResponse, function() {
                // After the voice output is complete, clear the input field and focus on it
                // document.getElementById('prompt-input').value = '';
                document.getElementById('prompt-input').focus();
            });
        }
    };
    xhr.send(JSON.stringify({ prompt: prompt }));
}


function addMessage(message, type) {
    var chatContainer = document.getElementById('chat');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(type);
    
    // Split message by code block delimiter
    var parts = message.split(/```/g);
    
    // Loop through parts and add as plain text or code block
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (i % 2 === 0) {
            // Add plain text
            var textElement = document.createElement('span');
            textElement.innerText = part;
            messageElement.appendChild(textElement);
        } else {
            // Add code block
            var preElement = document.createElement('pre');
            var codeElement = document.createElement('div');
            codeElement.setAttribute('id', 'codeDiv'); // set the ID to 'myCodeDiv'
            codeElement.style.overflow = 'auto'; // set the overflow property to auto
            codeElement.appendChild(preElement);
            preElement.innerText = part;
            messageElement.appendChild(codeElement);
        }
    }
    
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}



function speakText(text, onComplete) {
    var synth = window.speechSynthesis;
    var parts = text.split(/```/g);
    var plainText = '';

    // Concatenate all the plain text parts
    for (var i = 0; i < parts.length; i += 2) {
        plainText += parts[i];
    }

    // Speak the plain text
    var utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.5;
    utterance.onend = function() {
        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    };
    synth.speak(utterance);
}

