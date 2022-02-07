document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#gerenate-password').addEventListener('click', function () {
        const filtersChecked = document.querySelectorAll('[name="filters"]:checked');
        const passwordLength = +(document.querySelector('#password-length').value);
        let filters = []

        for (input of filtersChecked)
            filters.push(input.value);

        document.querySelector('#password').innerHTML = createPassword({ filters, passwordLength });
    })

    const optionsPassword = {
        uppercase() {
            return String.fromCharCode(Math.floor(Math.random() * (26)) + 65);
        },
        downcase() {
            return String.fromCharCode(Math.floor(Math.random() * (26)) + 97);
        },
        numbers() {
            return Math.floor(Math.random() * (10));
        },
        specialCharacters() {
            let characters = "!@#$%¨&*(){}`^~<>,.;:/*-+\|";
            return characters[Math.floor(characters.length * Math.random())];
        }
    }


    function createPassword(options) {
        console.log(options);
        const { filters, passwordLength = 8 } = options;
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomFilter = Math.floor(Math.random() * (filters.length));
            const filter = filters[randomFilter];
            password += filter ? optionsPassword[filter]() : optionsPassword.downcase();
        }
        return password;
    }
});