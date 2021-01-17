declare namespace SectionSelectCssNamespace {
  export interface ISectionSelectCss {
    "add-bottom-space": string;
    addBottomSpace: string;
    "dense-list-item": string;
    denseListItem: string;
    "divider-container": string;
    dividerContainer: string;
    "list-subheader-content": string;
    "list-subheader-dense": string;
    listSubheaderContent: string;
    listSubheaderDense: string;
    "meeting-type": string;
    meetingType: string;
    "my-icon-button": string;
    "my-list-item-icon": string;
    myIconButton: string;
    myListItemIcon: string;
    "name-honors-icon": string;
    nameHonorsIcon: string;
    "no-extra-space": string;
    "no-grades-available": string;
    "no-start-padding": string;
    noExtraSpace: string;
    noGradesAvailable: string;
    noStartPadding: string;
    "placeholder-text": string;
    placeholderText: string;
    "section-details-table": string;
    "section-name-container": string;
    "section-rows": string;
    sectionDetailsTable: string;
    sectionNameContainer: string;
    sectionRows: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssNamespace.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssNamespace.ISectionSelectCss;
};

export = SectionSelectCssModule;
