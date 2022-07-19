interface NotificationUtil {
    (
        type: 'info' | 'error' | 'success' | 'warning',
        message: string,
        description?: string
    ): void
}

interface StorageUtil {
    localSet: (key: string, value: any) => void,
    localGet: (key: string) => string | number | Array<any> | Object | null,
    localRemove: (key: string) => void,
    localClear: () => void
}

interface ListParams {
    current: number,
    pageSize: number,
    [propsName: string]: any
}

interface RequestUtil {
    (
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        params?: {
            query?: object,
            body?: object
        },
        headers?: any
    ): Promise<any>
}