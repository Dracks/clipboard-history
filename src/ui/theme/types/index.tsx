
export interface CheckboxProps{
    id: string,
    value: boolean,
    text: string,
    onChange: (newValue: boolean)=>void
}

export interface SectionProps{
    title: string,
    children: any
}

export interface PageProps {
    children: any
}

export interface SelectProps {
    text: string,
    options: {[key:string]: string}
    selected: string
    onChange: (newValue: string)=>void
}

export interface TextFieldProps<T>{
    value: T,
    onChange: (newValue:T)=>void
}