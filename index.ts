declare function pipe<A extends any[], B, C>(ab: (...args: A) => B, bc: (b: B) => C): (...args: A) => C;

declare function list<T>(a: T): T[];
declare function box<V>(x: V): { value: V };

const listBox = pipe(list, box)  // <T>(a: T) => { value: T[] }
const boxList = pipe(box, list)  // <V>(x: V) => { value: V }[]

const x1 = listBox(42)  // { value: number[] }
const x2 = boxList('hello')  // { value: string }[]

const flip = <A, B, C>(f: (a: A, b: B) => C) => (b: B, a: A) => f(a, b)
const zip = <T, U>(x: T, y: U): [T, U] => [x, y]
const flipped = flip(zip)  // <T, U>(b: U, a: T) => [T, U]

const t1 = flipped(10, 'hello')  // [string, number]
const t2 = flipped(true, 0)  // [number, boolean]

export default {}