export const NumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const StringStripper = (stringValue) => {
    let strippedString = '';

    // Remove all punctuation
    strippedString = stringValue.replace(/ /g, '').replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, '');

    let numberToRomanize = '';
    let romanizedString = '';

    // Loop through each char in the string
    strippedString.split('').forEach((char, index) => {
        // If the char is a number, add it to the number to romanize later
        if (!isNaN(char)) {
            numberToRomanize += char;
        }

        // If the char is not a number, or is the last char
        if (isNaN(char) || index === strippedString.length - 1) {
            // Romanize the built up number and add to the new string
            if (numberToRomanize !== '') {
                romanizedString += Romanize(numberToRomanize);
            }

            // If the char is not a number, add it to the new string
            if (isNaN(char)) {
                romanizedString += char;
            }

            numberToRomanize = '';
        }
    });

    strippedString = romanizedString.toLowerCase();

    return strippedString;
}

export const Romanize = (num) => {
    if (!+num) {
        return false;
    }

    const digits = String(+num).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '';
    let i = 3;

    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    }

    return Array(+digits.join('') + 1).join('M') + roman;
}