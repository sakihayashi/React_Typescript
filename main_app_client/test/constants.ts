import * as _ from 'lodash';

export const localStorage = {
    getItem(name: string): string {
        return this[name];
    },
    removeItem(name: string) {
        return null;
    },
};
