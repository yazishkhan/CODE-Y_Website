document.addEventListener('DOMContentLoaded', () => {
  	  // CodeMirror Initialization for editing .......
    const codeEditor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        mode: "python", // Default language when alwayes we reload the difult language is python
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    const terminalOutput = document.getElementById('terminal-output');
    const runBtn = document.getElementById('run-code-btn');
    const languageSelector = document.getElementById('language-select');
    const dynamicInputContainer = document.getElementById('dynamic-input-container');
    const staticInput = document.getElementById('static-input');

   		 // Language mapping for Judge0 API fro requisting output
    const languages = {
        'python': 71,
        'c': 50,
        'cpp': 54,
        'java': 62,
        'javascript': 63,
        'go': 60,
        'rust': 73
    };

    	// Update CodeMirror mode on language change for syntax highiliting
    languageSelector.addEventListener('change', () => {
        const lang = languageSelector.value;
        const mode = lang === 'c' || lang === 'cpp' ? 'clike' : lang;
        codeEditor.setOption('mode', mode);
    });

    		// Interactive state management for code sendig to api
    let currentInputStep = 0;
    let collectedInputs = [];

    function displayNextInput() {
        if (currentInputStep >= 3) { // Hardcoded 3 steps for calculator
            const combinedInput = collectedInputs.join('\n');
            runCode(combinedInput);
            return;
        }

        dynamicInputContainer.innerHTML = '';
        
        const label = document.createElement('label');
        label.innerText = `Input ${currentInputStep + 1}:`;
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'interactive-input';
        
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                collectedInputs.push(inputField.value);
                terminalOutput.innerHTML += `> ${inputField.value}\n`;
                currentInputStep++;
                displayNextInput();
            }
        });

        dynamicInputContainer.appendChild(label);
        dynamicInputContainer.appendChild(inputField);
        inputField.focus();
    }

    async function runCode(input = "") {
        const code = codeEditor.getValue();
        const lang = languageSelector.value;
        const languageId = languages[lang];

        if (!code) {
            terminalOutput.innerText = "Please write some code.";
            return;
        }

        terminalOutput.innerText = "Running code... Please wait...";
        staticInput.style.display = 'block';
        dynamicInputContainer.innerHTML = '';

        try {
            const response = await fetch('/run_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    language_id: languageId,
                    input: input
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                terminalOutput.innerText = result.output;
            } else {
                terminalOutput.innerText = `Error: ${result.output}`;
            }
        } catch (error) {
            terminalOutput.innerText = `An error occurred: ${error.message}`;
        }
    }

    runBtn.addEventListener('click', () => {
        const code = codeEditor.getValue();
        const lang = languageSelector.value;
        
        currentInputStep = 0;
        collectedInputs = [];
        terminalOutput.innerText = '';

        const isPythonInteractive = lang === 'python' && code.includes('input(');
        const isCppInteractive = lang === 'cpp' && code.includes('std::cin');

        if (isPythonInteractive || isCppInteractive) {
            staticInput.style.display = 'none';
            displayNextInput();
        } else {
            staticInput.style.display = 'block';
            runCode(staticInput.value);
        }
    });

    // Load previous code
    const loadCodeLinks = document.querySelectorAll('.previous-code');
    loadCodeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const langId = e.target.closest('.previous-code').getAttribute('data-lang-id');
            const output = e.target.closest('.previous-code').querySelector('strong').nextSibling.textContent.trim();
            
            	// You can't load code snippets as they are not stored.
            // But you can load the language and show the output in the terminal
            
            	// Find the correct language option and set it
            for (const [key, value] of Object.entries(languages)) {
                if (value == langId) {
                    languageSelector.value = key;
                    codeEditor.setOption('mode', key);
                    break;
                }
            }
            terminalOutput.innerText = output;
        });
    });
});
