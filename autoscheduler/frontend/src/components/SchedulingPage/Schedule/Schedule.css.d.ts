declare namespace ScheduleCssNamespace {
  export interface IScheduleCss {
    "availabilities-loading-indicator": string;
    availabilitiesLoadingIndicator: string;
    "calendar-body": string;
    "calendar-container": string;
    "calendar-day": string;
    "calendar-row": string;
    calendarBody: string;
    calendarContainer: string;
    calendarDay: string;
    calendarRow: string;
    header: string;
    "header-tile": string;
    headerTile: string;
    "hour-label": string;
    "hour-marker": string;
    hourLabel: string;
    hourMarker: string;
    "meetings-container": string;
    meetingsContainer: string;
    "v-time-label-margin": string;
    vTimeLabelMargin: string;
  }
}

declare const ScheduleCssModule: ScheduleCssNamespace.IScheduleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleCssNamespace.IScheduleCss;
};

export = ScheduleCssModule;
