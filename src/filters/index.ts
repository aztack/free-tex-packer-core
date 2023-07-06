import Filter from './Filter';
import Mask from './Mask';
import Grayscale from './Grayscale';

const list: typeof Filter[] = [
    Filter,
    Mask,
    Grayscale
];

function getFilterByType(type: string): typeof Filter | null {
    type = type.toLowerCase();

    for (let item of list) {
        if (item.type.toLowerCase() == type) {
            return item;
        }
    }
    return null;
}

export { getFilterByType, list };
