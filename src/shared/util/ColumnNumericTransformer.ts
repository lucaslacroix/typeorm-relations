class ColumnNumericTransformer {
    to(data: number): number {
        return data;
    }

    from(data: string): string {
        return parseFloat(data).toFixed(2);
    }
}

export default ColumnNumericTransformer;
