class TextPredict {
    constructor(element, debug = true) {
        this.selector = element;
        this.element = document.querySelector(element);
        this.apiUrl = 'https://unknownf331-test2.hf.space/word?text=';
        this.apiUrl2 = 'https://unknownf331-test2.hf.space/match?text=';
        this.debugElement = this.createDebugElement(debug);
        this.listbarid = 'tp-list-' + this.selector
        this.setupEventListeners();
        this.createListBar();
        this.appendStyles()
        this.valueArray = []
        this.addedListner = false
    }

    appendStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .tp-list {background: rgb(230, 230, 230);position: absolute;border-radius: 5px;filter: drop-shadow(0 2px 2px rgba(128, 128, 128, 0.534));font-family: inherit;z-index:999999}.tp-list span {display: flex;padding: 10px;}.tp-list span button {min-width: 60px;background: transparent;border: 0;border-right: 1px solid rgba(128, 128, 128, 0.534);font-family: inherit;}.tp-list span button:last-child {border: none;}.tp-list .edge {background: rgb(230, 230, 230);clip-path: polygon(51% 39%, 1% 0, 100% 0);position: absolute;bottom: calc(-100% + 9px);left: 50%;z-index: 1;width: 30px;height: 30px;transform: translate(-50%, 0%);}.tp-list.down .edge {left: 50%;top: 0%;margin-top: -10px;transform-origin: left;transform: translate(50%, -50%) rotate(180deg);}
        `;
        document.head.appendChild(style);
    }

    createDebugElement(debug) {
        const debugElement = document.createElement('div');
        debugElement.id = 'tp-debug-' + this.selector;
        debugElement.style.background = 'red';
        debugElement.style.position = 'fixed';
        debugElement.style.top = 0;
        debugElement.style.right = 0;

        if (!debug) {
            debugElement.style.display = 'none';
        }

        document.body.append(debugElement);
        return debugElement;
    }

    createListBar() {
        const listbar = document.createElement('div');
        listbar.classList.add('tp-list')
        listbar.id = 'tp-list-' + this.selector;
        document.body.append(listbar);
    }

    updateListBarContent(text) {
        if (text.length < 10) {
            document.getElementById(this.listbarid).style.display = 'none'
        }
        else {
            document.getElementById(this.listbarid).style.display = 'block'
        }
        console.log("t l" + text.trim("").length + "=" + text.trim());

        const buttons = text.split(' ').map(buttonText => {
            return `<button>${buttonText.trim()}</button>`;
        });


        const listBarContent = `
            <span>${buttons.join('')}</span>
            <div class="edge">t</div>
        `;

        document.getElementById(this.listbarid).innerHTML = listBarContent;
    }

    updateListBarPosition() {
        const rect = this.element.getBoundingClientRect();

        this.xCoordinate = rect.left + window.pageXOffset;
        this.yCoordinate = rect.top + window.pageYOffset;

        const listBar = document.getElementById(this.listbarid);
        listBar.style.left = `${this.xCoordinate}px`;

        // Check if the top position is less than 100px
        if (this.yCoordinate < 100) {
            // Show the list bar above the input box
            listBar.style.top = `${this.yCoordinate + rect.height + 10}px`;
            console.log('topp' + this.yCoordinate + rect.height);
            listBar.style.bottom = 'auto';
            listBar.classList.add('down')
            listBar.classList.remove('up')
        } else {
            // Show the list bar below the input box
            listBar.style.top = 'auto'; // Ensure top is not set
            listBar.style.bottom = `${window.innerHeight - this.yCoordinate + 10}px`;
            console.log('below' + window.innerHeight + this.yCoordinate);
            listBar.classList.add('up')
            listBar.classList.remove('down')
        }

        console.log('X Coordinate:', this.xCoordinate);
        console.log('Y Coordinate:', this.yCoordinate);
    }

    async request_next_word(value) {
        try {
            const response = await fetch(this.apiUrl + value);
            const text = await response.text();
            console.log(text);
            this.updateListBarContent(text)
            this.updateListBarPosition();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async request_match_word(value) {
        try {
            // Get the current input value and cursor position
            let text = this.element.value;
            const start = this.element.selectionStart;

            // Extract the word at the cursor position
            const lastSpaceIndex = text.lastIndexOf(' ', start - 1);
            const wordToMatch = text.slice(lastSpaceIndex + 1, start);

            // Send the extracted word to the API
            const response = await fetch(this.apiUrl2 + wordToMatch);
            text = await response.text();
            console.log(text);
            this.updateListBarContent(text);
            this.updateListBarPosition();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    updateDebugText(value) {
        this.debugElement.innerText = value;
    }

    typeInTextarea(newText, el = document.activeElement) {
        console.log('called for: ' + newText);
        const start = el.selectionStart;
        const text = el.value;

        // Check for space before the cursor
        if (text[start - 1] === ' ') {
            // Directly insert text with a space
            el.value = (text.slice(0, start) + newText + ' ' + text.slice(start));
            el.selectionStart = start + newText.length + 1;
            el.selectionEnd = start + newText.length + 1;
        } else {
            // Remove until the previous space is found
            const lastSpaceIndex = text.lastIndexOf(' ', start - 1);
            el.value = text.slice(0, lastSpaceIndex + 1) + newText + text.slice(start);
            el.selectionStart = lastSpaceIndex + 1 + newText.length;
            el.selectionEnd = lastSpaceIndex + 1 + newText.length;
        }

        el.focus();
    }

    hideListBar() {
        document.getElementById(this.listbarid).style.display = 'none';
    }


    setupEventListeners() {
        this.element.addEventListener('keyup', () => {
            const inputValue = this.element.value;
            console.log(inputValue);
            this.updateDebugText(inputValue);

            this.valueArray = inputValue.split(' ')

            if (event.key === ' ' || event.code === 'Space') {
                this.request_next_word(inputValue);
            } else {
                this.request_match_word(inputValue);
                console.error('next word api called');
            }


            clearTimeout(this.hideListBarTimeout);
            this.hideListBarTimeout = setTimeout(() => {
                this.hideListBar();
            }, 3000);

        });

        this.element.addEventListener('focus', () => {
            this.updateListBarPosition();
            document.getElementById(this.listbarid).style.display = 'block';

            if (!this.addedListner) {

                document.getElementById(this.listbarid).addEventListener('click', (event) => {
                    this.addedListner = true
                    if (event.target.tagName === 'BUTTON') {
                        const buttonValue = event.target.innerText;
                        // this.element.value += buttonValue + ' ';
                        this.typeInTextarea(buttonValue, this.element)
                        this.request_next_word(this.element.value);

                        document.getElementById(this.listbarid).style.display = 'block';
                    }
                });

            }
        });

    }
}
