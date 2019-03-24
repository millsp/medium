import { Length, Tail, Cast, Prev, Pos, Reverse, Iterator, Next } from './index'

// Pipe executes a sequence of functions one after the other in a way that each
// functions input is the previous functions' output. Its type looks like this:
// pipe<fA, fB, ...fN> => (...Parameters<fA>) => ReturnType<fN>

// Let's test it:
const piped = pipe(
    (name: string, age: number)         => ({name, age}),                // receive parameters
    (info: {name: string, age: number}) => `Welcome, ${info.name}`,      // receive previous return
    (message: string)                   => ({message, date: Date.now()}) // receive previous return
)

const test00 = piped('Jane', 28) // {message: 'Welcome, Jane', date: 123456789}

// So `pipe` creates a function from a sequence of functions from `fA` to `fN`:
declare function pipe<Fns extends any[]>(...args: Pipe<Fns>): 
    (...args: Parameters<First<Fns>>) => ReturnType<Last<Fns>>

//////////////////////////////////////////////////////////////////////////////////////////
// BASIC TOOLS #3 ////////////////////////////////////////////////////////////////////////

// Before we start, let's just a a few simple tools to our previous collection:

// Optimized the previous `Last`:
type Last<T extends any[]> = T[Length<Tail<T>>]

// An alias for an arrow function:
type Arrow<P extends any[] = any, R extends any = any> = (...args: P) => R

// Alias for a First tuple element:
type First<T extends any[]> = T[0] 

// Is number infinite (number) or not:
type IsInfinite<N extends number> =
    Iterator<N> extends infer I 
    ? Length<Cast<I, any[]>> extends 0
      ? true  // number
      : false // 0 | 1 | 2...
    : never 

//////////////////////////////////////////////////////////////////////////////////////////
// PIPE #NUMBERS /////////////////////////////////////////////////////////////////////////

// The technique used for `Curry` solves the problem of variadic types for
// `Curry`. And since we have a different scenario, we'll use mapped types:
type Pipe<Fns extends Arrow[]> = {
    [K in keyof Fns]: PipeItem<Fns, K>
}

// But why mapped types? Because TypeScript disallows to do recursive types on
// parameters that could be infinitely long... It's kind of normal, but there
// could be improvements. For instance, this is (logically) impossible:
declare function impossible<Fns extends any[]>(...args: Reverse<Fns>): any

// Similar to a recursive (iterative) type, mapped types have a counter which is
// called `K`. It's not exactly a counter, but on mapped tuples, it behaves like
// one. As it iterates, `K`'s values change from "0", "1", "2", "3"...  It's
// nice, So we have some kind of index number... But it's a string, and we can't
// do much with it. So we'll create a mapping to translate a string to a number:
type NumberOfMap = {
    '_': never,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
    '16': 16,
    '17': 17,
    '18': 18,
    '19': 19,
    '20': 20,
    '21': 21,
    '22': 22,
    '23': 23,
    '24': 24,
    '25': 25,
    '26': 26,
    '27': 27,
    '28': 28,
    '29': 29,
    '30': 30,
    '31': 31,
    '32': 32,
    '33': 33,
    '34': 34,
    '35': 35,
    '36': 36,
    '37': 37,
    '38': 38,
    '39': 39,
    '40': 40
}

type NumberOf<S extends string> =
    NumberOfMap[S extends keyof NumberOfMap ? S : '_']

// Let's test it:
type test01 = NumberOf<'35'> // 35

// It's not very elegant, but it comes with the advantage of patching a lack of
// features. And in this case, it's gonna help us translate `K` to a number. So
// here's another example to show what is does:

// Mapped type that get indexes
type Test02<T extends any[]> = {
    [K in keyof T]: K
}

// Mapped type that get indexes
type Test03<T extends any[]> = {
    [K in keyof T]: NumberOf<K>
}

type test02 = Test02<['a', 'b', 'c']> // ["0", "1", "2"]
type test03 = Test03<['a', 'b', 'c']> // [ 0,   1 ,  2 ]

// So this gives us full control over the iteration performed by mapped types.
// So now, when using mapped types, we'll know the position of each mapped item.

//////////////////////////////////////////////////////////////////////////////////////////
// PIPE #ITERATORS ///////////////////////////////////////////////////////////////////////

// So what's next? `Pipe` must check for us that the function sequence is valid.
// To do this, our mapped type has to link from functions output to next input.
// Any idea? We'll use our `Iterator` which has features like `Prev` and `Next`.

