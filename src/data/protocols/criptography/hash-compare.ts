export interface HashCompare {
  compare: (value: string, hash: string) => Promise<Boolean>
}
