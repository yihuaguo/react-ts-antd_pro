const storage: StorageUtil = {
    localSet: (key, value) => {
        if (!key || !value) return
        let val = ''
        // 数组或对象
        if (value instanceof Object) {
            val = JSON.stringify(value)
        } else {
            val = value
        }
        window?.localStorage?.setItem(key, val)
    },
    localGet: (key) => {
        const val = window?.localStorage?.getItem(key) || ''
        // 数组或者对象
        return (val.match(/^{"|^\[/g) ? JSON.parse(val) : val) || null
    },
    localRemove: (key) => {
        window?.localStorage?.removeItem(key)
    },
    localClear: () => {
        window?.localStorage?.clear()
    },
}

export default storage;