// We are going to make extensive use of `Iterator`, and in order not to bloat
// TS, I decided to put all `Iterator`s we'll ever need in some sort of cache:
type IteratorOfMap = {
    '_': never,
    '0': Iterator<0>,
    '1': Iterator<1>,
    '2': Iterator<2>,
    '3': Iterator<3>,
    '4': Iterator<4>,
    '5': Iterator<5>,
    '6': Iterator<6>,
    '7': Iterator<7>,
    '8': Iterator<8>,
    '9': Iterator<9>,
    '10': Iterator<10>,
    '11': Iterator<11>,
    '12': Iterator<12>,
    '13': Iterator<13>,
    '14': Iterator<14>,
    '15': Iterator<15>,
    '16': Iterator<16>,
    '17': Iterator<17>,
    '18': Iterator<18>,
    '19': Iterator<19>,
    '20': Iterator<20>,
    '21': Iterator<21>,
    '22': Iterator<22>,
    '23': Iterator<23>,
    '24': Iterator<24>,
    '25': Iterator<25>,
    '26': Iterator<26>,
    '27': Iterator<27>,
    '28': Iterator<28>,
    '29': Iterator<29>,
    '30': Iterator<30>,
    '31': Iterator<31>,
    '32': Iterator<32>,
    '33': Iterator<33>,
    '34': Iterator<34>,
    '35': Iterator<35>,
    '36': Iterator<36>,
    '37': Iterator<37>,
    '38': Iterator<38>,
    '39': Iterator<39>,
    '40': Iterator<40>
}

// Very Similar to the `NumberOfMap`, it maps string numbers to their iterator
// counterpart. Thanks to this, we can manipulate positions of the counter `K`:
type IteratorOf<Index extends string> = 
    IteratorOfMap[Index extends keyof IteratorOfMap ? Index : '_']

type test04 = Pos<IteratorOf<'30'>>       // 30
type test05 = Pos<Prev<IteratorOf<'30'>>> // 29

// This means that we can plug in onto `K` with the usual iteration tools, nice.
// Remember, we started doing all of this because `K` is a string. Let's finish:
type PipeItem<Fns extends Arrow[], K extends keyof Fns> =
    NumberOf<K> extends 0 
    ? Fns[K] // If it's the first item, then do nothing to it. Otherwise, like them:
    : (arg: ReturnType<Fns[Pos<Prev<IteratorOf<K>>>]>) => ReturnType<Fns[Pos<IteratorOf<K>>]>
    
// What happened?
// `Pos<Prev<IteratorOf<K>>>` is the previous item compared to the current one
// `Pos<IteratorOf<K>>` is the current item, is the one being iterated on now

// Both of those are positions that we queried `Fns` with. So what we did is:
// (arg: ReturnType<PreviousFunction>) => ReturnType<CurrentFunction>

// Let's test it:

// When it works
const test06 = pipe(
    (a: string) => true, 
    (arg: boolean) => new Object(), 
    (arg: {}) => 'string'
) // string

const test07 = pipe(
    (a: string) => [], 
    (...arg: any[]) => (() => {}), 
    (arg: Function) => arg
) // Function 

// When it warns
const test08 = pipe(
    (a: string) => true, 
    (arg: string) => new Object(), 
    (arg: {}) => 'string'
) // error

const test09 = pipe(
    (a: string) => [], 
    (...arg: any[]) => (() => {}), 
    (arg: []) => arg
) // error 

//////////////////////////////////////////////////////////////////////////////////////////
// LAST WORDS ////////////////////////////////////////////////////////////////////////////

// `NumberOfMap` and `IteratorOfMap` are not the most beautiful types, I will
// concede. But they help patch a lack of features when it comes to iteration.
// They should help remove type overloads that are often a lot of copy-paste.

// `Curry` and `Pipe` are two different variadic kinds. This is why they were
// constructed differently, yet they both address variadic type solving.

// I first thought that https://github.com/Microsoft/TypeScript/pull/30215 would
// help me to build `pipe` but I could not find a usage for it after refection.

//////////////////////////////////////////////////////////////////////////////////////////
// BONUS++ ///////////////////////////////////////////////////////////////////////////////

// We did not get so far and leave behind the cousin, `compose`. Because we
// still iterate with mapped types, we just have to invert `pipe`'s logic:
declare function compose<Fns extends any[]>(...args: Compose<Fns>): 
    (...args: Parameters<Last<Fns>>) => ReturnType<First<Fns>>

type Compose<Fns extends Arrow[]> = {
    [K in keyof Fns]: ComposeItem<Fns, K>
}

type ComposeItem<Fns extends Arrow[], K extends keyof Fns> =
    NumberOf<K> extends Length<Tail<Fns>> 
    ? Fns[K]
    : (arg: ReturnType<Fns[Pos<Next<IteratorOf<K>>>]>) => ReturnType<Fns[Pos<IteratorOf<K>>]>
    
// Let's test it:
const composed = compose(
    (message: string)                   => ({message, date: Date.now()}), // receive previous return
    (info: {name: string, age: number}) => `Welcome, ${info.name}`,       // receive previous return
    (name: string, age: number)         => ({name, age}),                 // receive parameters
)

const test10 = piped('Jane', 28) // {message: 'Welcome, Jane', date: 123456789}

export default {}