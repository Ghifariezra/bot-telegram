export const batch = <T>(arr: T[], size = 2): T[][] => {
    const result: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
        // console.log(i, i + size);
    }
    return result;
};
