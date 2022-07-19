import request from "@/utils/request";
import { listParamChange, listResultChange } from '@/utils/utils'

export const list = async (params: ListParams) => {
    const data = await request('GET', '/admin/product', {
        body: listParamChange(params)
    })
    return listResultChange(data)
}
