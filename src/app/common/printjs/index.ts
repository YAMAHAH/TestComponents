import printInit from './init';

const printjs = printInit.init;

if (typeof window !== 'undefined') {
    window.printjs = printjs;
}

export default printjs;