// Normalize slug: lowercase, replace spaces with dashes, remove special chars
export const normalizeSlug = (input) => {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

export const createDebouncedSlugCheck = (checkFunction, delay = 500) => {
    return debounce(checkFunction, delay);
};
