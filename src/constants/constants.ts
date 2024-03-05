import i18next from '../i18n.ts'

export const TASK_STATUSES = {
    IN_PROGRESS: i18next.t('task.status.in-progress').toLowerCase(),
    CLOSED: i18next.t('task.status.closed').toLowerCase(),
    CANCELED: i18next.t('task.status.canceled').toLowerCase(),
    APPOINTED: i18next.t('task.status.appointed').toLowerCase(),
    DEADLINE_CLOSED: i18next.t('task.status.deadline').toLowerCase(),
    NEED_WORK: i18next.t('task.status.need-work').toLowerCase(),
    ON_VERIFICATION: i18next.t('task.status.verification').toLowerCase(),
}

export const FILE_SIZE_UNITS = {
    BYTE: i18next.t('units.byte'),
    KB: i18next.t('units.kb'),
    MB: i18next.t('units.mb'),
    GB: i18next.t('units.gb'),
}

export const CHECKPOINT_COMPLETED_STATUSES = {
    MIN: 10,
    MEDIUM: 15,
    MAX: 20,
}

export const CHECKPOINT_TYPES = {
    CAR: 1,
    TRAIN: 2,
    SHIP: 3,
    PLANE: 4,
}

export const QUALITY_STATUSES = {
    MEDIUM: 50,
    HIGH: 80,
}
