declare namespace ExpandedCourseCardCssNamespace {
  export interface IExpandedCourseCardCss {
    card: string;
    "center-progress": string;
    centerProgress: string;
    container: string;
    content: string;
    "course-input": string;
    "course-input-focused": string;
    courseInput: string;
    courseInputFocused: string;
    "customization-buttons": string;
    customizationButtons: string;
    header: string;
    "header-group": string;
    headerGroup: string;
    "no-elevation": string;
    noElevation: string;
  }
}

declare const ExpandedCourseCardCssModule: ExpandedCourseCardCssNamespace.IExpandedCourseCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpandedCourseCardCssNamespace.IExpandedCourseCardCss;
};

export = ExpandedCourseCardCssModule;
