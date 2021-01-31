declare namespace SchedulePreviewCssNamespace {
  export interface ISchedulePreviewCss {
    "card-header": string;
    cardHeader: string;
    "color-box": string;
    "color-box-placeholder": string;
    colorBox: string;
    colorBoxPlaceholder: string;
    "configure-card": string;
    configureCard: string;
    "details-button": string;
    detailsButton: string;
    "enable-pointer-events": string;
    enablePointerEvents: string;
    hidden: string;
    "instructor-name": string;
    instructorName: string;
    list: string;
    "list-item-contents": string;
    "list-item-text-container": string;
    "list-item-with-preview": string;
    listItemContents: string;
    listItemTextContainer: string;
    listItemWithPreview: string;
    "no-flex-shrink": string;
    "no-schedules": string;
    noFlexShrink: string;
    noSchedules: string;
    "schedule-content-container": string;
    "schedule-header": string;
    "schedule-name-container": string;
    "schedule-name-text": string;
    scheduleContentContainer: string;
    scheduleHeader: string;
    scheduleNameContainer: string;
    scheduleNameText: string;
    "schedules-loading-indicator": string;
    schedulesLoadingIndicator: string;
    "section-container": string;
    "section-label-row": string;
    "section-num": string;
    sectionContainer: string;
    sectionLabelRow: string;
    sectionNum: string;
    "x-icon-inner": string;
    "x-icon-outer": string;
    xIconInner: string;
    xIconOuter: string;
  }
}

declare const SchedulePreviewCssModule: SchedulePreviewCssNamespace.ISchedulePreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulePreviewCssNamespace.ISchedulePreviewCss;
};

export = SchedulePreviewCssModule;
