declare module "react/jsx-runtime" {
    export default any;
}

declare module '*.module.scss' {
    const content: Record<string, string>;
    export default content;
}
