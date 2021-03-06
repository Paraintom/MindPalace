class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static isGuid(toTest) {
        var regexp = new RegExp('(^[^-]{8}-[^-]{4}-9[^-]{3}-[^-]{4}-[^-]{12}$)');
        var result = regexp.test(toTest);
        return result;
    }
}