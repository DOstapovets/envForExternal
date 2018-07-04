import _ from 'lodash';

export const stringifyObject = (item, options = {}) => {
    let res = '{';
    res += _.map(item, (value, key) => {
        if (options[key] && _.isFunction(options[key])) {
            return `${key}: ${options[key](value)}`;
        }
        return `${key}: ${value}`;
    }).join(', ');
    res += '}';
    return res;
};
