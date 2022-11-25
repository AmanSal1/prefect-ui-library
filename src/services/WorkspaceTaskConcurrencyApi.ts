import { WorkspaceApi } from './WorkspaceApi'
import { ConcurrencyLimitResponse } from '@/models/api/ConcurrencyLimitResponse'
import { ConcurrencyLimit } from '@/models/ConcurrencyLimit'
import { ConcurrencyLimitCreate } from '@/models/ConcurrencyLimitCreate'
import { mapper } from '@/services/Mapper'


export class WorkspaceConcurrencyLimitsApi extends WorkspaceApi {

  protected routePrefix = '/concurrency_limit'

  public async getConcurrencyLimits(filter = {}): Promise<ConcurrencyLimit[]> {
    const { data } = await this.post<ConcurrencyLimitResponse[]>('/filter', filter)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async getConcurrencyLimit(id: string): Promise<ConcurrencyLimit> {
    const { data } = await this.get<ConcurrencyLimitResponse>(`/${id}`)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async getConcurrencyLimitByTag(tag: string): Promise<ConcurrencyLimit> {
    const { data } = await this.get<ConcurrencyLimitResponse>(`/tag/${tag}`)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async createConcurrencyLimit(search: ConcurrencyLimitCreate): Promise<ConcurrencyLimit> {
    const { data } = await this.put<ConcurrencyLimitResponse>('/', mapper.map('ConcurrencyLimitCreate', search, 'ConcurrencyLimitCreateRequest'))
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public deleteConcurrencyLimit(id: string): Promise<void> {
    return this.delete(`/${id}`)
  }

  public deleteConcurrencyLimitByTag(tag: string): Promise<void> {
    return this.delete(`/tag/${tag}`)
  }

}

