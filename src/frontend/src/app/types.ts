interface DragonParents {
    m: DragonType,
    f: DragonType
}

interface DragonNoParents {
    m?: never,
    f?: never
}

interface DragonType {
    code: String,
    name: String,
    // need a solution for this any, it can be {} but TS
    // gets upset
    parents: DragonParents | any,
    gender: string,
    breed: String,
    //disabled: Boolean,
    display: 1 | 2,
    selected: Boolean
}

export type {
    DragonParents,
    DragonType
}