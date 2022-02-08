document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#gerenate-password').addEventListener('click', getPassword)
    document.querySelector('#copy-password').addEventListener('click', copyToClipboard);
    document.querySelectorAll('.min-input').forEach(element => element.addEventListener('change', (e) => checkMinInput(e.target)));
    document.querySelectorAll('.max-input').forEach(element => element.addEventListener('change', (e) => checkMaxInput(e.target)));

    function showValues() {
        const passwordLength = document.querySelector('#password-length');
        const maxInputs = document.querySelectorAll('.max-input');
        const minInputs = document.querySelectorAll('.min-input');
        let maxTotal = 0, minTotal = 0;

        maxInputs.forEach(element => maxTotal += parseInt(element.value));
        minInputs.forEach(element => minTotal += parseInt(element.value));

        passwordLength.innerHTML = `You password will be between ${minTotal} and ${maxTotal}`;
    }
    showValues();


    function checkMinInput(currentInput) {
        currentInput.value = Math.abs(currentInput.value);

        const currentMaxInput = currentInput.parentElement.querySelector('.max-input');
        if (parseInt(currentInput.value) > parseInt(currentMaxInput.value)) {
            currentInput.value = currentMaxInput.value;
        }

        showValues();
    }
    function checkMaxInput(currentInput) {
        const currentMinInput = currentInput.parentElement.querySelector('.min-input');

        if (parseInt(currentInput.value) < parseInt(currentMinInput.value))
            currentInput.value = currentMinInput.value;

        showValues();
    }

    const passwordOptions = {
        characters: {
            downcase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
        },
        excludeCharacters(excludedCharacters, characters) {
            for (let character in characters) {
                excludedCharacters.map(characterExcluded => {
                    characters[character] = characters[character].replaceAll(characterExcluded, '');
                });
            }
            return characters;
        },
        randomUppercase() {
            const uppercaseCharacters = this.characters.uppercase;
            return uppercaseCharacters[Math.floor(uppercaseCharacters.length * Math.random())];
        },
        randomDowncase() {
            const downcaseCharacters = this.characters.downcase;
            return downcaseCharacters[Math.floor(downcaseCharacters.length * Math.random())];
        },
        letters() {
            const options = document.querySelector('#letters-options');
            switch (options.value) {
                case 'uppercase':
                    return this.randomUppercase();
                case 'mixed':
                    return Math.floor(Math.random() * 10) % 2 === 0 ?
                        this.randomUppercase() : this.randomDowncase();
                default:
                    return this.randomDowncase();
            }
        },
        numbers() {
            const numbers = this.characters.numbers;
            return numbers[Math.floor(numbers.length * Math.random())];
        },
        customCharacters() {
            const customCharacters = document.querySelector('#characters-custom').value;
            return customCharacters[Math.floor(customCharacters.length * Math.random())];
        },
    }

    function copyToClipboard() {
        const password = document.getElementById('password');
        if (!password.innerHTML) return;

        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(password.innerHTML);
    }

    function getPassword() {
        const filtersChecked = document.querySelectorAll('[name="filters"]:checked');
        const hasExcludedCharacters = Boolean(document.querySelector('#exclude-characters:checked'));

        let filters = []

        for (let filter of filtersChecked)
            filters.push(filter.value);

        const password = generatePassword({ filters, hasExcludedCharacters });

        document.querySelector('#password').innerHTML = password;
    }

    function generatePassword(options) {
        const { filters, hasExcludedCharacters } = options;
        const characters = {
            downcase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
        }
        let password = [];

        const excludedCharacters = hasExcludedCharacters ?
            document.querySelector('#excluded-characters').value.split('') : [];

        passwordOptions.characters = excludedCharacters ?
            passwordOptions.excludeCharacters(excludedCharacters, characters) : characters;

        for (let filter of filters) {
            let max = document.querySelector(`#${filter}-max`).value;
            let min = document.querySelector(`#${filter}-min`).value;
            let random = Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
            let randomCharacters = [...Array(random)].map((s, i) => passwordOptions[filter]());
            password.push(...randomCharacters);
        }

        return password.sort(() => 0.5 - Math.random()).join('');
    }
});