import { FlowData } from '@/models/FlowData'
import { Schedule } from '@/models/Schedule'

export interface IDeployment {
  id: string,
  created: Date,
  updated: Date,
  name: string,
  flowId: string,
  flowData: FlowData,
  schedule: Schedule | null,
  isScheduleActive: boolean,
  parameters: Record<string, unknown>,
  tags: string[] | null,
}

export class Deployment implements IDeployment {
  public readonly id: string
  public created: Date
  public updated: Date
  public name: string
  public readonly flowId: string
  public flowData: FlowData
  public schedule: Schedule | null
  public isScheduleActive: boolean
  public parameters: Record<string, unknown>
  public tags: string[] | null

  public constructor(deployment: IDeployment) {
    this.id = deployment.id
    this.created = deployment.created
    this.updated = deployment.updated
    this.name = deployment.name
    this.flowId = deployment.flowId
    this.flowData = deployment.flowData
    this.schedule = deployment.schedule
    this.isScheduleActive = deployment.isScheduleActive
    this.parameters = deployment.parameters
    this.tags = deployment.tags
  }
}