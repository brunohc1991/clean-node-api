export interface TokenGenerator {
  generate: (id: String) => Promise<String>
}
