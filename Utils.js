const resolveObject = (object, expectedKeys) => {
    const errArray = [];
    expectedKeys.forEach((key) => {
        if (undefined === (object[key])) {
            errArray.push(`${key} has to be defined`);
        }
    });

    return errArray.length ? errArray : true;
}

export { resolveObject };