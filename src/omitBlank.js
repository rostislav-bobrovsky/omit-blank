function isEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}


function omitBlankItemsFromArray(array) {
    if (!Array.isArray(array)) {
        throw new TypeError('Omit Blank: Expected an array');
    }

    return array.map(e => {
        if (Array.isArray(e)) {
            return omitBlankItemsFromArray(e);
        } else if (e instanceof Object) {
            return omitBlankPropertiesFromObject(e);
        }
        return e;
    }).filter(e => e === 0 || (e instanceof Object ? !isEmpty(e) : e));
}

export default function omitBlankPropertiesFromObject(object) {
    if (!(object instanceof Object && !Array.isArray(object))) {
        throw new TypeError('Omit Blank: Expected an object');
    }

    const cleanObject = {};

    Object.keys(object).forEach(key => {
        if (Array.isArray(object[key])) {
            const tempCleanArray = omitBlankItemsFromArray(object[key]);

            if (tempCleanArray.length) {
                cleanObject[key] = [...tempCleanArray];
            }
        } else if (object[key] instanceof Object) {
            const cleanObjectField = isEmpty(object[key])
                ? {}
                : omitBlankPropertiesFromObject(object[key]);

            if (!isEmpty(cleanObjectField)) {
                cleanObject[key] = { ...cleanObjectField };
            }
        } else if (object[key] === 0 || object[key]) {
            cleanObject[key] = object[key];
        }
    });

    return cleanObject;
}
