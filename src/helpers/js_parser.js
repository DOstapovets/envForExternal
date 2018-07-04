import * as _ from 'lodash';
import * as espree from 'espree';

export default (code, options) => {
    try {
        const espreeOptions = {
            ecmaVersion  : 9,
            ecmaFeatures : {
                globalReturn  : !_.get(options, 'expression'),
                impliedStrict : true
            }
        };
        espree.parse(code, espreeOptions);
    } catch (error) {
        if (_.get(options, 'debug')) {
            console.groupCollapsed(`JS code ${error.name}: '${error.message}' @${error.lineNumber}:${error.column}`);
            const middleLineNumber = Math.min(3, error.lineNumber - 1);
            const partialCode = code.split('\n').splice(error.lineNumber - middleLineNumber - 1, 1 + middleLineNumber * 2);
            _.forEach(partialCode, (line, i) => {
                const isErrorLine = i === middleLineNumber;
                const extraParams = isErrorLine ? ['font-weight: bold', 'color: red', 'color: inherited'] : [''];
                line = isErrorLine ? `${line.substr(0, error.column - 1)}%c${line[error.column - 1]}%c${line.substr(error.column)}` : line;
                console.info(`%c${`${error.lineNumber + i - middleLineNumber}:`.padStart(6)} ${line}`, ...extraParams);
            });
            console.groupEnd();
        }
        throw error;
    }
};
