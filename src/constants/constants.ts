import i18next from '../i18n.ts'

export const TASK_STATUSES = {
    CREATED: i18next.t('task.status.created').toLowerCase(),
    APPOINTED: i18next.t('task.status.appointed').toLowerCase(),
    IN_PROGRESS: i18next.t('task.status.in-progress').toLowerCase(),
    ON_VERIFICATION: i18next.t('task.status.verification').toLowerCase(),
    CLOSED: i18next.t('task.status.closed').toLowerCase(),
    CANCELED: i18next.t('task.status.canceled').toLowerCase(),
    DEADLINE_CLOSED: i18next.t('task.status.deadline').toLowerCase(),
    NEED_WORK: i18next.t('task.status.need-work').toLowerCase(),
}

export const FILE_SIZE_UNITS = {
    BYTE: i18next.t('units.byte'),
    KB: i18next.t('units.kb'),
    MB: i18next.t('units.mb'),
    GB: i18next.t('units.gb'),
}

export const CHECKPOINT_COMPLETED_STATUSES = {
    MIN: 0,
    MEDIUM: 50,
    MAX: 90,
}

export enum CHECKPOINT_TYPES {
    CAR = 1,
    TRAIN,
    SHIP,
    PLANE,
    RIVER,
    MIXED,
    PEOPLE,
    LAKE,
}

export const QUALITY_STATUSES = {
    MEDIUM: 50,
    HIGH: 90,
}

export const FEEDBACK_SUBJECTS = {
    cleanliness: i18next.t('feedback.subject.cleanliness'),
    breakdown: i18next.t('feedback.subject.breakdown'),
}

export const FEEDBACK_DEPARTMENTS = {
    fss: i18next.t('feedback.department.fss'),
    customs: i18next.t('feedback.department.customs'),
}
