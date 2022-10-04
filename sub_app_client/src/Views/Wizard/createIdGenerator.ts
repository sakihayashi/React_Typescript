export default function createIdGenerator(prefix: string): () => string {
    const generator = (function* idGenerator() {
        let index = 0;
        while (true) {
            yield `${prefix}-${index}`;
            index += 1;
        }
    })();

    return (): string => generator.next().value;
}
