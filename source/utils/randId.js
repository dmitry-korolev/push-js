const MIN_LENGTH = 10;
const randId = function rand(min = MIN_LENGTH, prepend = '') {
    const result = Math.random().toString(36).slice(2); // eslint-disable-line no-magic-numbers

    return result.length >= MIN_LENGTH ? prepend + result : rand(min, prepend);
};

export default randId;
