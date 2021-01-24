declare namespace ExpandedCourseCardCssNamespace {
  export interface IExpandedCourseCardCss {
    card: string;
    "center-progress": string;
    centerProgress: string;
    container: string;
    content: string;
    course: string;
    "course-input": string;
    "course-input-focused": string;
    courseInput: string;
    courseInputFocused: string;
    "customization-buttons": string;
    customizationButtons: string;
    "display-contents": string;
    displayContents: string;
    expanded: string;
    header: string;
    "header-group": string;
    headerGroup: string;
    "no-elevation": string;
    noElevation: string;
    "right-header-group": string;
    rightHeaderGroup: string;
    "rotatable-icon": string;
    rotatableIcon: string;
  }
}

declare const ExpandedCourseCardCssModule: ExpandedCourseCardCssNamespace.IExpandedCourseCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpandedCourseCardCssNamespace.IExpandedCourseCardCss;
};

export = ExpandedCourseCardCssModule;
