
export type WindowPageProps<T> = {
    data: T,
    save: (data:T)=>void
}