document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#gerenate-password').addEventListener('click', function () {
        const filtersChecked = document.querySelectorAll('[name="filters"]:checked');
        const passwordLength = +document.querySelector('#length').value;
        const hasExcludedCharacters = Boolean(document.querySelector('#exclude-characters:checked'));

        let filters = []

        for (let filter of filtersChecked)
            filters.push(filter.value);

        const generatePassword = configPassword({ filters, passwordLength, hasExcludedCharacters });

        document.querySelector('#password').innerHTML = generatePassword();
    })

    document.querySelector('#copy-password').addEventListener('click', function () {
        const password = document.getElementById('password');
        if (!password.innerHTML) return;

        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(password.innerHTML);
    });

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


    function configPassword(options) {
        const { filters, passwordLength, hasExcludedCharacters } = options;
        const characters = {
            downcase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
        }
        let password = '';

        const excludedCharacters = hasExcludedCharacters ?
            document.querySelector('#excluded-characters').value.split('') : [];

        passwordOptions.characters = excludedCharacters ?
            passwordOptions.excludeCharacters(excludedCharacters, characters) : characters;

        for (let i = 0; i < passwordLength; i++) {
            const randomFilter = Math.floor(Math.random() * (filters.length));
            const filter = filters[randomFilter];
            password += filter ?
                passwordOptions[filter](excludedCharacters) : passwordOptions.letters(excludedCharacters);
        }

        return () => password;
    }
});