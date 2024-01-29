// ValeAlert represents the JSON object returned by the Vale CLI.
export type ValeAlert = {
    Check: string
    Message: string
    Line: number
    Span: number[]
}
