import GridDataBound from "./GridDataBound";

export class GridDataBoundFilter implements GridDataBound {
    pageIndex?: number;
    pageSize?: number;
    sorting?: string;
    globalFilter?: string;
    filters?: string;

    constructor(initialState?: Partial<GridDataBound>) {
        Object.assign(this, initialState);
    }

    addFilter(id: string, value: string | number | boolean | null, operation: string = 'equals', type: string = 'string'): void {
        
        try {
            // Parse existing filters or initialize new array
            const currentFilters = this.filters ? JSON.parse(this.filters) : [];
            if (!value || value === '' || value === null || value === undefined || id === '' || id === null || id === undefined ) {
                return;
            }
            // Create new filter
            const newFilter = {
                id,
                value,
                operation,
                type
            };

            // Remove existing filter for the same field if it exists
            // const filterIndex = currentFilters.findIndex((f: any) => f.id === id);
            // if (filterIndex !== -1) {
            //     currentFilters.splice(filterIndex, 1);
            // }

            // Add new filter
            currentFilters.push(newFilter);

            // Update filters string
            this.filters = JSON.stringify(currentFilters);
        } catch (error) {
            console.error('Error adding filter:', error);
            this.filters = JSON.stringify([{ id, value, operation , type  }]);
        }
    }

    removeFilter(id: string): void {
        try {
            if (!this.filters) return;

            const currentFilters = JSON.parse(this.filters);
            const newFilters = currentFilters.filter((f: any) => f.id !== id);
            this.filters = JSON.stringify(newFilters);
        } catch (error) {
            console.error('Error removing filter:', error);
        }
    }

    clearFilters(): void {
        this.filters = undefined;
    }

    getFilters(): Array<{ id: string; value: string | number | boolean | null; operation: string; type: string }> {
        try {
            return this.filters ? JSON.parse(this.filters) : [];
        } catch {
            return [];
        }
    }
} 