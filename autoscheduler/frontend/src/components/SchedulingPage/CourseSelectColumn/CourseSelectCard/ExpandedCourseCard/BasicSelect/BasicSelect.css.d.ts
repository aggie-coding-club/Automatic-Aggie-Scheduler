declare namespace BasicSelectCssNamespace {
  export interface IBasicSelectCss {
    "fit-content": string;
    fitContent: string;
    "placeholder-text": string;
    placeholderText: string;
    "select-menu": string;
    "select-root": string;
    selectMenu: string;
    selectRoot: string;
    "table-container": string;
    tableContainer: string;
  }
}

declare const BasicSelectCssModule: BasicSelectCssNamespace.IBasicSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BasicSelectCssNamespace.IBasicSelectCss;
};

export = BasicSelectCssModule;
