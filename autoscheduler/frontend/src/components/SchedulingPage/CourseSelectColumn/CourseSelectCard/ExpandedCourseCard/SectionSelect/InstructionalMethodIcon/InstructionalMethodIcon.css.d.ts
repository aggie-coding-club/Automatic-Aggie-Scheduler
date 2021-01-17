declare namespace InstructionalMethodIconCssNamespace {
  export interface IInstructionalMethodIconCss {
    "instructional-method-container": string;
    instructionalMethodContainer: string;
  }
}

declare const InstructionalMethodIconCssModule: InstructionalMethodIconCssNamespace.IInstructionalMethodIconCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InstructionalMethodIconCssNamespace.IInstructionalMethodIconCss;
};

export = InstructionalMethodIconCssModule;
