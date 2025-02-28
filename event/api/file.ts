import { Event } from '../event'

type UploadTask = {
  missionId: string
  filename: string
  uploaded: number
  total: number
  status: 'UPLOADING' | 'DONE' | 'ERROR' | 'CANCEL'
}

type FileEventType = {
  'API:UPLOADED': string
  'API:UPLOADING': UploadTask
  'API:READY': boolean
}

const fileEventBus = new Event<FileEventType>()

let EventMissionQueue: Record<string, UploadTask> = {}

/**
 * Create a new mission
 * @returns The mission ID
 *
 */
function newMission(): string {
  const missionId = Math.random().toString(36).substr(2, 9)
  EventMissionQueue[missionId] = {
    missionId,
    filename: '',
    uploaded: 0,
    total: 0,
    status: 'UPLOADING',
  }
  return missionId
}

function updateMission(missionId: string, data: Partial<UploadTask>) {
  EventMissionQueue[missionId] = { ...EventMissionQueue[missionId], ...data }
  fileEventBus.publish('API:UPLOADING', EventMissionQueue[missionId])
}

function finishMission(missionId: string) {
  EventMissionQueue[missionId].status = 'DONE'
  fileEventBus.publish('API:UPLOADED', missionId)
}

export {
  EventMissionQueue,
  fileEventBus,
  updateMission,
  finishMission,
  newMission,
}
