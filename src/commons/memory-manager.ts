const arraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;

    let isEqual = arr1.map((item: string) => arr2.includes(item))
        .reduce((a: boolean, b: boolean) => a && b, true);
    return isEqual;
}

const saveToLocalStorage = (key: string, newData: any) => {
    let existingData = localStorage.getItem(key);
    let dataArray = existingData ? JSON.parse(existingData) : [];

    let existingSet = new Set(dataArray);
    newData.forEach((biomoleculeId: string) => existingSet.add(biomoleculeId));
    localStorage.setItem(key, JSON.stringify([...existingSet]));
};

const removeFromLocalStorage = (key: string, dataToRemove: any) => {
    let existingData = localStorage.getItem(key);
    let dataArray = existingData ? JSON.parse(existingData) : [];

    let dataToSave = dataArray.filter((biomoleculeId: string) => !dataToRemove.includes(biomoleculeId));
    localStorage.setItem(key, JSON.stringify([...dataToSave]));
}

const getFromLocalStorage = (key: string) => {
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Error retrieving from local storage:', error);
        return null;
    }
};

export {saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage};